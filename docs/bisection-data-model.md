# Bisection Data Model

**Status:** DRAFT
**Version:** 1

Reference data model for the State store (see [architecture.md](./architecture.md)).

Each bisection campaign fixes a set of dimensions so that the kernel commit is the only changing variable.
Which dimensions matter depends on the regression type:

| Regression type | Fixed-scope dimensions                            |
|-----------------|---------------------------------------------------|
| Build           | arch, defconfig, toolchain                        |
| Boot            | arch, defconfig, toolchain, device/VM             |
| Config          | arch, base defconfig, toolchain                   |
| Unit-test       | arch, defconfig, toolchain, test suite, test case |
| Performance     | SUT profile, workload configuration, metric       |

Admission uses this table to check that campaign scope is complete for the regression type. For
performance, the `metric` dimension is carried by the campaign request `expected_signal.metric`, not
by `scope`; the other dimensions come from `scope`.

## Records

This model records one post-detection investigation. Each step tests a selected commit while the
campaign scope stays fixed.

### Bisection Campaigns

A bisection campaign is one investigation that isolates a detected regression.

A campaign starts from regression evidence that has already been detected and classified, or from a
case grouped out of several such regressions. It records the triggering evidence, fixed scope, and
performed steps.

A campaign can end in several ways:

- it isolates one culprit commit that explains the regression,
- narrows the regression to a smaller commit range,
- stays unresolved because the evidence is inconsistent or incomplete,
- finds that the suspected regression does not reproduce under the fixed scope.

The entry contains:

- `Bisection-campaign record ID`: one bisection campaign.
- `Equivalence key`: the duplicate-detection key computed from the campaign request.
- `Evidence links`: the records that caused the bisection campaign to start.
- `Campaign-scope fields`: the fixed dimensions for this campaign's regression type that must remain constant.
- `Search-boundary fields`: the known-good boundary, the known-bad boundary, and the search method.
- `Lifecycle fields`: current lifecycle status, lifecycle timestamps, and failure metadata when the campaign
   cannot continue. Lifecycle ownership is described in [State store design](components/state-store.md).
- `Orchestration fields`: the current lease holder, lease expiry, and next intended action used
  for crash-safe resume.
- `Final-outcome fields`: the final conclusion of the campaign, including the outcome category, the culprit
  kernel reference when a single kernel is identified, and the narrowed good and bad boundary references when
  the outcome is a narrowed range.
- `Bisection-step links`: the ordered tested steps that belong to that campaign.

### Bisection Steps

Each step records the selected commit, the build identity used for that commit, the Results Analyzer
evidence linked to the step, and the decision derived from that evidence. Steps form the ordered audit trail
of one campaign.

A step does not have to end with a clean good-or-bad decision. Some steps are `skip` because the
candidate could not be tested at that commit relative to the campaign's regression type (for example a
build failure in a non-build campaign), and some are `weak` because the evidence is too noisy or
incomplete.

The entry contains:

- `Bisection-step record ID`: one tested build inside one bisection campaign.
- `Bisection-campaign reference`: the campaign this step belongs to.
- `Step-order fields`: the order of the step inside the workflow and the position of the
   tested commit relative to the current search boundaries.
- `Step-status fields`: current step lifecycle status and active attempt number.
  Step lifecycle ownership is described in [State store design](components/state-store.md).
- `Kernel reference`: the kernel commit tested at that step.
- `Build reference`: the concrete build identity used for that tested step.
- `Attempt record links`: downstream action attempts recorded for this step.
- `Step-evidence links`: normalized evidence records produced by Results Analyzer for this step,
   such as `observation-set/v1` or `performance-evidence/v1`.
- `Step-decision result`: the step result: `good`, `bad`, `skip`, or `weak`.
- `Step-rationale fields`: why that result was recorded — which evidence supported `good`/`bad`,
   which failure caused `skip`, or which uncertainty caused `weak`.

### Attempt Records

A step can have multiple attempts. BCO records both identifiers for each attempt:

- `attempt_number`: ordinal within the step, used on the execution path and encoded in the
  build-test plan `idempotency_key`.
- `attempt_id`: durable record ID used on the evidence and decision path.

Both identify the same attempt.
