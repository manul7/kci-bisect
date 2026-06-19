# Build-Test Plan Request Contract

**Status:** DRAFT

**Version:** 1

This contract defines the request shape sent from the BCO to the BTO for one build-and-test
execution of one selected candidate commit.

The request is role-backend-neutral and is not a backend-native execution plan; BTO translates it
according to deployment configuration.

## JSON Shape

```json
{
  "contract_version": "build-test-plan-request/v1",
  "request_id": "PLAN-REQ-0001",
  "idempotency_key": "CAMPAIGN_ID:STEP_ID:1:build_test_plan",
  "source": {
    "url": "SOURCE_REPO_URL",
    "commit": "COMMIT_SHA"
  },
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
    "sut": "SUT_PROFILE",
    "workload": {
      "name": "WORKLOAD_NAME",
      "configuration": {}
    },
    "metric": {
      "name": "METRIC_NAME",
      "unit": "UNIT"
    }
  },
  "composition": "COMPOSITION_NAME",
  "requested_artifacts": [
    "kernel_image",
    "modules",
    "logs",
    "measurements"
  ],
  "trace_context": {},
  "metadata": {}
}
```

## Required Fields

- `contract_version`: must be `build-test-plan-request/v1`.
- `request_id`: unique identifier for this plan request.
- `idempotency_key`: stable key supplied by BCO. Repeated submissions with the same key resolve
  to the same plan.
- `source`: source identity as defined in
  [build-identity](build-identity.md).
- `scope`: execution scope dimensions BTO must hold constant, derived by BCO from the admitted
  campaign. The keys present depend on the admitted campaign's regression type; scope is the WHAT to
  build and test, with per-regression-type dimensions listed in
  [bisection-data-model](../bisection-data-model.md).
- `composition`: resolved BTO runtime composition selected during campaign admission.

## Optional Fields

- `requested_artifacts`: output classes BCO needs surfaced in the plan result for end-user
  output or downstream evidence routing.
- `trace_context`: diagnostic object owned by BCO; see field semantics below.
- `metadata`: deployment-specific metadata. Consumers must ignore unknown metadata keys.

## Field Semantics

### `idempotency_key`

The key includes campaign ID, step ID, attempt number, and the action type
(`build_test_plan`). BTO must treat repeated requests with the same key as the same logical
plan and return the existing `plan_id` and the `request_id` bound on first submission, ignoring a
differing `request_id`.

### `composition`

`composition` names the BTO runtime composition selected during admission. The configuration
behind a composition is defined in [execution-composition](execution-composition.md). BTO resolves
the composition to its internal planner, builder, and tester roles.

### `scope`

`scope` is the execution scope BCO derives from the admitted campaign: the campaign scope
dimensions, plus for performance the `metric` target (`name`, `unit`) taken from
`expected_signal.metric`. It is not a copy of Campaign Request `scope` -- the CR carries
the metric under `expected_signal`, not `scope`. The metric direction (`higher_is_better`) is
excluded; BTO does not need it and must not infer a regression. BTO must not mutate scope across one
plan.

BCO uses `scope` to say what must stay fixed. BTO maps it into build and test role requests; BTO
does not treat scope as execution policy.

### `requested_artifacts`

Common values:

- `kernel_image`
- `modules`
- `dtbs`
- `config`
- `logs`
- `diagnostics`
- `measurements`

The selected composition may produce additional outputs; the plan result lists everything actually
produced, split across `artifact_refs` and `raw_output_refs` by class.

### `trace_context`

`trace_context` is a JSON object owned by BCO. BTO stores it and returns it unchanged in the
[build-test plan result](build-test-plan-result.md). BTO must not interpret it for execution,
validation, idempotency, or outcome. BCO uses it for diagnostic breadcrumbs at its discretion, such
as tracker links and BCO identifiers; it has no defined schema.

## Plan Submission Acknowledgement

Submitting a plan request is synchronous: BTO returns the BTO-owned `plan_id`, which BCO uses to
correlate the terminal notification and read the result. The response is transport-level, not a
versioned contract.

```json
{
  "plan_id": "PLAN_ID",
  "request_id": "PLAN-REQ-0001"
}
```

The terminal result for `plan_id` uses [build-test-plan-result](build-test-plan-result.md).

## Compatibility Rules

- Consumers must ignore unknown optional fields.
