---
name: Language Coding Standards
description: 'Use when writing or reviewing Python, Node.js, JavaScript, TypeScript, or React code. Apply maintainable, secure, accessible conventions while respecting project tooling and patterns.'
applyTo: '**/*.py, **/*.js, **/*.mjs, **/*.cjs, **/*.ts, **/*.mts, **/*.cts, **/*.jsx, **/*.tsx'
---

# Language Coding Standards

- Inspect nearby code, project configuration, and tests before making changes. Follow established conventions and supported runtime versions; when they differ from these defaults, prefer the project's conventions unless they create a correctness, security, or accessibility problem.
- For new projects with no tooling choice, recommend Ruff for Python and ESLint with Prettier for JavaScript, TypeScript, and React. Do not add or reconfigure these tools in an existing project unless the task calls for it.
- Keep changes focused and readable. Use descriptive names, small cohesive functions, and abstractions only when they reduce meaningful duplication or complexity. Preserve public behavior unless the task calls for a change.
- Validate external input at system boundaries, handle errors deliberately, and avoid exposing secrets or sensitive data. Do not add dependencies or tooling configuration to an existing project solely to satisfy these guidelines.
- Add or update focused tests for changed behavior, including relevant edge cases and failure paths. Use the test framework and conventions already present.

## Python

- Follow PEP 8 and the project's configured formatter and linter. Use type annotations for public interfaces and non-obvious data shapes, and keep annotations compatible with the supported Python versions.
- Prefer standard-library tools such as `pathlib` and context managers where appropriate. Avoid mutable default arguments, broad exception handling, and blocking work inside async code.

## Node.js, JavaScript, and TypeScript

- Follow the project's module system, language target, and lint/format configuration. Prefer TypeScript's inferred or explicit precise types over `any`; represent uncertain or external data as `unknown` until validated.
- Handle promises intentionally with `async`/`await` or explicit chaining, and ensure failures are observed. Use platform APIs appropriate to the execution environment; do not assume browser APIs are available in Node.js or vice versa.

## React

- Follow the React version and component patterns already used. Prefer function components and built-in Hooks; keep state close to its owner and avoid effects when derived values can be calculated during render.
- Keep Hooks unconditional and at the top level. Do not read or write refs during render; synchronize refs in effects or event handlers. Do not add memoization by default.
- Use stable keys for rendered collections, semantic HTML, and accessible names and states for interactive controls. Preserve keyboard operation and focus behavior when changing interactions.
