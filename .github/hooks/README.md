# Format Edited Source

## Configuration

`format-source.json` is a workspace-scoped **Copilot harness** hook (version 1).
It uses `postToolUse`, a successful-tool lifecycle event, with a matcher for
Copilot's `edit`, `create`, `str_replace_editor`, and `apply_patch` tools.
It does not run before tool calls or for terminal commands. The runner additionally
requires `toolResult.resultType` to be `success`. This is not the older Local
harness's PascalCase/snake_case configuration.

The command runs from the workspace root and requires Node.js (verified locally:
24.11.0). No packages are installed or downloaded. Select **Copilot** as the
session target, admit/trust the workspace as required, and start a new session
after reviewing these files. Organization policy can restrict hook execution.

## Formatter Prerequisite

Repository inspection found no package manifest, Python dependency manifest,
formatter configuration, or formatter script. Consequently both formatter slots
in the runner's `policy` are deliberately `null`. A relevant edit produces an
explicit missing-formatter message in the agent's tool context; it does not claim
to format anything. Automatic formatting cannot work until the project has a
reviewed existing formatter command.

Once that prerequisite is satisfied, replace the relevant slot with an executable
and fixed argument array. For example, **only if Prettier already exists locally**:

```javascript
javascript: {
  executable: 'node',
  args: ['node_modules/prettier/bin/prettier.cjs', '--write', '--', '{file}'],
},
```

Verify the actual installed entry point first; the example is not an installed
dependency or a recommendation to install one. For an already configured Python
formatter, use its existing interpreter/executable and file-scoped write arguments
in the `python` slot. Do not use `npx`, download-on-demand runners, shell wrappers,
or project-wide commands such as `format .`. Existing package scripts are suitable
only when they exclusively forward the supplied filename, without a fixed broad
target. Prefer invoking their underlying formatter directly.

`{file}` must be a standalone argument appearing exactly once. Paths are absolute
arguments passed with `shell: false`; event contents never become shell commands.
Formatter executables, configurations, and plugins are trusted executable code:
review them and restrict agent edits to hook policy using your normal permissions.

## Scope And Failures

- Only the edited paths are considered, never all working-tree changes.
- `sourceFiles` initially allows only `test.js` and `test.py`. Add actual source
  files or relative directories to `sourceRoots` deliberately as the project grows.
- Supported extensions are `.ts`, `.tsx`, `.js`, `.jsx`, and `.py`.
- Dependency, build, generated, hidden, and virtual-environment directories,
  declaration/minified/generated filenames, generated header markers in the first
  2 KiB, symlinks, hardlinks, outside-workspace paths, deleted files, and files over
  1 MiB are skipped. Explicitly exclude any additional project-specific generated
  directories in `excluded`; arbitrary generated files cannot be inferred reliably.
- Native edit/create tools use `toolArgs.path`; arguments may be an object or JSON
  string. Patches use `toolArgs.input` or `toolArgs.patch` with standard
  `*** Add File:`, `*** Update File:`, and `*** Move to:` headers. Unknown tools
  are not interpreted. If your runtime uses different arguments, inspect a
  non-sensitive fixture before extending the adapter; do not guess from results.
- Missing formatters and command failures are reported through `additionalContext`.
  Child output is suppressed to avoid leaking source or secrets. Formatting does
  not undo the successful edit, and failure does not block the agent.
- Each formatter gets at most 3 seconds, with an 8-second aggregate runner budget
  and a 10-second harness timeout. Malformed input/configuration is reported on
  stderr with exit 2; Copilot treats this post-tool error as a warning. A harness
  timeout also warns and continues. Use direct foreground formatters, not commands
  that fork background jobs. A failing formatter may leave partial changes;
  always review the diff.

## Safe Testing

From the workspace root, first exercise the missing-formatter path without writes:

```sh
printf '%s' '{"toolName":"edit","toolArgs":{"path":"test.js"},"toolResult":{"resultType":"success"}}' | node .github/hooks/format-source.cjs --dry-run
```

Expect valid JSON with `additionalContext` explaining the missing JavaScript
formatter. After configuring one, the same dry run reports `Would format` without
executing it. A failed result (`resultType: "failure"`) or a read tool returns `{}`.
Malformed JSON produces a warning and exit 2.

Test real formatting in a disposable workspace copy, not on valuable uncommitted
work. Give the agent a harmless source edit in a new Copilot session, confirm the
formatter's output and the exact changed paths, and review agent debug logs for
hook invocation. Test an excluded generated path and a read-only tool too. In that
copy, an intentionally nonexistent executable tests missing-command reporting;
a fixed `node -e` command that exits nonzero tests failure reporting, and one that
keeps running tests the 3-second child timeout. Restore the reviewed policy after
these probes. Do not capture full tool payloads or source in diagnostic logs.

References: [Copilot hook schema and payloads](https://docs.github.com/en/copilot/reference/hooks-reference),
[VS Code harness selection](https://code.visualstudio.com/docs/copilot/customization/hooks).
Related future customization: restrict hook-policy edits through approval rules
before enabling formatter commands.
