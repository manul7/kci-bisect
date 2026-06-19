# Components

This document is the components catalog.

Here each component described with its role, problems it solves, inputs, outputs,
and links to focused design documents when a component has detailed design.

Component groupings and the high-level system view can be found in [architecture document](./architecture.md).

Open questions referenced below are tracked in [OQ](../oq.md).

Each component has a label - **Inclusion**:

- `mandatory` — the architecture requires this component for an end-to-end bisection campaign.
- `mandatory logical role` — BTO must cover this role, but the role may be implemented by the
  same runtime instance as other BTO execution roles.
- `optional` — the component is part of the architecture but campaigns can complete without it.
  When present it adds extra capability (analyzed evidence, verification, reporting, build reuse,
  shared artifact handoff) or covers a specific configuration.

## Core

### Bisection Campaign Orchestrator, BCO

**Inclusion:** `mandatory`

**Role:** Admits and orchestrates a bisection campaign. It validates the campaign request,
prevents duplicate campaigns, drives campaign lifecycle, owns retry and outcome promotion, and
routes evidence between components.

It does not detect regressions, choose initial boundaries, select commits, parse raw output,
decide `good` vs `bad`, or call build/test execution services directly.

**Problem addressed:**

- Keeps campaign admission, lifecycle, routing, duplicate prevention, retry policy application,
  and crash-safe resume in one component.
- Keeps trigger logic, commit selection, build/test execution, observation extraction, and step
  decision logic out of the BCO.

**Inputs:** A [Campaign Request JSON document](contracts/campaign-request.md).

**Outputs:**

- Bisection campaign records and bisection step records as defined by the BCO
  [State store](components/state-store.md).
- Build-test plan requests for selected candidates, see
  [build-test-plan-request](contracts/build-test-plan-request.md).
- BCO campaign output as defined by [bco-output](contracts/bco-output.md).
- Admission rejection result with validation errors, returned synchronously to the trigger when
  no campaign is created. Not persisted as a campaign record.

**Detailed design:** [bco](components/bco.md).

**Open questions:**

- oq-003 — parallelism limits.
- oq-005 — retry and re-execution policy.
- oq-006 — timeout and resource-budget policy.

### Build-Test Orchestrator, BTO

**Inclusion:** `mandatory`

**Role:** Executes build-test plans for candidates selected by BCO. Runs as a separate
service/process with its own lifecycle, state store, and runtime configuration. Resolves the
selected composition into BTO-internal planner, builder, and tester roles.

**Problem addressed:** Execution systems vary in capability. Some deployments use one service for
planning, building, and testing; others split those roles across services. BCO should not embed
that heterogeneity. BTO handles execution composition, plan execution, polling, and artifact
handoff behind one bundled-result contract.

**Inputs:** A [build-test plan request](contracts/build-test-plan-request.md) from BCO.
Runtime compositions are defined by [execution-composition](contracts/execution-composition.md).

**Outputs:**

- A terminal-state notification to BCO when the plan finishes.
- A [build-test plan result](contracts/build-test-plan-result.md), read by BCO through BTO once the
  plan reaches a terminal state.

**Detailed design:** [bto](components/bto.md).

### Commit selector

**Inclusion:** `mandatory`.

**Role:** Given a commit-selection request, choose the next commit(s) to test. Isolates
search-policy choice from lifecycle and execution.

**Problem addressed:** Commit selection is a policy boundary. Keeping it separate from execution
lets the system use plain bisect first and add other selection policies later without changing
build/test orchestration.

**Inputs:** A commit-selection request containing at least the source-tree reference, current good
and bad boundaries, the selected search policy with its parameters, the source-history view
appropriate for that policy, and the terminal step outcomes projected as selector marks.

**Commit Selection Policies:**

- Standard plain `git bisect` - default selector contract.
- `n_bisect`, `multi_level_bisect`, and `custom` are TBD/future policies

**Outputs:** A commit-selection result containing a selected candidate, convergence, blocked
state, or invalid-request result. See [commit-selection-result](contracts/commit-selection-result.md).

