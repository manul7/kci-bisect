# BCO Output Contract

**Status:** DRAFT

**Version:** 1

This contract defines the campaign output model exposed by BCO.
The output is derived from BCO campaign records and downstream references.
It is a read model, not the full BCO State store schema.

The output exposes fields needed for inspection, audit, reporting, and validation. Internal
orchestration cursors stay in the State store unless consumers need them.

## Output Shape

```json
{
  "contract_version": "bco-output/v1",
  "campaign": {
    "campaign_id": "CAMPAIGN_ID",
    "status": "completed",
    "timestamps": {
      "accepted_at": "TIMESTAMP",
      "started_at": "TIMESTAMP",
      "terminal_at": "TIMESTAMP"
    },
    "regression_type": "REGRESSION_TYPE",
    "source_tree": {
      "url": "SOURCE_REPO_URL"
    },
    "search_boundaries": {
      "initial": {
        "good": {
          "commit": "INITIAL_GOOD_COMMIT_SHA"
        },
        "bad": {
          "commit": "INITIAL_BAD_COMMIT_SHA"
        }
      },
      "latest": {
        "good": {
          "commit": "LATEST_GOOD_COMMIT_SHA"
        },
        "bad": {
          "commit": "LATEST_BAD_COMMIT_SHA"
        }
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
  },
  "steps": [
    {
      "step_id": "STEP_ID",
      "round": 1,
      "commit": "CANDIDATE_COMMIT_SHA",
      "status": "decided",
      "build_ref": "BUILD_IDENTITY_REF",
      "attempt_refs": [
        "ATTEMPT_REF"
      ],
      "decision": {
        "value": "STEP_DECISION",
        "summary": "STEP_DECISION_SUMMARY",
        "decision_ref": "DECISION_RESULT_REF"
      },
      "plan_refs": [
        {
          "attempt_number": 1,
          "request_id": "PLAN_REQUEST_ID",
          "plan_id": "BTO_PLAN_ID",
          "result_ref": "BTO_RESULT_REF"
        }
      ],
      "evidence_refs": [
        "EVIDENCE_REF"
      ],
      "artifact_refs": [
        {
          "kind": "ARTIFACT_KIND",
          "uri": "ARTIFACT_URI"
        }
      ]
    }
  ],
  "outcome": {
    "result": "single_culprit",
    "culprit": {
      "commit": "CULPRIT_COMMIT_SHA"
    },
    "rationale": {
      "summary": "FINAL_OUTCOME_SUMMARY"
    }
  },
  "failure": null,
  "diagnostics": []
}
```

## Required top-level fields

- `contract_version`: must be `bco-output/v1`.
- `campaign`: admitted campaign identity and request dimensions.
- `steps`: ordered list of steps known to BCO.
- `outcome`: final campaign conclusion, or `null` for non-terminal or failed campaigns.
- `failure`: campaign failure record, or `null` when the campaign has not failed.

For terminal campaigns, exactly one of `outcome` or `failure` must be non-null.

Optional top-level fields:

- `diagnostics`: non-fatal output warnings.

## Field semantics

### `campaign`

`campaign` identifies the admitted bisection problem and current campaign state.

Required fields:

- `campaign_id`: BCO-assigned campaign identity.
- `status`: current campaign lifecycle status.
- `timestamps.accepted_at`: time admission durably created the campaign.
- `regression_type`: admitted regression type.
- `source_tree`: source repository identity.
- `search_boundaries.initial`: admitted good and bad search boundaries.
- `search_boundaries.latest`: good and bad boundaries after the latest terminal `good`/`bad`
  decisions. `skip`, `weak`, and `exhausted` do not move the boundaries.
- `scope`: admitted campaign scope.
- `composition`: resolved BTO runtime composition.
- `expected_signal`: admitted expected signal.
- `search_policy`: admitted search policy.

`source_tree`, `scope`, `expected_signal`, `search_policy`, and `composition` use the same shapes
as [campaign request](campaign-request.md).

`regression_type` uses the same values as [campaign request](campaign-request.md).

`timestamps.started_at` is absent until campaign execution starts. `timestamps.terminal_at` is
required for a terminal campaign and absent otherwise.

Defined `status` values:

- `accepted`: admitted durably, but campaign execution has not started;
- `running`: admitted and being bisected;
- `completed`: campaign reached a normal final outcome;
- `failed`: campaign cannot continue because of an unrecoverable orchestration, configuration, or
  execution-contract problem.

The optional Verifier extension may additionally expose `verifying` while post-search verification
is running.

### `steps`

`steps` is ordered by `round`, then by `step_id`.

Required fields:

- `step_id`: BCO-assigned step identity.
- `round`: commit-selection round that produced the candidate.
- `commit`: candidate commit tested by the step.
- `status`: current step lifecycle status.

Optional fields:

- `build_ref`: concrete build identity used for the tested step, when available.
- `attempt_refs`: references to the step's attempt records (one per attempt).
- `decision`: final step decision summary when the step has one.
- `plan_refs`: BTO request, plan, and result references in this step.
- `evidence_refs`: evidence records used for the step decision.
- `artifact_refs`: build or test artifacts surfaced for consumers, as `{kind, uri}` (the shape from
  [build-test-plan-result](build-test-plan-result.md)).

Defined `status` values:

- `pending`: candidate step is recorded but no downstream work has started;
- `running`: at least one attempt is in progress or being processed;
- `decided`: the step has a final step decision;
- `exhausted`: campaign policy exhausted the step without a final decision (policy-enabled, oq-005).

`decision.value` is one of `good`, `bad`, `skip`, or `weak`. `summary` is a short human-readable
reason. `decision_ref` points to the Decision engine result ([decision-contract](decision-contract.md)).

`plan_refs[].request_id` is the BCO-generated build-test plan request ID.

`plan_refs[].plan_id` is the BTO-owned identity for the whole build/test work item.

`plan_refs[].result_ref` points to the final build-test plan result. It is omitted until BTO
reports a terminal result for the plan — an entry without `result_ref` means the plan was submitted
but has no terminal result yet (the step is `running`), distinct from malformed output. Per-role
execution audit references are not exposed in this read model; BTO execution detail stays behind
the plan result.

`plan_refs[].attempt_number` is the execution-side attempt ordinal (see
[bisection-data-model](../bisection-data-model.md)). Each `attempt_refs` record binds that
`attempt_number` to the durable `attempt_id` the evidence and decision records carry, so consumers
join a plan result to its evidence and decision through the attempt record.

### `outcome`

`outcome` is present only when BCO records a final campaign conclusion.

Defined `result` values:

- `single_culprit`;
- `narrowed_range`;
- `not_confirmed`;
- `unresolved`.

Required fields by result:

- `single_culprit`: `culprit.commit`.
- `narrowed_range`: `range.good.commit` and `range.bad.commit`.
- `not_confirmed`: `rationale.summary`.
- `unresolved`: `rationale.summary`.

`culprit` and `range` are present only when they apply to the recorded result.

### `failure`

`failure` is present only when the campaign cannot continue and BCO records a campaign failure.

Shape:

```json
{
  "reason": "FAILURE_REASON",
  "message": "Human-readable failure summary.",
  "details": {}
}
```

`failure` is not a bisection conclusion.

### `diagnostics`

`diagnostics` contains non-fatal output warnings. It does not change campaign state.

## Compatibility Rules

- Consumers must ignore unknown optional fields.
- Producers must not embed large logs, measurements, or backend-native result payloads.
- Producers must use references for build-test plan results, evidence records, and artifacts.
