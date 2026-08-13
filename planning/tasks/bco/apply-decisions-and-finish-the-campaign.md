---
stream: "BCO"
topic: "Executor"
priority: high
publish: false
---

# Apply decisions and finish the campaign

## Description

BCO must update search state from stored decisions and map terminal Commit selector results to one campaign
conclusion.

## Contribution

- Delivers: Campaign boundary updates and terminal conclusions from stored decisions

## Acceptance criteria

- [ ] A `good` decision moves the good boundary and a `bad` decision moves the bad boundary.
- [ ] A `skip` or `weak` decision moves no boundary.
- [ ] Selector convergence, blocked state, and failure produce the documented BCO output.
- [ ] A campaign with no `bad` decision records `not_confirmed` instead of a culprit.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [Commit selection result](../../../docs/contracts/commit-selection-result.md)
- [BCO output](../../../docs/contracts/bco-output.md)
