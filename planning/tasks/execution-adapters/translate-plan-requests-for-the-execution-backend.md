---
stream: "Execution adapters"
topic: "Planning"
priority: high
publish: false
---

# Translate plan requests for the execution backend

## Description

BTO must translate a build-test plan request into the selected backend format without exposing backend syntax
in the public contract.

## Contribution

- Delivers: Backend-specific execution requests without leaking backend syntax

## Acceptance criteria

- [ ] Map source, scope, composition, requested artifacts, and correlation IDs.
- [ ] Reject unsupported input before submission.
- [ ] Repeating the request produces the same backend plan.
- [ ] Logs omit credential values.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Build-test plan request](../../../docs/contracts/build-test-plan-request.md)
- [Execution composition](../../../docs/contracts/execution-composition.md)
