# ADR-0008: Resolve BTO execution composition at runtime

## Status

Accepted — 2026-05-20

## Context

The system runs in different environments. Each environment provides the planner, builder, and
tester roles through a different arrangement of service instances: one instance may cover all three
roles, or the roles may be split across two or three separate instances. These arrangements are not
fixed, so the BTO boundary must not assume any particular one.

The BCO-facing contract must not assume separate build and test execution services or separate job
IDs. BCO selects an allowed execution path but must not know how BTO maps that path to runtime
calls.

## Decision

Campaign admission resolves the composition name. Composition configuration shape is defined by
`execution-composition/v1`. The resolved composition name is passed to BTO in the build-test plan
request.

BTO owns the runtime configuration behind the composition name. A composition maps the logical
planner, builder, and tester roles to configured instances. The roles may all resolve to the same
instance, to two instances, or to three instances.

The accepted decision is the BCO/BTO boundary: BCO submits one plan referencing a composition name
and BTO returns one bundled terminal result. How BTO resolves the composition to calls is
BTO-internal; the detailed call-pattern taxonomy is not part of this accepted decision and is
specified only when a split-role composition is built.

BTO always returns one bundled terminal build-test plan result to BCO.

## Consequences

- BCO-facing contracts use `composition` instead of separate build/test implementation
  selection.
- The final build-test plan result may expose generic execution references for audit, but it does not require
  separate build/test records or separate job IDs.
- Build runner and Test runner contracts remain BTO-internal role contracts used only when the
  selected composition invokes those roles separately.
- Artifact handoff remains internal to BTO and is required only for compositions that split build and
  test execution across instances.
