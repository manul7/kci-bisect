# Decision Engine Contract

**Status:** DRAFT

**Version:** 1

This contract defines the Decision engine request and result shapes. The Decision engine takes
observations or performance evidence, the expected signal, decision strategy, campaign scope, and
step context, and returns one step decision with rationale.

## Two-Stage Decision

A step decision is produced in two stages.

- Stage 1, qualification, runs for every regression type. It checks whether the candidate reached a
  testable state for the campaign's evidence type. "Reached a testable state" is
  relative to the regression type: a build failure is unqualified for `boot`, `unit_test`, and
  `performance`, but for `build` it is the qualified result the evaluator maps to `bad`. When the
  candidate did not reach the needed state, the decision is `skip` with a qualification skip
  reason. Qualification never returns `good` or `bad`.
- Stage 2, evaluation, runs only on a qualified result. It applies the named decision strategy to
  map the result to `good`, `bad`, or `weak` — or to `skip` when the qualified result's evidence
  cannot support the comparison (for example a scope or baseline mismatch).

`decision_strategy` names the stage 2 evaluator. `binary` and `performance` are stage 2
evaluators that share the stage 1 gate; see
[binary-decision-strategy](binary-decision-strategy.md) and
[performance-decision-strategy](performance-decision-strategy.md). The strategy is resolved from
the campaign execution profile by regression type and is not carried in the campaign request.

A stage 1 `skip` means the candidate was not testable; a stage 2 `skip` means the evidence was
returned but cannot be used. Both stay distinct from `weak` (usable but noisy, partial, or
ambiguous).

A `parse_error` observation set carries no `qualification` observation and no evaluable evidence; the
active strategy maps it directly to `skip` (`parse_error`), outside the qualify-then-evaluate flow.

## Request Shape

The embedded `observation_set` below is abbreviated; a real set also carries the campaign/step/attempt
IDs and the required `qualification` observation (see [observation-contract](observation-contract.md)).

```json
{
  "contract_version": "decision-request/v1",
  "request_id": "DECISION-REQ-0001",
  "campaign_id": "CAMPAIGN_ID",
  "step_id": "STEP_ID",
  "attempt_id": "ATTEMPT_ID",
  "commit": "COMMIT_SHA",
  "regression_type": "REGRESSION_TYPE",
  "scope": {
    "arch": "TARGET_SUT_ARCH",
    "kernel_config": {
      "target": "KERNEL_CONFIG_TARGET",
      "fragments": [
        "KERNEL_CONFIG_FRAGMENT_REF"
      ]
    },
    "toolchain": {
      "name": "TOOLCHAIN_NAME",
      "version": "VERSION"
    },
    "sut": "SUT_PROFILE"
  },
  "expected_signal": {
    "type": "log_signature",
    "signature": "EXPECTED_FAILURE_SIGNATURE"
  },
  "decision_strategy": {
    "type": "DECISION_STRATEGY_TYPE",
    "parameters": {}
  },
  "observation_set": {
    "contract_version": "observation-set/v1",
    "observations": [
      {
        "observation_id": "OBS-0001",
        "observation_type": "error_signature",
        "name": "expected_boot_failure",
        "value": {
          "matched": true,
          "signature": "EXPECTED_FAILURE_SIGNATURE"
        },
        "source_refs": {
          "artifact_ref": "ARTIFACT_REF"
        }
      }
    ]
  },
  "performance_evidence": null
}
```

## Request Fields

- `contract_version`: must be `decision-request/v1`.
- `request_id`: unique identifier for this decision request.
- `campaign_id`: campaign that owns the step.
- `step_id`: step being decided.
- `attempt_id`: attempt whose evidence is being evaluated; the durable attempt-record identifier
  defined in [bisection-data-model](../bisection-data-model.md).
- `commit`: commit under test.
- `regression_type`: campaign regression type.
- `scope`: the campaign scope dimensions relevant to the decision, shaped as the admitted campaign
  `scope`.
- `expected_signal`: target signal definition from the campaign request.
- `decision_strategy`: selects the stage 2 evaluator. `type` is required and names the evaluator
  (`binary` or `performance`); `parameters` is optional and strategy/deployment-defined. Resolved
  from the campaign execution profile by regression type; the campaign request does not carry it.
- `observation_set`: optional observation set conforming to
  [observation-contract](observation-contract.md).
- `performance_evidence`: optional generic performance evidence conforming to
  [performance-evidence](performance-evidence.md).

Exactly one of `observation_set` or `performance_evidence` must be a non-null object; the other is
`null` or omitted. A future contract may define mixed evidence requests.

A `performance` request may carry an `observation_set` rather than `performance_evidence` when the
candidate was unqualified (no measurement). Stage 1 qualification resolves it to `skip`; the
performance evaluator runs only on a qualified `performance_evidence` request.

The performance strategy is defined in
[performance-decision-strategy](performance-decision-strategy.md).

## Result Shape

```json
{
  "contract_version": "decision-result/v1",
  "request_id": "DECISION-REQ-0001",
  "campaign_id": "CAMPAIGN_ID",
  "step_id": "STEP_ID",
  "attempt_id": "ATTEMPT_ID",
  "decision": "bad",
  "rationale": {
    "summary": "Expected failure signature was present in the boot log",
    "supporting_observations": [
      "OBS-0001"
    ]
  },
  "decision_details": {
    "matched_expected_signal": true,
    "strategy": "binary"
  }
}
```

