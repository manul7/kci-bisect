---
stream: "Commit selector"
topic: "Selection"
priority: high
publish: false
---

# Implement standard bisect

## Description

BCO needs one deterministic candidate or terminal result from the current boundaries and recorded selector
marks.

## Contribution

- Delivers: Deterministic candidate selection and terminal bisect results

## Acceptance criteria

- [ ] Selection returns one candidate per round and converges to one commit.
- [ ] Blocked and invalid ranges return their terminal results.
- [ ] good, bad, skip, and weak marks drive selection as the contract defines.
- [ ] Merge history is supported, and replaying the same request returns the same result.

## Sources

- [Commit selector design](../../../docs/components/commit-selector.md)
- [Commit selection request](../../../docs/contracts/commit-selection-request.md)
- [Commit selection result](../../../docs/contracts/commit-selection-result.md)
