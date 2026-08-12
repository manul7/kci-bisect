---
stream: "BTO"
topic: "Execution"
priority: high
publish: false
---

# Execute one plan

## Description

BTO must execute one accepted plan through its selected composition and record the result.

## Contribution

- Delivers: Backend execution and a final result for one BTO plan

## Acceptance criteria

- [ ] BTO executes the plan through the selected composition.
- [ ] Choose and record how an accepted plan starts; normal operation starts it once.
- [ ] BTO records one final build-test plan result.
- [ ] BTO issues each backend call once on the successful execution path.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Execution composition](../../../docs/contracts/execution-composition.md)
- [Runner outcome](../../../docs/contracts/runner-outcome.md)
