---
name: 'generate-api-client'
description: 'Generate a typed TypeScript API client and unit tests from a supplied API contract or example JSON response.'
argument-hint: 'Provide or attach an API contract or example JSON, plus known endpoint and authentication details'
agent: 'agent'
---

Generate a typed TypeScript API client for the API contract or example JSON supplied in the invocation, attachments, or selected context.

## Establish Inputs

- Read applicable repository instructions and inspect the nearest existing HTTP client, API types, runtime validators, and unit tests. Follow the project's TypeScript configuration, file organization, and naming conventions.
- Treat an explicit API contract as authoritative. If examples conflict with it, ask for clarification.
- Before implementation, ask for missing details needed to implement the requested operations: contract or response examples, endpoint paths, HTTP methods, base URL configuration, path/query parameters, request bodies, response status codes and bodies, and authentication requirements. Ask only about unresolved details; reuse facts established by the supplied contract or project code.
- Do not invent endpoints, request properties, response fields, authentication schemes, or error payloads. Example JSON alone does not establish required versus optional fields, nullability, all possible values, or error behavior. Ask about those distinctions when needed for correct types or validation. Empty arrays and null values do not establish their element or underlying types.
- If only response JSON is supplied, obtain the corresponding operation details before generating a callable client. Do not guess CRUD operations or expand beyond the requested API surface.
- Never request literal credentials. Use the project's existing authentication or configuration mechanism.

## Implement the Client

- Define explicit, exported request and response types for each requested operation, including path/query parameters and bodies where applicable. Model documented optionality, nullability, and status-dependent responses accurately; do not use `any` to bypass uncertainty.
- Use the project's existing HTTP client or transport wrapper if one exists, preserving its authentication, interceptors, configuration, and error conventions. Otherwise use the target runtime's built-in HTTP capability when available.
- Encode path and query parameters correctly and apply only contract-appropriate headers and body serialization. Do not add retries or other behavior absent from the contract or project conventions.
- Treat untrusted response data as `unknown` until validated. Reuse existing runtime validation facilities; otherwise implement small, focused type guards. A type assertion or a generic HTTP response type is not runtime validation.
- Handle non-success HTTP responses, malformed JSON, schema-invalid responses, and network failures explicitly. Respect documented success statuses, empty bodies such as 204 responses, and non-JSON responses where specified.
- Preserve useful status and cause information using the project's error conventions, and let callers distinguish HTTP errors, invalid responses, and transport failures. Do not misclassify parsing or validation failures as network failures or expose credentials in errors.
- Avoid new dependencies. If a dependency is genuinely necessary, explain why existing utilities and runtime features are insufficient and ask before adding it.
- Keep edits limited to the requested client, types, tests, and necessary integration points. Do not make real API requests or change unrelated code.

## Test and Verify

- Generate unit tests using the existing framework and mocking patterns. Mock the HTTP boundary; do not depend on live services or credentials.
- Cover a successful request and validated response, correct request construction, HTTP errors, malformed JSON where applicable, schema-invalid responses, and network rejection. Test documented empty responses, optional/null fields, and status-dependent variants where applicable.
- Verify that failures retain the intended error classification and useful status/cause information without leaking secrets.
- Run focused unit tests and the available TypeScript, lint, or build checks relevant to the changed files. If no test framework exists, ask how tests should be run before introducing test tooling or dependencies.
- Report checks actually run and their results. Explicitly identify anything not verified; do not claim unexecuted tests passed.

## Final Response

Keep the summary concise and include:

- Implemented operations and the reused HTTP client or chosen transport.
- Confirmed assumptions and any remaining limitations. Assumptions must not replace missing API details that require clarification.
- Every file created or modified, with a short description of its purpose.
- Tests and checks run, their outcomes, and any checks that could not be run.
