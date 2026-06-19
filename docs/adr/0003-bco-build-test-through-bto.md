# ADR-0003: Route build and test execution through BTO

## Status

Accepted — 2026-05-18

## Context

BCO needs evidence for each selected candidate, but build/test execution varies by deployment.
Some deployments use one runtime instance for planning, building, and testing. Others compose
separate planner, builder, and tester roles with artifact handoff when needed.

The design question is whether BCO should call Build runner and Test runner interfaces directly or
delegate all build/test execution to BTO.

## Decision

BCO submits one build-test plan to BTO for each selected candidate. BTO returns one bundled
terminal plan result to BCO.

BCO does not call build or test execution services directly, does not infer decisions from
intermediate execution details, and does not read BTO state directly. BTO owns execution
composition behind the plan request/result boundary.

BTO owns implementation-specific plan creation through its internal planner role.

## Consequences

- BCO workflow logic sees one plan result per submitted candidate.
- Execution composition remains internal to BTO.
- Implementation-specific plan creation remains internal to BTO.
- Artifact handoff is handled behind BTO, using Artifact store only when required.
- Intermediate execution details are audit details, not direct BCO decision inputs.
- Runtime execution composition is defined by ADR-0008.
