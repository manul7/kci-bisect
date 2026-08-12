---
stream: "BCO"
topic: "State model"
priority: high
publish: false
---

# Persist evidence, decisions, and final records

## Description

Campaign execution and BCO output need stored evidence, step decisions, and the terminal campaign record.

## Contribution

- Delivers: Stored evidence, decisions, and terminal campaign records

## Acceptance criteria

- [ ] Reads return the stored evidence, decision references, and BCO output.
- [ ] Each step has at most one final decision.
- [ ] Exactly one terminal campaign record is stored.

## Sources

- [State store design](../../../docs/components/state-store.md)
- [Bisection data model](../../../docs/bisection-data-model.md)
- [BCO output](../../../docs/contracts/bco-output.md)
- [Evidence storage design](../design-and-docs/define-evidence-storage.md)
