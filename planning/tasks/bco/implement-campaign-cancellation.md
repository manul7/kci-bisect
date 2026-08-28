---
stream: "BCO"
topic: "Cancellation"
priority: high
publish: false
---

# Implement campaign cancellation

## Description

Implement the cancellation operation and state transition defined by the cancellation design task.
After cancellation is accepted, BCO must stop new work and handle pending work, in-flight work, late
results, and repeated requests exactly as that design defines.

## Contribution

- Delivers: Safe cancellation that stops work and freezes campaign decisions

## Acceptance criteria

- [ ] The BCO cancellation operation returns the response defined by the cancellation design.
- [ ] The first accepted request records the defined state transition once.
- [ ] A repeated request returns the defined reply and records no second transition.
- [ ] After acceptance, BCO starts no new selector, BTO, analyzer, decision, or verifier call.
- [ ] Pending work, in-flight work, and late results follow the rules defined by the cancellation
      design; a late result is saved for audit as that design defines and changes no decision,
      boundary, or campaign conclusion.
- [ ] Campaign status exposes the defined cancellation result using existing contract values.

## Sources

- [State store design](../../../docs/components/state-store.md)
- [BCO output](../../../docs/contracts/bco-output.md)
- [Cancellation design task](../design-and-docs/define-campaign-cancellation-behavior.md)
