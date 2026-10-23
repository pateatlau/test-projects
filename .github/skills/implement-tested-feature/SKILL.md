---
name: implement-tested-feature
description: 'Use when implementing a small full-stack feature across existing frontend and backend code, including clarifying behavior, adding tests, handling validation and security, and verifying the change.'
argument-hint: 'Describe the feature, expected behavior, and known edge cases'
user-invocable: true
---

# Implement a Tested Feature

## When to Use

- Implement a small feature that may touch existing frontend, API, and data layers.
- Change behavior across those layers while preserving the project's current architecture and conventions.

Routine additive schema migrations may be part of a small feature when they follow existing project conventions. Ask for a narrower scope or clarification before a major redesign, a new architecture, a destructive or otherwise high-impact data-model change, or an unresolved security decision.

## Procedure

1. **Inspect the existing architecture.** Read applicable instructions and examine the nearest implementation, tests, dependency and tool configuration, relevant callers, and migration setup if persisted data may change. Identify which layers actually need to change. Follow existing patterns; do not assume a framework, test runner, or architecture that is not present.
2. **Define behavior and edge cases.** Translate the request into observable behavior, inputs, outputs, validation rules, error states, and any relevant authorization or persistence effects. Check empty, malformed, boundary, and failure cases where applicable. Ask a focused question before editing if an unresolved detail would change the behavior, data handling, or security model. Otherwise, state a small, reasonable assumption and proceed.
3. **Test first when practical.** Add or update focused tests that capture the intended behavior before implementation when the current test setup makes that practical. Prefer tests at the layer that best expresses the contract, reuse existing fixtures and helpers, and isolate external services. If test-first work is blocked by missing setup or an unclear contract, do not introduce test infrastructure or dependencies without a task-driven reason; implement the behavior and add focused tests as soon as practical, noting the limitation.
4. **Implement the smallest maintainable solution.** Change only the necessary layers, preserve public contracts unless the request requires changing them, and reuse existing components, validation, error handling, and data-access patterns. For persisted-data changes, follow the existing migration conventions and prefer additive, reversible changes. Avoid unrelated refactors and unnecessary dependencies.
5. **Handle failures and security at the relevant boundaries.** Validate untrusted input using existing facilities. Preserve authentication and authorization checks; avoid exposing secrets or internal exception details; use safe data-access patterns; and handle expected failures consistently. For frontend changes, cover relevant loading, empty, success, and error states using the existing UI conventions.
6. **Run focused checks first.** Execute the new or affected tests, then applicable migration validation, lint, type-check, build, or broader test commands when available and proportionate. Use commands supported by the repository's actual configuration. Diagnose failures caused by the change; do not change unrelated behavior merely to get a green run.
7. **Review the change.** Inspect the diff for regressions, missing edge cases, accidental unrelated edits, unnecessary dependencies, and consistency with local conventions. Confirm tests exercise user-visible or externally observable behavior rather than only implementation details.
8. **Report completion accurately.** Summarize behavior and files changed, list checks actually run and their results, and disclose tests or checks that could not run, why they were blocked, and any remaining limitations. Never report a check as passing unless it was executed and passed.

## Quality Criteria

- The change fits the existing architecture and touches only the layers needed for the requested behavior.
- Requirements and behavior-changing edge cases are explicit, with clarification requested when necessary.
- Tests cover the main behavior and relevant validation, error, boundary, and authorization cases.
- Input validation, error handling, and security controls follow existing project patterns.
- Focused checks are run before broader checks, and their results are reported truthfully.
- The final diff contains no unrelated edits or unjustified dependencies.