Performance result (stage 2 evaluator, `supporting_evidence_refs`):

```json
{
  "contract_version": "decision-result/v1",
  "request_id": "DECISION-REQ-0002",
  "campaign_id": "CAMPAIGN_ID",
  "step_id": "STEP_ID",
  "attempt_id": "ATTEMPT_ID",
  "decision": "bad",
  "rationale": {
    "summary": "Candidate regressed avg_ops vs the good-boundary baseline (medium effect)",
    "supporting_evidence_refs": [
      "PERF-EVIDENCE-0001"
    ]
  },
  "decision_details": {
    "matched_expected_signal": true,
    "strategy": "performance",
    "evidence_conclusion": "regression",
    "effect_size_magnitude": "medium"
  }
}
```

Qualification skip result (stage 1 gate, any regression type):

```json
{
  "contract_version": "decision-result/v1",
  "request_id": "DECISION-REQ-0003",
  "campaign_id": "CAMPAIGN_ID",
  "step_id": "STEP_ID",
  "attempt_id": "ATTEMPT_ID",
  "decision": "skip",
  "rationale": {
    "summary": "Candidate did not boot; not testable at this commit.",
    "supporting_observations": [
      "OBS-0001"
    ]
  },
  "decision_details": {
    "skip_reason": "not_booted"
  }
}
```

## Result Fields

- `contract_version`: must be `decision-result/v1`.
- `request_id`, `campaign_id`, `step_id`, `attempt_id`: copied from the request.
- `decision`: one of `good`, `bad`, `skip`, or `weak`.
- `rationale.summary`: human-readable explanation for audit logs and reports.
- `rationale.supporting_observations`: supporting observation IDs from the request set. Present for
  observation-set evidence (binary and qualification), omitted for performance.
- `rationale.supporting_evidence_refs`: for performance, the `evidence_id` of the supporting
  [performance-evidence](performance-evidence.md). Candidate and baseline references live in that
  evidence (`comparison`) and the summary, not duplicated here.
- `decision_details`: structured metadata. Contract-defined keys (`matched_expected_signal`,
  `skip_reason`, `uncertainty_reason`, `suggested_followup`) are defined under Decision Semantics;
  strategy keys (e.g. `strategy`, `evidence_conclusion`, `effect_size_magnitude`) by the strategy
  contracts.

The result carries no generic `confidence` field unless a future contract defines one.

## Decision Semantics

### `good`

The evidence does not show the expected regression.

Required detail:

```json
{
  "decision": "good",
  "decision_details": {
    "matched_expected_signal": false
  }
}
```

### `bad`

The evidence shows the expected regression.

Required detail:

```json
{
  "decision": "bad",
  "decision_details": {
    "matched_expected_signal": true
  }
}
```

### `skip`

The evidence cannot support a `good` or `bad` decision for this step. It is not noisy-but-usable
evidence — that case is `weak`.

Required detail:

```json
{
  "decision": "skip",
  "decision_details": {
    "skip_reason": "parse_error"
  }
}
```

Baseline `skip_reason` values defined by this contract:

- `parse_error`;
- `missing_required_observation`;
- `unsupported_observation`;
- `strategy_not_applicable`.

Qualification (stage 1) skip reasons are for a candidate that did not reach a testable state. They
mirror the `reason` of the `qualification` observation in
[observation-contract](observation-contract.md):

- `not_built`;
- `not_booted`;
- `did_not_run`;
- `crashed`.

Strategy contracts may add their own values; consumers must accept those too. Each strategy
contract lists the values it adds. Current extensions:

- performance strategy adds `evidence_scope_mismatch`, `evidence_candidate_mismatch`,
  `evidence_metric_mismatch`, `missing_required_evidence`, and `baseline_mismatch`; see
  [performance-decision-strategy](performance-decision-strategy.md).

### `weak`

The step was tested, but evidence is too noisy, partial, or internally inconsistent for a final
`good` or `bad` decision.

Required detail:

```json
{
  "decision": "weak",
  "decision_details": {
    "uncertainty_reason": "insufficient_repetitions"
  }
}
```

Common `uncertainty_reason` values:

- `insufficient_repetitions`;
- `high_variance`;
- `conflicting_observations`;
- `partial_measurements`;
- `near_threshold`.

Strategy contracts may add their own values; consumers must accept those too. Each strategy
contract lists its own; see
[binary-decision-strategy](binary-decision-strategy.md) and
[performance-decision-strategy](performance-decision-strategy.md).

`suggested_followup` is optional advisory metadata for the caller, not a command.

## Compatibility Rules

- Decision consumers must ignore unknown `decision_details` keys.
- Decision producers must include concrete `skip_reason` for `skip`.
- Decision producers must include concrete `uncertainty_reason` for `weak`.
- Decision results must reference their supporting evidence — observation IDs for observation-set
  evidence (`supporting_observations`) or evidence references for performance evidence
  (`supporting_evidence_refs`) — and must not embed raw logs or large excerpts.