**Detailed design:** [commit-selector](components/commit-selector.md).

**Open questions:**

- oq-002 — multi-candidate round semantics.
- oq-008 — Git history view per selection policy.
- oq-011 — commit-selection request shape for policies beyond plain bisect.
- oq-023 — commit-selection result shape for multi-candidate policies.

## BTO Internal Execution Roles

### BT Planner

**Inclusion:** `mandatory logical role`

**Role:** Turns a build-test plan request into backend-executable build and test intents.

**Problem addressed:** Keeps backend-specific plan creation behind BTO while allowing the
planner role to be implemented by the same instance as builder/tester or by a separate instance.

**Inputs:** Build-test plan request and selected composition.

**Outputs:** Build and test intents for the selected runtime composition.

**Detailed design:** [bto](components/bto.md).

### Build runner

**Inclusion:** `mandatory logical role`

**Role:** Builder role interface that attempts to produce a kernel build for a requested build
identity and returns normalized outcome metadata. It uses the build identity as given -- it does not
infer or rewrite scope dimensions -- and exposes backend specifics through `build_producer`.

**Problem addressed:** Hides backend-specific build systems behind one role. The role may be
implemented by the same instance as planner/tester or by a separate instance.

**Inputs:** [build-identity](contracts/build-identity.md) and correlation identity (campaign, step,
attempt, idempotency key), passed only when the composition invokes the builder role separately. The
detailed request shape is BTO-internal.

**Outputs:**

- [runner outcome contract](contracts/runner-outcome.md).
- Build artifact and raw-output references.
- Build-identity and job audit metadata.

**Detailed design:** TBD

### Test runner

**Inclusion:** `mandatory logical role`

**Role:** Tester role interface that runs a requested workload against a built kernel and returns
normalized outcome metadata and raw output references. It emits raw or source-native output (or
references to existing analysis records), not the normalized evidence contracts -- Results Analyzer
is their sole producer. It must not silently change scope dimensions, and returns `invalid_request`
if it cannot satisfy the request.

**Problem addressed:** Hides backend-specific execution systems behind one role while preserving
enough attribution to separate kernel/test evidence from lab, scheduler, transport, or backend
failures.

**Inputs:** build artifacts and [build-identity](contracts/build-identity.md) under test, the
relevant campaign scope (SUT, workload, and for performance the metric `name`/`unit`; metric
direction excluded), and the test/backend selection -- passed only when the composition invokes the
tester role separately. The detailed request shape is BTO-internal.

**Outputs:**

- [runner outcome contract](contracts/runner-outcome.md).
- Tested-artifact and raw-output references.
- Job and attempt audit metadata.

**Detailed design:** TBD

## Optional BTO Capabilities

### Build cache

**Inclusion:** `optional`

**Role:** Reuse previously produced build artifacts.

**Problem addressed:** Avoids rebuilding kernel artifacts when a trigger chooses to enable build reuse.

**Inputs:** TBD

**Outputs:** TBD

**Detailed design:** TBD

### Artifact store

**Inclusion:** `optional`

**Role:** Storage for build artifacts handed off between separate builder and tester instances.

**Problem addressed:** When BTO composes separate builder and tester instances, the build artifact
has to be persisted somewhere both can reach. When one instance owns the handoff, separate
Artifact store is not needed.

**Inputs:** TBD

**Outputs:** TBD

**Detailed design:** TBD. Runtime compositions that keep artifact handoff inside one instance do not
require a separate Artifact store contract.

## Analysis

### Results Analyzer

**Inclusion:** `mandatory`

**Role:** Converts terminal plan output into evidence consumed by the Decision engine.

**Problem addressed:** Build/test execution systems expose different output shapes. Some return raw
logs or measurements; others return already analyzed records. Results Analyzer contains that
variability and publishes one stable evidence contract for each supported regression type.

**Inputs:** [results-analyzer-request](contracts/results-analyzer-request.md).

**Outputs:** one evidence contract per step, chosen to reflect qualification

