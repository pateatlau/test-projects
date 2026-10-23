---
name: fastapi-endpoints-tests
description: 'Create or change FastAPI API endpoints and write focused pytest tests for request validation, responses, errors, and dependencies. Use when implementing or debugging FastAPI routes and their tests.'
argument-hint: 'Describe the endpoint behavior, inputs, and expected responses'
user-invocable: true
---

# FastAPI Endpoints and Tests

## When to Use

- Add or modify a FastAPI route or API endpoint.
- Write or update pytest coverage for endpoint behavior.
- Debug a failing FastAPI endpoint test.

## Procedure

1. **Inspect the project.** Read applicable instructions, dependency and test configuration, the app entry point, nearby routes, schemas, dependencies, and test fixtures. Follow the installed FastAPI, Pydantic, and pytest versions and the project's established structure. Do not introduce a new router, service, or test architecture when an existing pattern fits.
2. **Define the contract.** Identify the HTTP method and path, request shape, validation rules, response schema and status, expected error behavior, and relevant authentication or authorization. If the request leaves a behavior-changing detail unclear, ask one focused question before coding.
3. **Implement the smallest coherent change.** Reuse existing Pydantic models, dependency providers, exception handlers, and service or persistence layers. Keep HTTP concerns in the route layer according to local conventions. Validate untrusted input, return intentional status codes, and do not expose internal exception details or secrets.
4. **Test the endpoint.** Prioritize route-level request/response tests using the project's pytest setup and FastAPI `TestClient`; these validate the HTTP contract rather than serving as strict unit tests. Prefer existing fixtures and dependency overrides. Cover the successful response and, where relevant, invalid input, expected errors, authorization, and boundary cases. Assert status codes and meaningful response data, not incidental implementation details. Isolate external services and databases using the project's established mocks, dependency overrides, or test fixtures; do not make real network calls.
5. **Run focused checks.** Run the new or affected tests first, then applicable project lint, type-check, or broader test commands when available. Diagnose failures and repair issues within the endpoint change; do not alter unrelated behavior to make tests pass.
6. **Report completion.** Summarize the endpoint behavior and files changed, list the checks run and their results, and call out any unverified behavior or environmental blocker.

## Quality Criteria

- The endpoint follows existing routing, schema, dependency, and error-handling conventions.
- Request validation and response status/schema are explicit and consistent with the intended API contract.
- Tests verify externally observable behavior and isolate side effects.
- Changes stay scoped; dependencies and project configuration are not added unless required by the task.
