# Campaign Request Contract

**Status:** DRAFT

**Version:** 1

This contract defines the request body BCO admits for one bisection campaign.

The request body carries the bisection problem and optional composition selection.
Trigger identity and authorization are transport context, not request-body fields.

## Request shape

This is the generic request shape.

```json
{
  "contract_version": "campaign-request/v1",
  "regression_type": "REGRESSION_TYPE",
  "source_tree": {
    "url": "SOURCE_REPO_URL"
  },
  "boundaries": {
    "good": {
      "commit": "GOOD_COMMIT_SHA"
    },
    "bad": {
      "commit": "BAD_COMMIT_SHA"
    }
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
    }
  },
  "composition": "COMPOSITION_NAME",
  "expected_signal": {},
  "search_policy": {
    "type": "SEARCH_POLICY_TYPE",
    "parameters": {}
  }
}
```

## Required Top-Level Fields

- `contract_version`: must be `campaign-request/v1`.
- `regression_type`: type of regression to bisect. Can be `build`, `boot`, `config`, `unit_test`,
  and `performance`.
- `source_tree`: source repository identity.
- `boundaries`: known-good and known-bad source boundaries.
- `scope`: fixed dimensions that must stay constant across all steps. Carries WHAT to build and test;
  see `scope` field semantics below.
- `expected_signal`: observation, signature, metric, or condition that defines the regression in
  investigation.
- `search_policy`: commit selection policy.

## Field Semantics

### `source_tree`

`source_tree` identifies the Git repository used for the campaign:

```json
{
  "url": "https://example.host/linux.git"
}
```

Deployment-specific identifiers may be added, but the request must include a repository URL.

`source_tree` participates in source identity and build identity.

### `boundaries`

```json
{
  "good": {
    "commit": "GOOD_COMMIT_SHA"
  },
  "bad": {
    "commit": "BAD_COMMIT_SHA"
  }
}
```

Required fields:

- `good.commit`: commit known by the caller to behave correctly under the campaign scope.
- `bad.commit`: commit known by the caller to exhibit the regression under the same scope.

Both commit refs must be resolvable in `source_tree` before the campaign can be executed.

### `scope`

```json
{
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
  }
}
```

Required fields depend on `regression_type` per the regression-type scope table in
[bisection-data-model](../bisection-data-model.md). The execution profile does not define scope
completeness.

For `performance`, the table's `metric` dimension is supplied via `expected_signal.metric` (name and
unit), not through `scope`. All other listed dimensions come from `scope`.

Common fields:

- `arch`: target architecture for build and test.
- `kernel_config.target`: named kernel configuration target.
- `kernel_config.fragments`: optional ordered list of configuration fragment references.
- `toolchain.name`: toolchain name or family.
- `toolchain.version`: requested toolchain version when the caller needs one fixed.
- `sut`: system-under-test profile.
- `workload.name`: workload, test, benchmark, or unit-test target.
- `workload.configuration`: workload parameters that must stay fixed across campaign steps.

### `composition`

`composition` is optional and requests a named BTO runtime configuration. When absent, the
system uses the trigger or deployment default. The system resolves the composition before
creating the campaign.

The composition resolves inside BTO to the internal planner, builder, and tester roles. One
runtime instance may implement multiple roles; the request does not describe that internal wiring.

### `expected_signal`

`expected_signal` describes the regression the campaign is trying to reproduce. Its required
shape depends on `regression_type`.

For binary regression types like `build`, `boot`, `config`, `unit_test`:

```json
{
  "type": "log_signature",
  "signature": "EXPECTED_FAILURE_SIGNATURE"
}
```

Binary field semantics:

- `type`: expected signal class.
- `signature`: expected error, failure, or result signature.

For `performance`:

```json
{
  "type": "performance_change",
  "metric": {
    "name": "METRIC_NAME",
    "unit": "UNIT",
    "higher_is_better": true
  },
  "baseline_value": 100000,
  "threshold": {
    "minimum_effect_size_magnitude": "small"
  }
}
```

Performance `expected_signal` field semantics:

- `type`: must identify a performance-change signal.
- `metric.name`: metric identifier supplied by the caller.
- `metric.unit`: unit string for the measurement values.
- `metric.higher_is_better`: boolean metric direction supplied by the caller.
- `baseline_value`: measurement at `boundaries.good.commit`, supplied by the caller. Required.
  This is the single baseline reference each midpoint analysis is compared against.
- `threshold.minimum_effect_size_magnitude`: optional minimum analyzer-reported magnitude that
  justifies marking a step `bad`. When absent, the Decision engine uses the strategy default.

### `search_policy`

Object shape:

```json
{
  "type": "SEARCH_POLICY_TYPE",
  "parameters": {}
}
```

Required fields:

- `type`: commit-selection policy name.

Optional fields:

- `parameters`: policy-specific options. Empty object means the selected policy defaults apply.

`search_policy` defines how the commit selector chooses the next commit or candidate set.

Accepted values are `bisect`, `n_bisect`, `multi_level_bisect`, and `custom`. Admission accepts
`bisect` by default and rejects `n_bisect`, `multi_level_bisect`, and `custom` unless the
deployment provides documented extensions.

## Admission Context

Trigger identity and authorization are transport context, not fields in this request body. A
deployment may reject a request before campaign creation when the transport credential is missing,
unknown, or not associated with usable execution settings.

Admission validates the request body against this contract and the selected campaign execution
profile (see [campaign-execution-profile](campaign-execution-profile.md)).

## Admission Rejection

When admission rejects a request, the response uses shape like this:

```json
{
  "errors": [
    {
      "field": "expected_signal.baseline_value",
      "message": "baseline_value is required for regression_type=performance"
    }
  ],
  "existing_campaign_ref": null
}
```

- `errors`: non-empty list. Each entry has `field` and `message`.
  - `field`: dotted path to the offending request field, or `null` when the failure is not tied
    to one field (for example authorization).
  - `message`: human-readable explanation of what was wrong.
- `existing_campaign_ref`: existing campaign identifier when the request maps to an already
  admitted equivalent campaign; `null` otherwise. Its presence is how a caller recognizes a
  duplicate without a separate error code.

### Persistence

An admission rejection is returned synchronously to the trigger and is not persisted as a
campaign record. No campaign or step state is created for a rejected request.

## Equivalence Fields

Campaign equivalence is based on the fields that define the bisection problem. The equivalence
key includes:

- `source_tree`;
- `boundaries`;
- `regression_type`;
- `scope`;
- `expected_signal`;
- `search_policy`;
- resolved `composition`.
