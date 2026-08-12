---
stream: "BCO"
topic: "State model"
priority: high
publish: false
---

# Persist steps and attempts

## Description

BCO needs each selected candidate, attempt, and plan reference for campaign execution. This task
covers store behavior only. Decided transitions are proved with the later decision records, and
plan side effects with the later plan-submission task.

## Contribution

- Delivers: Stored candidate, attempt, and plan records

## Acceptance criteria

- [ ] BCO stores steps, attempt IDs and numbers, and plan IDs as nonterminal records.
- [ ] One plan ID cannot be attached to two attempts.
- [ ] Replaying a stored write changes no record.

## Sources

- [State store design](../../../docs/components/state-store.md)
- [Bisection data model](../../../docs/bisection-data-model.md)
