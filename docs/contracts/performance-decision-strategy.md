# Performance Decision Strategy Contract

**Status:** DRAFT

**Version:** 1

This contract defines the boundary for a Decision engine strategy that maps
[performance evidence](performance-evidence.md) to a bisection step decision.

The contract does not define one fixed statistical algorithm. Results Analyzer owns the analysis
facts exposed in performance evidence; the Decision engine owns the rule that maps those facts to
the common step decision enum.

## Strategy Type

This strategy is the stage 2 evaluator for `performance`. The campaign execution profile selects it
by regression type and stores it as the string `performance`; the campaign request does not carry a
decision strategy. The Decision engine applies it only after the universal qualification gate in
[decision-contract](decision-contract.md). The Decision request carries the strategy as the object
form:

```json
{
  "type": "performance"
}
```

Strategy parameters are optional. The campaign request never has to carry them.

## Required Inputs

This evaluator runs only on a qualified step, on `performance_evidence`. A candidate that produced
no usable measurement (unqualified) or unparseable output (`parse_error`) is reported as an
observation set, not `performance_evidence`, and is resolved to `skip` before this evaluator (see
[decision-contract](decision-contract.md)).

For a qualified step the Decision engine request must contain:

- `regression_type: "performance"`;
- `performance_evidence` conforming to [performance-evidence](performance-evidence.md);
- `expected_signal` from the campaign request (see [campaign-request](campaign-request.md));
- `decision_strategy.type: "performance"`;
- campaign `scope` for matching the evidence to the campaign.

## Evidence Matching

Before mapping evidence to a decision, the Decision engine verifies that the evidence belongs to
the request:

- evidence `campaign_id`, `step_id`, and `attempt_id` match the request (the evidence binds to this
  step);
- evidence `scope` matches the campaign scope dimensions relevant to the strategy;
- evidence `metric.name` matches `expected_signal.metric.name`;
- evidence `metric.unit` matches `expected_signal.metric.unit`;
- evidence metric direction matches `expected_signal.metric.higher_is_better`;
- evidence `comparison.candidate.source_ref` matches the step's commit;
- evidence `metric.baseline_value` matches the caller-supplied
  `expected_signal.baseline_value` (the analyzer must use the baseline the campaign declared).

The scope dimensions relevant to performance comparability are the SUT profile, kernel
configuration, toolchain, and workload (`scope.sut`, `scope.kernel_config`, `scope.toolchain`, and
`scope.workload`, including `workload.configuration`), per the performance row of the regression-type
scope table in [bisection-data-model](../bisection-data-model.md). Metric identity is matched
separately through `metric.name` and `metric.unit`.

If evidence does not match the request, the result is `skip` with one of the skip reasons
defined under "Skip Reasons" below.

## Decision Mapping

The concrete strategy maps from `analysis` (the analyzer's conclusion and categorical
`effect_size_magnitude`) and the matched metric and scope fields, plus its deployment-defined
parameters. It must not derive the decision from raw `candidate_value` or `baseline_value`
magnitudes, and it must return exactly one common step decision.

The snippets below show only `decision` and `decision_details`; the full result shape is in
[decision-contract](decision-contract.md).

### `bad`

Map to `bad` when matched evidence satisfies the active strategy's rule for the target
performance regression.

Required detail:

```json
{
  "decision": "bad",
  "decision_details": {
    "matched_expected_signal": true,
    "strategy": "performance",
    "evidence_conclusion": "regression",
    "effect_size_magnitude": "medium"
  }
}
```

### `good`

Map to `good` when matched evidence satisfies the active strategy's rule that the target
performance regression is absent.

Required detail:

```json
{
  "decision": "good",
  "decision_details": {
    "matched_expected_signal": false,
    "strategy": "performance",
    "evidence_conclusion": "no-change"
  }
}
```

### `weak`

Map to `weak` when matched evidence is usable but the active strategy cannot support a final
`good` or `bad` decision.

Required detail:

```json
{
  "decision": "weak",
  "decision_details": {
    "uncertainty_reason": "inconsistent_evidence",
    "strategy": "performance"
  }
}
```

Beyond the common `uncertainty_reason` values in [decision-contract](decision-contract.md), this
strategy adds:

- `inconclusive_conclusion`;
- `inconsistent_evidence`;
- `insufficient_power`;
- `not_significant`;
- `below_magnitude_threshold`.

### `skip`

Map to `skip` when the evidence cannot be used for the comparison.

A candidate that produced no usable measurement because it did not build, boot, or run the
workload is handled by the stage 1 qualification gate and never reaches this strategy. The skip
cases below apply when performance evidence was returned but cannot be used for the comparison.

Common skip cases:

- no matching performance evidence exists;
- evidence candidate does not match the tested step;
- evidence scope does not match the campaign scope;
- evidence metric does not match `expected_signal.metric` (name or unit);
- required `analysis` fields are missing (performance-evidence requires all five).

Required detail:

```json
{
  "decision": "skip",
  "decision_details": {
    "skip_reason": "missing_required_evidence",
    "strategy": "performance"
  }
}
```

## Skip Reasons

This strategy uses the baseline skip reasons defined by [decision-contract](decision-contract.md)
and adds the following strategy-specific values:

- `evidence_scope_mismatch`: evidence `scope` does not match the campaign `scope` along
  dimensions relevant to the strategy.
- `evidence_candidate_mismatch`: the evidence does not bind to the tested step -
  `campaign_id`/`step_id`/`attempt_id` or `comparison.candidate.source_ref` do not match the request.
- `evidence_metric_mismatch`: evidence `metric.name`, `metric.unit`, or direction
  (`higher_is_better`) does not match `expected_signal.metric`.
- `missing_required_evidence`: no usable performance evidence was provided for the step.
- `baseline_mismatch`: evidence `metric.baseline_value` does not match
  `expected_signal.baseline_value`.

Use the baseline `strategy_not_applicable` when the request reaches this strategy but the evidence
shape or `regression_type` is incompatible with `performance`.

## Strategy Parameters

Strategy parameters are deployment-defined. Generic contracts define only the strategy type and
the evidence shape. Thresholds that are part of the regression request remain in
`expected_signal`; defaults and interpretation rules belong to the Decision engine strategy.

## Rationale Requirements

Decision results must include rationale that references the performance evidence:

- evidence ID;
- analyzer conclusion (`analysis.conclusion`);
- metric name;
- candidate and baseline references (via the referenced performance-evidence `comparison`);
- effect-size magnitude;
- skip or uncertainty reason when decision is `skip` or `weak`.

Raw measurements and analyzer-internal computations are referenced through `source_refs` on the
evidence; they are not embedded in the decision result.

## Compatibility Rules

- Known culprit or fix metadata from scenario input must not affect the decision.
- The strategy must not depend on numerical effect-size values. The categorical
  `effect_size_magnitude` is the contract.
