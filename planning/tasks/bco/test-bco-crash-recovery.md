---
stream: "BCO"
topic: "Recovery"
priority: high
publish: false
---

# Test BCO crash recovery

## Description

BCO records recovery intent around downstream calls; failure-injection tests must prove that each interruption
resumes without duplicating campaign work.

## Contribution

- Delivers: Evidence that BCO recovery does not duplicate campaign work

## Acceptance criteria

- [ ] Tests interrupt before and after each downstream call and state transition.
- [ ] A crash between BTO accepting a submission and BCO saving the `plan_id` recovers without a
      second plan or execution.
- [ ] Each restart reaches the same BCO output with no duplicate plans, evidence, decisions, or steps.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [State store design](../../../docs/components/state-store.md)
