---
name: create-node-express-project
description: 'Interactively scaffold a runnable Node.js and Express API project with TypeScript defaults'
agent: 'agent'
---

Create a minimal, runnable Node.js API project using **Express**, with **TypeScript** as the suggested default.

## Confirm Requirements

Inspect the destination workspace and applicable repository instructions before proposing a layout. Ask one concise round of questions before creating project files, using the ask-questions tool when available. Confirm:

- Project name and destination directory. Suggest a new backend directory when an existing frontend is present.
- TypeScript or JavaScript, suggesting TypeScript with strict checking and ES modules.
- Package manager, following existing lockfiles or suggesting npm for a new standalone project.
- Required endpoints and integrations. Suggest only `GET /health` returning HTTP 200 with `{ "status": "ok" }` for a minimal scaffold.
- Test approach. Reuse existing tooling, or propose Node's built-in test runner with Supertest and a compatible TypeScript runner when needed; obtain confirmation before introducing test tooling.

Honor preferences already supplied instead of asking for them again. Wait for answers before scaffolding. Preserve existing files and user changes; ask before replacing conflicting files or initializing into a nonempty directory. Do not change an existing frontend or introduce a monorepo unless requested.

## Scaffold

- Use the selected package manager to initialize the project and install current stable, compatible dependencies. Follow existing Node version requirements; otherwise use an active Node.js LTS release.
- Keep the structure small: an Express application module separate from the server startup module, a focused health endpoint test, and only necessary configuration files.
- For TypeScript, configure strict checking, compatible Node.js module resolution, and required type packages. Ensure development and compiled production execution both work with the chosen module format.
- Provide working `dev`, `build`, `start`, `typecheck`, and `test` scripts for TypeScript. For JavaScript, omit build and typecheck scripts unless meaningful tooling is explicitly requested.
- Read the port from the environment with a documented default. Validate it at startup, disable `X-Powered-By`, and provide consistent JSON 404 and unexpected-error responses without exposing stack traces or secrets.
- Keep HTTP handling, business logic, and persistence separate in responsibility without adding unused layers. Validate untrusted inputs for any requested endpoints.
- Test the health response, unknown-route behavior, and any requested endpoint's validation or failure cases. Avoid real external services in tests.
- Include a minimal `.gitignore`, an environment example without secrets when needed, and a concise README with prerequisites, setup, scripts, environment variables, and local API URL.

Do not add a database, authentication, Docker, deployment configuration, frontend, lint framework, or unrelated features unless requested or already required by the repository. Do not initialize Git, create branches, or commit changes unless requested.

## Verify And Report

Install dependencies with the selected package manager, then run the configured tests, TypeScript checks and build when applicable, and any existing relevant lint checks. Smoke-test the compiled server for TypeScript or the normal start command for JavaScript, including the health response. Stop temporary verification processes afterward.

Fix issues introduced by the scaffold. If installation or verification is blocked, state the exact limitation and do not claim checks passed. Finish with a short summary of created files, verification results, and exact setup, development, test, and production commands.
