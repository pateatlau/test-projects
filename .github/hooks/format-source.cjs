const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const workspaceRoot = path.resolve(__dirname, '../..');
const policy = {
  sourceFiles: ['test.js', 'test.py'],
  sourceRoots: [],
  formatters: { javascript: null, python: null },
};
const extensions = new Map([
  ['.ts', 'javascript'],
  ['.tsx', 'javascript'],
  ['.js', 'javascript'],
  ['.jsx', 'javascript'],
  ['.py', 'python'],
]);
const excluded = new Set([
  'node_modules',
  'vendor',
  'dist',
  'build',
  'out',
  'coverage',
  'generated',
  '__generated__',
  '__pycache__',
  'venv',
  'env',
]);

function editedPaths(event) {
  if (event?.toolResult?.resultType !== 'success') return [];
  const args =
    typeof event.toolArgs === 'string'
      ? JSON.parse(event.toolArgs)
      : event.toolArgs;
  if (!args || typeof args !== 'object')
    throw new Error('Missing tool arguments.');
  if (['edit', 'create', 'str_replace_editor'].includes(event.toolName)) {
    if (
      args.command &&
      !['create', 'str_replace', 'insert'].includes(args.command)
    ) {
      return [];
    }
    if (typeof args.path !== 'string')
      throw new Error('Edit tool has no path.');
    return [args.path];
  }
  if (event.toolName === 'apply_patch') {
    const patch = typeof args.input === 'string' ? args.input : args.patch;
    if (typeof patch !== 'string')
      throw new Error('Patch tool has no input or patch.');
    return [
      ...patch.matchAll(
        /^\*\*\* (?:Add File: |Update File: |Move to: )(.+)$/gm,
      ),
    ].map((match) => match[1].replace(/\r$/, ''));
  }
  return [];
}

function sourceFile(candidate, root, settings) {
  if (typeof candidate !== 'string' || /[\x00-\x1f\x7f]/.test(candidate))
    return null;
  const absolute = path.resolve(root, candidate);
  const relative = path.relative(root, absolute);
  if (
    !relative ||
    relative.startsWith(`..${path.sep}`) ||
    relative === '..' ||
    path.isAbsolute(relative)
  )
    return null;
  const parts = relative.split(path.sep);
  if (
    parts.some(
      (part) => part.startsWith('.') || excluded.has(part.toLowerCase()),
    )
  ) {
    return null;
  }
  const normalized = parts.join('/');
  if (
    !settings.sourceFiles.includes(normalized) &&
    !settings.sourceRoots.some((prefix) => normalized.startsWith(`${prefix}/`))
  ) {
    return null;
  }
  const language = extensions.get(path.extname(absolute));
  if (
    !language ||
    /(?:\.min\.[jt]sx?$|\.d\.ts$|[.-]generated\.)/i.test(absolute)
  ) {
    return null;
  }
  let current = root;
  try {
    for (const part of parts) {
      current = path.join(current, part);
      if (fs.lstatSync(current).isSymbolicLink()) return null;
    }
    const stat = fs.statSync(absolute);
    if (!stat.isFile() || stat.nlink !== 1 || stat.size > 1024 * 1024)
      return null;
    const descriptor = fs.openSync(absolute, 'r');
    const header = Buffer.alloc(2048);
    let bytes;
    try {
      bytes = fs.readSync(descriptor, header, 0, header.length, 0);
    } finally {
      fs.closeSync(descriptor);
    }
    if (
      /@generated|auto[- ]generated|do not edit/i.test(
        header.toString('utf8', 0, bytes),
      )
    ) {
      return null;
    }
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  return { absolute, language };
}

function formatEvent(event, options = {}) {
  const root = fs.realpathSync(options.root ?? workspaceRoot);
  const settings = options.settings ?? policy;
  const deadline = Date.now() + 8000;
  const messages = new Set();
  const targets = new Set(editedPaths(event));
  for (const candidate of targets) {
    if (Date.now() >= deadline) {
      messages.add(
        'Formatting stopped: the 8-second execution budget was exhausted.',
      );
      break;
    }
    const target = sourceFile(candidate, root, settings);
    if (!target) continue;
    const formatter = settings.formatters[target.language];
    if (!formatter) {
      messages.add(
        `No existing ${target.language} formatter is configured; formatting skipped. Review policy in .github/hooks/format-source.cjs.`,
      );
      continue;
    }
    if (
      typeof formatter.executable !== 'string' ||
      !formatter.executable ||
      !Array.isArray(formatter.args) ||
      !formatter.args.every((argument) => typeof argument === 'string') ||
      formatter.args.filter((argument) => argument === '{file}').length !== 1
    ) {
      throw new Error(
        'Formatter must have an executable and args containing exactly one {file}.',
      );
    }
    if (options.dryRun) {
      messages.add(
        `Would format ${JSON.stringify(path.relative(root, target.absolute))}.`,
      );
      continue;
    }
    const args = formatter.args.map((argument) =>
      argument === '{file}' ? target.absolute : argument,
    );
    const result = spawnSync(formatter.executable, args, {
      cwd: root,
      shell: false,
      timeout: Math.max(1, Math.min(3000, deadline - Date.now())),
      killSignal: 'SIGKILL',
      stdio: ['ignore', 'ignore', 'ignore'],
    });
    if (result.error || result.status !== 0) {
      const reason =
        result.error?.code ??
        (result.signal ? `signal ${result.signal}` : `exit ${result.status}`);
      messages.add(
        `Formatter failed (${reason}) for ${JSON.stringify(path.relative(root, target.absolute))}; formatting is not guaranteed. Run the reviewed formatter manually for diagnostics.`,
      );
    }
  }
  return messages.size ? { additionalContext: [...messages].join('\n') } : {};
}

async function main() {
  const chunks = [];
  let size = 0;
  for await (const chunk of process.stdin) {
    size += chunk.length;
    if (size > 1024 * 1024)
      throw new Error('Hook event exceeds the 1 MiB input limit.');
    chunks.push(chunk);
  }
  const event = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  process.stdout.write(
    JSON.stringify(
      formatEvent(event, {
        dryRun: process.argv.includes('--dry-run'),
      }),
    ),
  );
}

if (require.main === module) {
  main().catch(() => {
    const message =
      'Source-format hook failed: invalid input, configuration, or filesystem access. No formatting guarantee; inspect the hook and retry safely.';
    process.stderr.write(`${message}\n`);
    process.stdout.write(JSON.stringify({ additionalContext: message }));
    process.exitCode = 2;
  });
}

module.exports = { editedPaths, formatEvent };
