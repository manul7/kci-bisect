---
stream: "Execution adapters"
topic: "Outcome normalization"
priority: high
publish: false
---

# Map backend results to plan outcomes

## Description

BTO must translate backend terminal states to content_result, infrastructure_failure, or invalid_request so
BCO never receives backend-specific states.

## Contribution

- Delivers: Backend-independent BTO plan outcomes for BCO

## Acceptance criteria

- [ ] Each documented backend terminal state maps to one plan outcome.
- [ ] Each outcome includes plan and request IDs; content results include analyzable output
      references, and failures keep any available diagnostic references.
- [ ] No good, bad, skip, or weak logic is added.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Runner outcome](../../../docs/contracts/runner-outcome.md)
- [Build-test plan result](../../../docs/contracts/build-test-plan-result.md)
