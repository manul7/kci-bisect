---
stream: "E2E"
topic: "Cancellation scenario"
priority: high
publish: false
---

# Test campaign cancellation

## Description

Cancellation must stop future campaign work and prevent in-flight results from changing decisions or the
campaign conclusion.

## Contribution

- Delivers: Evidence that cancellation remains safe through BTO work and restart

## Acceptance criteria

- [ ] Tests cancel before work and during BTO execution.
- [ ] Tests check that only an authorized Trigger can cancel.
- [ ] Tests check that no new selector, BTO, analyzer, decision, or verifier call starts after
      cancellation.
- [ ] Tests deliver a late result and find it kept for audit with no decision, boundary, or
      conclusion change.
- [ ] After a service restart during cancellation, the campaign still ends in the defined
      cancelled state and no new work starts.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [State store design](../../../docs/components/state-store.md)
- [Cancellation design task](../design-and-docs/define-campaign-cancellation-behavior.md)
