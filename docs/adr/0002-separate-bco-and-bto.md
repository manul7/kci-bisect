# ADR-0002: Keep BCO and BTO separate

## Status

Accepted — 2026-05-18

## Context

The bisection system coordinates campaign lifecycle, commit selection, build/test execution,
evidence production, and decisions. Build/test execution may involve long-running external work
and implementation-specific recovery behavior.

The design question is whether campaign orchestration and build/test execution should live in one
process and one state store, or whether they should be separated from the start.

## Decision

Keep Bisection Campaign Orchestrator and Build-Test Orchestrator as separate services,
with separate processes, lifecycles, and state ownership.

BCO owns campaign admission, lifecycle, retry policy, outcome promotion, and BCO State store
records. BTO owns build-test plan execution, execution work lifecycle, and its own BTO State store.
BCO references BTO work by plan ID and does not read BTO tables directly.

## Consequences

- The BCO to BTO boundary is the build-test plan request/result contract.
- BCO remains independent of execution composition details.
- BTO can evolve execution implementations and recovery logic without changing campaign state.
- Deployments must provide separate BCO and BTO state ownership even if both stores use the same
  database technology.
