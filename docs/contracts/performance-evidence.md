# Performance Evidence Contract

**Status:** DRAFT

**Version:** 1

This contract defines the per-step performance evidence consumed by the Decision engine. It
represents one candidate-vs-baseline comparison under one fixed measurement scope.

Performance evidence is not a step decision. It carries the analyzer's conclusion plus the
summary facts that a performance decision strategy can use to map evidence to `good`, `bad`,
`skip`, or `weak`.

The Results Analyzer is the producer. Source-native records and analyzer-specific calculations
stay behind Results Analyzer and are referenced.

## JSON Shape

```json
{
  "contract_version": "performance-evidence/v1",
  "evidence_id": "PERF-EVIDENCE-0001",
  "producer": {
    "name": "PERFORMANCE_EVIDENCE_PRODUCER",
    "version": "VERSION"
  },
  "campaign_id": "CAMPAIGN_ID",
  "step_id": "STEP_ID",
  "attempt_id": "ATTEMPT_ID",
  "comparison": {
    "candidate": {
      "source_ref": "CANDIDATE_COMMIT_SHA",
      "build_ref": "CANDIDATE_BUILD_REF"
    },
    "baseline": {
      "source_ref": "BASELINE_COMMIT_SHA",
      "build_ref": null,
      "role": "good_boundary"
    }
  },
  "scope": {
    "sut": "SUT_PROFILE",
    "workload": {
      "name": "WORKLOAD_NAME",
      "configuration": {}
    }
  },
  "metric": {
    "name": "METRIC_NAME",
    "unit": "UNIT",
    "higher_is_better": true,
    "candidate_value": 88800,
    "baseline_value": 100000
  },
  "analysis": {
    "conclusion": "regression",
    "is_significant": true,
    "is_consistent": true,
    "stat_power_ok": true,
    "effect_size_magnitude": "medium"
  },
  "source_refs": {
    "records": [
      {
        "type": "analysis_record",
        "ref": "ANALYSIS_RECORD_REF"
      }
    ],
    "raw_artifacts": [
      {
        "type": "measurement_artifact",
        "ref": "RAW_MEASUREMENT_REF"
      }
    ]
  },
  "diagnostics": []
}
```

## Required Fields

- `contract_version`: must be `performance-evidence/v1`.
- `evidence_id`: identifier unique within the campaign.
- `comparison`: candidate and baseline references.
- `scope`: fixed measurement context for the comparison.
- `metric`: identification, direction, candidate value, and baseline value.
- `analysis`: analyzer-published conclusion and summary facts.
- `source_refs`: references to analysis records or raw artifacts supporting the evidence.
- `campaign_id`, `step_id`, `attempt_id`: bisection context binding the evidence to its step.
  `attempt_id` is the durable attempt-record identifier defined in
  [bisection-data-model](../bisection-data-model.md).

## Optional Fields

- `producer`: analysis producer identity.
- `diagnostics`: warnings that do not invalidate the evidence.

## Field Semantics

### `comparison`

`comparison.candidate` identifies the source/build under test for the bisection step.
`comparison.baseline` identifies the comparison reference.

`comparison.baseline.role` is `good_boundary`: the baseline is the campaign-supplied value at the
good boundary. Additional baseline roles are a future extension and not defined here.

`comparison.baseline.source_ref` is the campaign good-boundary commit. The analyzer receives it
from the `boundaries` field of the [results-analyzer-request](results-analyzer-request.md); it is
not derived from a measurement the system performed.

`build_ref` references the build identity ([build-identity](build-identity.md)) for the built side:
`comparison.candidate.build_ref` is required when the system built the candidate (the normal case)
and omitted otherwise; `comparison.baseline.build_ref` is `null` because the campaign-supplied
baseline has no in-system build.

### `scope`

`scope` identifies one comparable measurement context. It must include enough information to
avoid mixing evidence from different SUTs or workloads. `workload.configuration` covers workload
parameters and other execution settings. Metric identity and unit are carried by the top-level
`metric` object, not duplicated under `scope`.

The shape is intentionally extensible. Producers may add fields under `scope` for architecture,
configuration, compiler, firmware, or other dimensions. An added dimension participates in evidence
matching only when the decision strategy or deployment declares it comparability-relevant; see
[performance-decision-strategy](performance-decision-strategy.md).

### `metric`

- `name`: metric identifier, from `expected_signal.metric.name` in the admitted campaign request.
- `unit`: unit string, from `expected_signal.metric.unit`.
- `higher_is_better`: metric direction, from `expected_signal.metric.higher_is_better`.
- `candidate_value`: the analyzed candidate metric value the analyzer used in the comparison.
- `baseline_value`: the campaign-supplied baseline value, carried through from the request.

### `analysis`

The analyzer-published conclusion and summary facts expected at the Results Analyzer boundary. All
five fields below are required for `performance-evidence/v1`.

- `conclusion`: one of `regression`, `improvement`, `no-change`, `uncertain`.
- `is_significant`: boolean summary from the analyzer.
- `is_consistent`: boolean summary from the analyzer.
- `stat_power_ok`: boolean summary from the analyzer.
- `effect_size_magnitude`: one of `negligible`, `small`, `medium`, `large`.

### `source_refs`

References to durable analysis records and raw measurement artifacts. The contract carries
references, not raw payloads. Each entry carries a producer-defined `type` label and a durable
`ref`; both are required. At least one of `records` or `raw_artifacts` is non-empty so the evidence
stays auditable.

## Compatibility Rules

- Consumers must ignore unknown optional fields.
- Producers must populate every required field. Missing required fields make the evidence
  unusable for the Decision engine.
- Producers must not encode bisection step decisions; the contract carries the analyzer's
  conclusion (`regression`/`improvement`/`no-change`/`uncertain`), not `good`/`bad`/`skip`/`weak`.
- Detailed analyzer calculations are not exposed by this contract. Producers may attach durable
  references to analyzer-native records under `source_refs.records` for audit; the Decision engine
  does not read them.
- Consumers must not depend on source-specific evidence storage details.
