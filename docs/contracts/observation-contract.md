# Observation Contract

**Status:** DRAFT

**Version:** 1

This contract defines the structured observation set emitted by the Results Analyzer and consumed
by the Decision engine.

## JSON Shape

The example is abbreviated: it shows a single observation. A real non-`parse_error` set also carries
the required `qualification` observation (see Observation Set Fields).

```json
{
  "contract_version": "observation-set/v1",
  "producer": {
    "name": "OBSERVATION_PRODUCER_NAME",
    "version": "VERSION"
  },
  "campaign_id": "CAMPAIGN_ID",
  "step_id": "STEP_ID",
  "attempt_id": "ATTEMPT_ID",
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
        "artifact_ref": "ARTIFACT_REF",
        "location": {
          "kind": "line_range",
          "start": 120,
          "end": 135
        }
      }
    }
  ],
  "diagnostics": []
}
```

## Observation Set Fields

- `contract_version`: must be `observation-set/v1`.
- `producer`: observation producer identity and version when available.
- `campaign_id`: campaign that owns the evidence.
- `step_id`: bisection step that owns the evidence.
- `attempt_id`: build/test attempt that produced the evidence; the durable attempt-record
  identifier defined in [bisection-data-model](../bisection-data-model.md).
- `observations`: non-empty list of structured observations.
- `diagnostics`: producer warnings that do not invalidate the observation set.

The producer must emit at least one observation. Zero observations is a contract violation.

A non-`parse_error` observation set carries exactly one `qualification` observation. A `parse_error`
observation set carries only the `parse_error` observation.

## Common Observation Fields

Every observation contains:

- `observation_id`: unique within the observation set.
- `observation_type`: one of `pass_flag`, `fail_flag`, `error_signature`, `measured_metric`,
  `qualification`, or `parse_error`.
- `name`: stable name meaningful within the producer configuration.
- `value`: type-specific structured value.
- `source_refs`: reference to raw output or artifact source.

Optional common fields:

- `subject`: test suite, test case, workload, config symbol, or subsystem the observation refers to.
- `timestamp`: event timestamp if present in the raw evidence.
- `metadata`: producer-specific structured metadata. Consumers must ignore unknown metadata keys.

## Source references

`source_refs` must contain enough information for audit and report generation:

- `artifact_ref`: required; durable reference to the log, serial output, measurement file, or build
  artifact.
- `location`: optional; structured position inside the artifact when known.

The contract intentionally stores references, not large raw excerpts.

## Observation Types

The examples below are abbreviated; every observation also carries the common fields above
(`observation_id`, `name`, `source_refs`).

### `pass_flag`

Structured pass observation.

```json
{
  "observation_type": "pass_flag",
  "value": {
    "passed": true
  }
}
```

### `fail_flag`

Structured fail observation.

```json
{
  "observation_type": "fail_flag",
  "value": {
    "failed": true,
    "failure_class": "boot_timeout"
  }
}
```

`failure_class` is producer vocabulary. It is evidence classification, not a step decision.

### `error_signature`

Matched or missing signature.

```json
{
  "observation_type": "error_signature",
  "value": {
    "matched": true,
    "signature": "EXPECTED_FAILURE_SIGNATURE",
    "matcher": "SIGNATURE_MATCHER_NAME"
  }
}
```

### `measured_metric`

Raw or aggregated metric.

```json
{
  "observation_type": "measured_metric",
  "value": {
    "metric": "latency_ms",
    "unit": "ms",
    "value": 12.7,
    "aggregation": "median",
    "sample_count": 5
  }
}
```

If the value is aggregated, `aggregation` and `sample_count` must be present. A measured metric
observation is evidence data, not a regression decision.

No current decision strategy consumes `measured_metric`; it is reserved for non-performance metric
observations. Performance decisions use [performance-evidence](performance-evidence.md).

### `qualification`

Standard execution-stage qualification for the candidate. It states whether the candidate reached
the testable state the campaign needs and, when it did not, the stage and reason. The Decision
engine reads it in the universal stage 1 gate (see [decision-contract](decision-contract.md)).

```json
{
  "observation_type": "qualification",
  "value": {
    "reached": false,
    "stage": "boot",
    "reason": "not_booted"
  }
}
```

- `reached`: whether the candidate reached the testable state for the campaign's evidence type.
- `stage`: stage the candidate reached or failed at — one of `build`, `boot`, `test`, `workload`.
- `reason`: present when `reached` is `false` — one of `not_built`, `not_booted`, `did_not_run`,
  or `crashed`.

The producer maps backend-specific `failure_class` detail to this standard `reason`. Whether a
given stage failure is unqualified is relative to the regression type: a build failure is
`reached: false` for `boot`, `unit_test`, and `performance`, but for `build` it is `reached: true`
because the build outcome is itself the evidence under test.

### `parse_error`

The producer could not process the input enough to produce target evidence.

```json
{
  "observation_type": "parse_error",
  "value": {
    "code": "unsupported_format",
    "message": "Producer does not support this artifact format."
  }
}
```

When input is empty, truncated, corrupt, or unsupported, the producer emits exactly one
`parse_error` observation and no other observations. The active decision strategy maps `parse_error`
to `skip` unless it explicitly defines a different outcome.

## Compatibility Rules

- Observation consumers must ignore unknown optional fields.
- Observation producers must not add new `observation_type` values without updating this contract
  or a versioned extension.
- Observation values must be structured JSON values, not source-specific free-form strings.
- Observations must not encode final step decisions.
