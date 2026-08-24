---
stream: "BCO"
topic: "MVP deployment"
priority: high
publish: false
---

# Run one BCO campaign executor for the MVP

## Description

The MVP does not use campaign leases. Update the design and deployment configuration so the whole
MVP deployment runs one campaign executor and never overlaps the old and replacement executors.

## Contribution

- Delivers: One BCO campaign executor with no overlap in the MVP deployment

## Acceptance criteria

- [ ] Architecture, BCO, State store, the component catalog, and the data model describe one MVP
      campaign executor and no campaign leases.
- [ ] `ownership-boundary.mmd`, `recovery.mmd`, and `single-candidate-step.mmd` show persisted next
      action without lease acquisition, renewal, release, expiry, or handoff.
- [ ] The MVP deployment configuration starts exactly one BCO campaign executor.
- [ ] A deployment update stops the current executor before starting its replacement.
- [ ] A CI check fails if the deployment configuration requests more than one campaign executor or
      permits the old and replacement executors to overlap.
- [ ] The deployment documentation states that the MVP has no automatic campaign-executor failover
      or overlapping executor rollout.
- [ ] Persisted next action remains available for restart recovery after the previous executor exits.

## Sources

- [Proposed MVP executor decision](../../../docs/adr/20260824-one-bco-campaign-executor-in-the-mvp.md)
- [Architecture](../../../docs/architecture.md)
- [Component catalog](../../../docs/components.md)
- [Bisection data model](../../../docs/bisection-data-model.md)
- [BCO design](../../../docs/components/bco.md)
- [State store design](../../../docs/components/state-store.md)
- [Ownership boundary source diagram](../../../docs/diagrams/ownership-boundary.mmd)
- [Recovery source diagram](../../../docs/diagrams/recovery.mmd)
- [Single-candidate step source diagram](../../../docs/diagrams/single-candidate-step.mmd)
