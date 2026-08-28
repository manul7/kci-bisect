---
stream: "E2E"
topic: "Recovery scenario"
priority: high
publish: false
---

# Test crash recovery during BTO work

## Description

BCO or BTO may restart while a plan is running or after its result is stored, including between a
backend accepting work and BTO saving the reply. Recovery must not duplicate the plan, evidence,
decision, step, or backend job.

## Contribution

- Delivers: Evidence that BCO and BTO recovery duplicates no attempt or backend work

## Acceptance criteria

- [ ] Tests restart BCO and BTO before and after plan submission and result lookup.
- [ ] Tests stop BTO before and after each planner, builder, and tester call.
- [ ] The backend receives no replacement job for work it already accepted.
- [ ] Each case reaches the same BCO output with one plan, evidence record, decision, and step per attempt.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BTO design](../../../docs/components/bto.md)
- [State store design](../../../docs/components/state-store.md)
