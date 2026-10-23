# Project Coding Instructions

## Workspace Context

- This workspace contains three separately managed applications: a React and TypeScript frontend built with Vite, an Express and TypeScript backend, and a FastAPI backend managed with uv.
- The frontend currently has build and lint scripts but no configured test script. The Node backend has test, type-check, and build scripts. The Python backend has pytest configured; no lint or type-check command is documented.
- Each application has its own dependencies and configuration. Do not assume a shared runtime, deployment, database, or integration between applications unless the code or configuration establishes one.
- Follow the [language coding standards](instructions/language-coding-standards.instructions.md) when they apply. Treat examples in customization files as guidance, not evidence that a tool or dependency is installed.

## Coding Requirements

- Inspect the relevant implementation, tests, dependencies, and configuration before editing. Prefer established project patterns and dependencies; avoid unrelated refactors or adding tools without a clear need.
- Use precise types for public interfaces and data shapes. Validate external values before relying on their types, and follow the project's existing compiler and lint settings rather than changing them implicitly.
- Keep responsibilities clear at existing boundaries: user interface code handles presentation and interaction, API handlers handle transport concerns, and domain or persistence logic stays in its established module. Do not invent layers or directory structures without a task-driven reason.
- Validate untrusted input at system boundaries, including request data and external service responses. Handle expected failures consistently; return appropriate public errors while keeping stack traces, secrets, and internal diagnostics out of client responses.
- Keep secrets out of source code, tests, logs, and client bundles. Reuse established configuration and secret-management mechanisms. Use safe, parameterized operations for data stores and preserve existing authentication and authorization checks.
- Add or update focused tests for behavior changes using the project's existing test tools. Cover relevant success, boundary, validation, and failure behavior; isolate external services in tests. When a project has no test setup, use available checks and describe the verification gap rather than treating example scripts as tests.

## Verification and Scope

- Discover commands from the relevant project's package manifest, tool configuration, and documentation. Current checks include frontend `npm run build` and `npm run lint`; Node backend `npm test`, `npm run typecheck`, and `npm run build`; and Python backend `uv run pytest`. Run only the checks relevant to the change, and do not invent scripts or claim unavailable checks passed.
- Report the checks run and their results. Note meaningful verification gaps and the smallest practical next step.
- Review the final diff, including new files. Preserve unrelated user changes, keep edits scoped to the request, and summarize the files changed.
