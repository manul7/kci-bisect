# Open Questions

Registry of unresolved design questions. Each item has a stable ID of the form `oq-NNN`
(three-digit zero-padded, sequential). Numbers are never reused or renumbered.

This file records questions only. Each question states the problem, the decision to make, and
possible answers. When a question is answered, move the decision to an ADR or the owning
design/contract document and remove the item from this registry.

To find references to a question, search the repository for its stable ID, such as `oq-000`.

## Registry

- oq-002 — multi-candidate round semantics
- oq-003 — parallelism limits
- oq-005 — retry and re-execution policy
- oq-006 — timeout and resource-budget policy
- oq-008 — Git history view per selection policy
- oq-011 — commit-selection request shape for policies beyond plain bisect
- oq-012 — execution credentials and secrets
- oq-013 — generic campaign request sufficiency
- oq-015 — recipient resolution scope
- oq-018 — triggering reason
- oq-022 — verification strategy menu
- oq-023 — commit-selection result shape for multi-candidate policies
- oq-025 — toolchain catalog and identity granularity

## Questions

### oq-002

**Problem:** Multi-candidate search policies may select several commits at once. BCO needs a
clear rule for closing a round before asking the Commit selector for the next selection.

**Question:** When is a multi-candidate round complete?

**Possible answers:**

- The round completes only after every selected candidate reaches a terminal step state.
- The round may complete early once collected decisions are sufficient to move the search range.
- The Commit selector receives partial round state and decides whether another selection is valid.

### oq-003

**Problem:** A campaign can request more concurrent work than BCO, BTO, or execution capacity can
support. The architecture needs one place where limits are declared and enforced.

**Question:** Where are parallelism limits declared and enforced?

**Possible answers:**

- Deployment configuration declares limits; BCO enforces them before submitting plans.
- Campaign policy declares limits; BCO validates them against deployment capacity.
- BCO submits work until BTO or execution services reject excess load.
- A combined model uses deployment defaults plus optional CR-level overrides.

### oq-005

**Problem:** Some failures are not reliable step evidence. The system needs a policy for deciding
whether to retry, re-run, skip, or fail when execution or evidence is inconclusive.

**Question:** Which events can trigger re-execution, and how is retry exhaustion represented?

**Possible answers:**

- No automatic retry; all inconclusive states are recorded as final step or campaign state.
- Retry only infrastructure-attributed failures.
- Retry infrastructure-attributed failures and `weak` decisions.
- Support named retry policies with explicit exhaustion outcomes.

### oq-006

**Problem:** Time and resource limits can apply to a plan, an attempt, a step, or the whole
campaign. Different scopes may need different terminal behavior.

**Question:** Which timeout and resource-budget scopes are supported?

**Possible answers:**

- Per-plan timeout only, enforced by BTO or the selected execution implementation.
- Per-step attempt timeout and campaign-level budget, enforced by BCO.
- Deployment defaults only; CRs cannot override time or resource budgets.
- Deployment defaults plus optional campaign-level overrides admitted by BCO.

### oq-008

**Problem:** Kernel history is often non-linear. A selector must define which commits are in the
search space before candidate selection can be deterministic.

**Question:** Which Git history view does each search policy search?

**Possible answers:**

- Full reachable commit DAG between the good and bad boundaries.
- First-parent history between the good and bad boundaries.
- Policy-specific history view declared by the selector contract.
- Reject search policies whose history view is not declared.

**Status:** Plain `bisect` resolves this to `git_bisect_default` (commit-selection-request.md). Open
for non-bisect policies.

### oq-011

**Problem:** Plain bisect needs less state than multi-candidate or custom policies. The generic
selection request may not be sufficient for those policies.

**Question:** What request state is required for search policies beyond plain bisect?

**Possible answers:**

- Reuse the plain-bisect request shape with policy-specific parameters only.
- Add generic round state, pending candidates, and exhausted candidates.
- Define a policy-specific request schema for each non-bisect policy.
- Reject non-bisect policies until their request schema is defined.

### oq-012

**Problem:** Campaign requests must not carry secrets, but BCO, BTO, execution calls, and reporting
may all need credentials.

**Question:** Which secret source is authoritative for each credential type?

**Possible answers:**

- Trigger registry stores trigger auth and BTO auth; deployment config stores service credentials.
- A separate secret store owns all credentials; component state stores only secret references.
- Each service owns its own credentials through local deployment configuration.
- CRs carry only non-secret references to credentials resolved during admission or execution.

### oq-013

**Problem:** The campaign request must work for generic bisection, but local and CI-integrated
triggers may need different metadata.

**Question:** Is the generic campaign request sufficient without a larger CI integration?

**Possible answers:**

- The current CR is sufficient; integration metadata remains external.
- Add optional integration metadata to the CR.
- Define a separate local-request wrapper that converts into a CR.
- Require all triggers to convert their native records into the existing CR shape before admission.

### oq-015

**Problem:** Reporting can need recipients from commits, trigger policy, campaign metadata, or
external systems. The core design must decide what Recipient finder owns.

**Question:** Which inputs belong to the Recipient finder contract?

**Possible answers:**

- Culprit commit only.
- Culprit commit plus campaign scope and trigger reporting policy.
- Campaign outcome plus an external recipient-policy reference.
- Recipient resolution remains outside the bisection system.

### oq-018

**Problem:** Triggers own regression detection, but campaign records need enough context to explain
why a campaign was started.

**Question:** What triggering reason must a CR carry?

**Possible answers:**

- No required reason; the CR itself is sufficient.
- Optional opaque references to external records.
- Required references to external regression or failure records.
- A short embedded summary plus optional external references.

### oq-022

**Problem:** `revert_and_retest` is the first defined verification strategy. Other confirmation
methods may need different inputs and produce different confidence.

**Question:** Which verification strategies are in scope?

**Possible answers:**

- Only `revert_and_retest`.
- Re-test the culprit commit under the same scope.
- Re-test the reverted bad boundary under the same scope.
- Support a strategy-specific verification contract per named strategy.

### oq-023

**Problem:** A single-candidate selection result may not represent multi-candidate selection,
partial progress, or blocked subranges.

**Question:** What result shape should Commit selector return for multi-candidate policies?

**Possible answers:**

- Return one result containing all selected candidates for the next round.
- Return one result per candidate and let BCO assemble the round.
- Return a round plan with candidate groups, ordering, and replacement rules.
- Define a policy-specific result schema for each multi-candidate policy.

### oq-025

**Problem:** A requester supplies `scope.toolchain` (name and optional version) in the campaign
request, but nothing tells the requester which toolchains and versions a deployment can build, and
`name` plus `version` may not fully identify a toolchain. Toolchains vary by distribution patches
and by component versions that a single version string does not capture.

**Question:** Is there a catalog of supported toolchains and versions a requester selects from, who
owns it, and is `name` plus `version` a sufficient toolchain identity?

**Possible answers:**

- External catalog owned by the trigger or deployment, resolved before the campaign request (as with
  the external metric registry); the bisection system only accepts and passes it through.
- Catalog exposed by the build backend and validated at admission.

**Status:** Open. Campaign requests carry `scope.toolchain` today; catalog and identity granularity
undecided.
