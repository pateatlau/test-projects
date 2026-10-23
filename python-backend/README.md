# Python Backend

Minimal FastAPI project managed by uv, with a src-based package and pytest tests. Requires Python 3.14 or newer and uv; `.python-version` selects Python 3.14 for local development.

## Setup

From the workspace root:

```sh
cd python-backend
uv sync --locked
```

uv creates the local `.venv` and installs the package, runtime dependencies, and development dependencies. If the pinned interpreter is unavailable, install it with `uv python install 3.14`.

## Run

```sh
uv run uvicorn python_backend.main:app --reload --port 8001
```

The API runs at http://127.0.0.1:8001. `GET /health` returns HTTP 200 with `{"status":"ok"}`. Interactive API documentation is available at http://127.0.0.1:8001/docs. Keep `--port 8001` in the command to avoid Uvicorn's default port 8000.

Run without development reload:

```sh
uv run uvicorn python_backend.main:app --port 8001
```

## Tests

```sh
uv run pytest
```

The tests use FastAPI's TestClient without starting a network server or calling external services. They cover the health response, unknown routes, and unsupported methods. No lint or type-check command is configured.

## Structure

- `pyproject.toml`: Package, dependencies, build backend, and pytest configuration.
- `uv.lock`: Reproducible dependency resolution; keep it in version control.
- `src/python_backend/main.py`: FastAPI application and health response model.
- `tests/test_health.py`: API contract tests.

This project is independent of the existing frontend and Node backend. No authentication, database, CORS policy, or frontend integration is configured.
