# ADR-20260824: One BCO campaign executor in the MVP

## Status

Proposed — 2026-08-24

## Context

The component design used campaign leases to let multiple BCO campaign executors share work safely.
The MVP does not need horizontal executor scaling, automatic executor failover, or overlapping
executor rollouts. Implementing leases and safe lease handoff would add work before those deployment
modes provide user value.

## Decision

The whole MVP deployment runs exactly one BCO campaign executor. Campaign leases are not part of the
MVP. Deployment updates stop the current executor before starting its replacement, and deployment
configuration must not allow more than one campaign executor.

This restriction applies to the stateful campaign executor. It does not decide how other stateless
services may be deployed.

## Consequences

- The MVP avoids lease storage, renewal, expiry, fencing, and handoff behavior.
- The executor still saves the next intended action and completed downstream results so a later
  process can resume after the previous process has stopped.
- The MVP has no automatic campaign-executor failover and no overlapping executor rollout.
- A deployment must stop the old executor before starting a replacement. Recovery begins only after
  the previous executor has exited.
- Stable action keys and downstream idempotency are still needed for a crash after a downstream call
  succeeds but before BCO saves its reply. A single executor does not remove that crash window.

## Required design updates

Update `docs/architecture.md`, `docs/bisection-data-model.md`, `docs/components.md`,
`docs/components/bco.md`, and `docs/components/state-store.md`. Remove lease behavior from
`docs/diagrams/ownership-boundary.mmd`, `docs/diagrams/recovery.mmd`, and
`docs/diagrams/single-candidate-step.mmd`. The updated documents must describe one campaign executor
and persisted next action without campaign leases.
