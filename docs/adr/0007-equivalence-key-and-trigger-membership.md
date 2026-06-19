# ADR-0007: Use campaign equivalence keys and trigger membership

## Status

Accepted — 2026-05-18

## Context

Multiple triggers may request the same bisection problem. Starting duplicate campaigns wastes
resources and can produce conflicting operational views.

The design question is whether equivalent requests should create separate campaigns, be rejected
as duplicates, or attach to one shared campaign record.

## Decision

BCO computes an equivalence key from the fields that identify the bisection problem. Admission
uses atomic create-by-equivalence-key semantics in the BCO State store.

The first trigger to create the campaign is recorded as the creator. Later triggers submitting an
equivalent request are recorded as members and gain read visibility on the same campaign. The
resolved composition is part of the equivalence key, so equivalent requests join only when they
resolve to the same campaign execution path.

## Consequences

- Equivalent requests do not start duplicate campaigns.
- Request metadata and orchestration-policy fields are excluded from the equivalence key.
- Resolved composition is included in the equivalence key.
- Later triggers can inspect the existing campaign but cannot redirect execution.
- BCO State store must make create-by-equivalence-key linearizable for a single key.
