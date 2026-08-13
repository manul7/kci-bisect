---
stream: "BCO"
topic: "Executor"
priority: high
publish: false
---

# Request one step decision

## Description

BCO must store one Decision engine result before moving search boundaries. This task implements
the ID and result checks saving needs; the remaining negative cases belong to the
contract-check tasks.

## Contribution

- Delivers: One durable decision per analyzed campaign step

## Acceptance criteria

- [ ] The request IDs, regression type, scope, expected signal, and strategy match the step.
- [ ] BCO stores one decision result against the step.
- [ ] Invalid results stop the campaign without moving boundaries.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [Decision contract](../../../docs/contracts/decision-contract.md)
