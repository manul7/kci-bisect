---
stream: "BCO"
topic: "Executor"
priority: high
publish: false
---

# Store and apply Commit selector results

## Description

BCO must store each Commit selector result before starting work for a selected candidate. Mapping
terminal selector results to a campaign conclusion belongs to the campaign-finishing task.

## Contribution

- Delivers: Stored selection and application of the next candidate

## Acceptance criteria

- [ ] Every selector result is stored once against its selection round.
- [ ] A selected result creates one step.
- [ ] BCO applies each stored result once.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [Commit selection result](../../../docs/contracts/commit-selection-result.md)
