# Campaign Execution Profile Contract

**Status:** DRAFT

**Version:** 1

This contract defines deployment capability metadata used to validate whether a campaign request
can run in a specific deployment.

The profile is not a replacement for the [campaign request](campaign-request.md). It describes
supported request shapes; it does not carry one campaign's source range, scope, or evidence
target.

## JSON Shape

```json
{
  "contract_version": "campaign-execution-profile/v1",
  "profile_id": "PROFILE_ID",
  "supported_regression_types": [
    "REGRESSION_TYPE"
  ],
  "supported_search_policies": [
    "SEARCH_POLICY_TYPE"
  ],
  "supported_compositions": [
    "COMPOSITION_NAME"
  ],
  "evidence_paths": [
    {
      "regression_type": "REGRESSION_TYPE",
      "path": "EVIDENCE_PATH",
      "decision_strategy": "DECISION_STRATEGY_TYPE"
    }
  ]
}
```

## Required Fields

- `contract_version`: must be `campaign-execution-profile/v1`.
- `profile_id`: deployment-defined profile identifier.
- `supported_regression_types`: regression types this profile can execute.
- `supported_search_policies`: search policies this profile can execute. Only `bisect` is generic;
  `n_bisect`, `multi_level_bisect`, and `custom` require documented deployment/selector extensions
  (see [campaign-request](campaign-request.md)).
- `supported_compositions`: runtime composition names accepted from campaign requests. The set is
  deployment-defined. Composition configuration is defined in
  [execution-composition](execution-composition.md).
- `evidence_paths`: allowed evidence paths for supported regression types, each with its stage 2
  `decision_strategy`.

All four arrays (`supported_regression_types`, `supported_search_policies`, `supported_compositions`,
`evidence_paths`) must be non-empty; a profile that admits nothing is a configuration error.

## Evidence Paths

`evidence_paths[].path` declares the stage 2 evidence contract produced for a qualified candidate
of a supported regression type. An unqualified candidate instead yields an `observation_set`
carrying the stage 1 `qualification` observation, regardless of the declared `path`.

Each entry's `regression_type` is one of `supported_regression_types`; every supported regression
type has exactly one entry, and `path` and `decision_strategy` are both required. Multiple entries
for the same regression type are not defined.

Defined values:

- `observation_set`: Results Analyzer emits the shared observation contract. Used for `build`,
  `boot`, `config`, `unit_test`.
- `performance_evidence`: Results Analyzer emits generic performance evidence. Used for
  `performance`.

Profiles may define additional values only when the corresponding contract is documented.

`evidence_paths[].decision_strategy` names the stage 2 evaluator applied to a qualified result.
The Decision engine runs a universal qualification gate first; the named strategy (`binary` or
`performance`) evaluates only qualified results (a `parse_error` set has no qualification observation
and maps directly to `skip`). The profile is the source of the decision strategy; the campaign
request does not carry one. See [decision-contract](decision-contract.md).

## Out-of-Profile Concerns

Optional-component availability, scope-completeness requirements, and output requirements are not
part of the profile shape:

- scope-completeness is determined by the campaign request `scope` and the regression-type scope
  table in [bisection-data-model](../bisection-data-model.md), not by the profile;
- optional components (verification, reporting, build cache, artifact store) are not gated by the
  profile;
- inspectable output conforms to [bco-output](bco-output.md).

## Validation Use

A request is compatible with a profile when:

- `regression_type` is supported;
- `search_policy.type` is supported;
- the resolved composition is in `supported_compositions`;
- the configured evidence path is supported.

Per-trigger permission to use the resolved composition is checked by BCO admission using Trigger
registry execution settings, not by the profile.

When a check fails, admission returns an admission rejection identifying the offending request
field, or `null` when the failure is not tied to one field, as defined in
[campaign-request](campaign-request.md).

The profile is a capability contract only. It does not validate whether the regression is real.

The profile carries no scenario-conversion rules; converting external fixtures into a campaign
request is external tooling, outside this contract.
