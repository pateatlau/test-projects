---
name: Create FastAPI Project
description: 'Scaffold a runnable Python API project with uv and FastAPI'
argument-hint: '[project name] [optional destination or preferences]'
agent: 'agent'
---

Create a minimal, runnable Python API project using **uv** and **FastAPI**.

Use the user's request as the project name, destination, and preferences. If these are not specified, use the current workspace and derive a sensible project name from its directory. Inspect the existing files and applicable repository instructions first. Preserve existing work: do not overwrite conflicting files; ask before replacing or moving anything. If an essential choice cannot be inferred safely, ask one concise clarifying question.

Scaffold with:

- A `pyproject.toml` managed by uv, with FastAPI and `uvicorn[standard]` as runtime dependencies.
- A `src`-based Python package with a FastAPI application and a small `/health` endpoint.
- A focused pytest test for the health endpoint, using FastAPI's `TestClient` and the necessary test dependencies.
- A concise README with setup, test, and local run commands.
- Any minimal package files needed for the chosen layout.

Use `uv` commands to initialize the project and manage dependencies where practical. Keep the scaffold small, use current stable compatible dependencies, and follow the repository's existing conventions when present. Do not add Docker, deployment configuration, authentication, or unrelated features unless requested.

After creating the files, run the focused tests (and `uv sync` if available). Fix issues caused by the scaffold. Finish with a short summary of the created structure and the commands to install dependencies, run tests, and start the API.