- [observation-contract](contracts/observation-contract.md), carrying the stage 1 `qualification`
  observation in non-`parse_error` sets, for discrete regression types and for any unqualified
  candidate;
- [performance-evidence](contracts/performance-evidence.md) for a qualified performance candidate.

**Detailed design:** [results-analyzer](components/results-analyzer.md).

## Decision

### Decision engine

**Inclusion:** `mandatory`

**Role:** Decide each step in two stages — a universal qualification gate that maps a candidate
with no usable result to `skip`, then the named decision strategy that maps a qualified result to
`good`, `bad`, or `weak` (or `skip` when the evidence cannot be used).

**Problem addressed:** Binary observations and continuous metrics need different decision logic.
A single hardcoded path can serve neither well.

**Inputs:** Structured observations or performance evidence from the Results Analyzer, decision
strategy configuration, expected signal definition, campaign scope, and step context.

**Outputs:** [decision-contract](contracts/decision-contract.md).

**Detailed design:** [decision-engine](components/decision-engine.md).

## Verification

### Verifier

**Inclusion:** `optional`

**Role:** Applies the campaign's verification policy to a candidate single-culprit outcome.

**Problem addressed:** Keeps post-bisection confirmation separate from the search workflow.

**Inputs:** Candidate outcome, admitted campaign context, verification policy, and the build/test
and decision inputs required by that policy.

**Outputs:** Verification result consumed by BCO when promoting the final campaign outcome.

**Detailed design:**: TBD

**Open questions:**

- oq-022 — additional verification strategies beyond `revert_and_retest`.

## Reporting

### Report generator

**Inclusion:** `optional`

**Role:** Produce a bisection report from campaign records and final outcome.

**Problem addressed:** TBD
**Inputs:** TBD
**Outputs:** TBD
**Detailed design:** TBD
**Open questions:** TBD

### Recipient finder

**Inclusion:** `optional`

**Role:** Determine who to notify for a given culprit.

**Problem addressed:** TBD
**Inputs:** TBD
**Outputs:** TBD
**Detailed design:** TBD
**Open questions:**

- oq-015 — recipient resolution scope.

### Report sender

**Inclusion:** `optional`

**Role:** Deliver a report to recipients.

**Problem addressed:** TBD
**Inputs:** TBD
**Outputs:** TBD
**Detailed design:** TBD
**Open questions:** TBD

## State

### Trigger registry

**Inclusion:** `mandatory`

**Role:** Stores registered trigger identities, admission credentials, and per-trigger execution
settings used by BCO admission.

**Problem addressed:** Keeps trigger authentication and execution-settings lookup durable and
separate from campaign request payloads.

**Inputs:** Out-of-band trigger registration updates and admission-time authentication lookups.

**Outputs:** Authenticated trigger record, trigger execution settings, or authentication failure.

**Detailed design:** [state-store](components/state-store.md).

**Open questions:**

- oq-012 — execution credentials and secrets.

### BCO State store

**Inclusion:** `mandatory`

**Role:** Stores BCO-owned campaign, step, attempt, evidence, decision, lease, trigger, and outcome
records.

**Problem addressed:** Provides the durable coordination boundary for admission, lifecycle
transitions, single-writer leases, crash-safe resume, and audit.

**Inputs:** BCO state mutations from admission, orchestration, evidence recording, decision
recording, verification, and final outcome promotion.

**Outputs:** Campaign and step records, lease results, lifecycle transition results, recovery
snapshots, and audit records.

**Detailed design:** [state-store](components/state-store.md).

### BTO State store

**Inclusion:** `mandatory`

**Role:** Stores BTO-owned plan execution state.

**Problem addressed:** Lets BTO collapse repeated submissions of the same plan to one plan
identity, preserve plan progress, and serve final build-test plan results without exposing its
storage to BCO.

**Inputs:** Build-test plan submissions and plan execution updates.

**Outputs:** Plan references and completed build-test plan results.

**Detailed design:** [bto](components/bto.md).
