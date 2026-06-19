# Results Analyzer Request Contract

**Status:** DRAFT

**Version:** 1

This contract defines the request shape BCO sends when asking Results Analyzer to turn one terminal
plan result into normalized evidence for the Decision engine.

## JSON Shape

This is an abbreviated shape. Nested objects keep the shapes defined by the linked contracts.

```json
{
  "contract_version": "results-analyzer-request/v1",
  "request_id": "ANALYZE-REQ-0001",
  "campaign_id": "CAMPAIGN_ID",
  "step_id": "STEP_ID",
  "attempt_id": "ATTEMPT_ID",
  "regression_type": "REGRESSION_TYPE",
  "plan_result": {
    "contract_version": "build-test-plan-result/v1",
    "outcome": "content_result"
  },
  "scope": {},
  "expected_signal": {},
  "boundaries": {
    "good": {
      "commit": "GOOD_COMMIT_SHA"
    }
  },
  "analyzer_config": {},
  "metadata": {}
}
```

## Required Fields

- `contract_version`: must be `results-analyzer-request/v1`.
- `request_id`: BCO-generated request identifier.
- `campaign_id`: campaign that owns the step.
- `step_id`: step being analyzed.
- `attempt_id`: durable attempt-record identifier defined in
  [bisection-data-model](../bisection-data-model.md).
- `regression_type`: campaign regression type.
- `plan_result`: inline `build-test-plan-result/v1` object carrying `outcome: "content_result"`.
- `scope`: admitted campaign scope, shaped as defined by
  [campaign-request](campaign-request.md).
- `expected_signal`: expected signal definition from the admitted campaign request, shaped as
  defined by [campaign-request](campaign-request.md).

## Optional Fields

- `boundaries`: admitted good boundary. The bad boundary is not included because the analyzer does
  not consume it. Required for `performance` (see Field Semantics); other regression types may omit
  it.
- `analyzer_config`: deployment-selected analyzer configuration. Consumers must ignore unknown
  keys they do not understand.
- `metadata`: deployment-specific metadata. Consumers must ignore unknown metadata keys.

## Field Semantics

`plan_result` is the inline [build-test-plan-result](build-test-plan-result.md) object, with
`outcome` set to `content_result`.

BCO sends only `content_result` results here. It handles `infrastructure_failure` and
`invalid_request` before evidence routing (see [bco](../components/bco.md)).

For `performance`, `boundaries.good.commit` is required: the analyzer records it as
`comparison.baseline.source_ref` in [performance-evidence](performance-evidence.md). The baseline
value is `expected_signal.baseline_value`; the analyzer does not measure the boundary.

## Output Selection

Which evidence contract comes back is defined by
[results-analyzer](../components/results-analyzer.md) and the evidence-path rules in
[campaign-execution-profile](campaign-execution-profile.md).
