---
stream: "BCO"
topic: "State model"
priority: high
publish: false
---

# Persist campaign lifecycle and membership

## Description

Campaign execution, status reads, and campaign sharing need the CR, lifecycle state, and trigger
membership in the BCO store.

## Contribution

- Delivers: Stored CRs, campaign lifecycle state, and trigger membership

## Acceptance criteria

- [ ] BCO stores accepted, running, completed, and failed transitions.
- [ ] Invalid transitions write nothing.
- [ ] Terminal campaign state does not change.
- [ ] BCO stores each attached Trigger once per campaign; repeated attachment writes no second
      record.

## Sources

- [State store design](../../../docs/components/state-store.md)
- [Bisection data model](../../../docs/bisection-data-model.md)
