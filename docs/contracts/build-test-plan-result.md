# Build-Test Plan Result Contract

**Status:** DRAFT

**Version:** 1

This contract defines the terminal result returned by BTO to BCO when a build-test plan reaches a
terminal state. There is exactly one BCO-facing result per plan.

Any backend-native plan, job, or phase identifiers remain BTO-owned unless surfaced as audit
metadata.

The result uses the same terminal outcome categories as [runner outcome](runner-outcome.md), applied
to the bundled build-test plan result.

## JSON Shape

```json
{
  "contract_version": "build-test-plan-result/v1",
  "plan_id": "PLAN_ID",
  "request_id": "PLAN-REQ-0001",
  "outcome": "content_result",
  "reported_build_identity": {
    "source": {
      "url": "SOURCE_REPO_URL",
      "commit": "COMMIT_SHA"
    },
    "arch": "TARGET_SUT_ARCH",
    "config": {
      "base": "KERNEL_CONFIG_NAME",
      "fragments": []
    },
    "toolchain": {
      "name": "TOOLCHAIN_NAME",
      "version": "VERSION"
    },
    "build_producer": {
      "name": "BUILD_PRODUCER_NAME",
      "version": "VERSION",
      "parameters": {}
    }
  },
  "artifact_refs": [
    {
      "kind": "kernel_image",
      "uri": "ARTIFACT_URI"
    },
    {
      "kind": "modules",
      "uri": "ARTIFACT_URI"
    },
    {
      "kind": "measurements",
      "uri": "ARTIFACT_URI"
    }
  ],
  "raw_output_refs": [
    {
      "kind": "execution_log",
      "uri": "LOG_URI"
    },
    {
      "kind": "measurements",
      "uri": "OUTPUT_URI"
    }
  ],
  "trace_context": {},
  "metadata": {}
}
```

## Required Fields

- `contract_version`: must be `build-test-plan-result/v1`.
- `plan_id`: build-test plan identity, not a backend-native plan or job identifier.
- `request_id`: copied from the plan request.
- `outcome`: terminal plan outcome category, using the [runner outcome](runner-outcome.md)
  vocabulary.

## Optional Fields

- `reported_build_identity`: build identity reported by the builder for content-attributable
  build results, as defined in [build-identity](build-identity.md).
- `artifact_refs`: artifact references produced by the plan, with `kind` and `uri`.
- `raw_output_refs`: raw output references for logs, measurements, diagnostics, or other
  execution output.
- `reason`: short machine-readable reason code when `outcome` is not `content_result`.
- `message`: human-readable diagnostic summary.
- `trace_context`: the `trace_context` from the plan request, returned unchanged; absent if the
  request carried none. BTO must not modify or interpret it.
- `metadata`: deployment-specific metadata. Consumers must ignore unknown keys.

## Outcome Semantics

- `content_result`: the plan produced trustworthy content evidence. The outcome category
  describes attribution, not test pass/fail.
- `infrastructure_failure`: the plan did not produce trustworthy content evidence because the
  result is attributable to infrastructure or execution environment failure.
- `invalid_request`: BTO or a backend rejected the plan request as malformed or unsupported.

Artifact availability is represented by `artifact_refs`. Raw outputs and diagnostics are
represented by `raw_output_refs`, `reason`, `message`, and optional `metadata`.

For `content_result`, at least one of `artifact_refs` or `raw_output_refs` is non-empty.

`reported_build_identity` is audit metadata for the build content BTO produced or attempted. It is
not required for `invalid_request` or infrastructure-attributed failures where BTO cannot establish
a trustworthy build-content identity.

## Terminal Notification

When a plan reaches a terminal state, BTO sends BCO a terminal notification so BCO knows to read
the result. The notification is a delivery signal, not the result payload: it carries the plan
identity only. On receiving it, BCO fetches the build-test plan result defined above.

```json
{
  "contract_version": "build-test-plan-notification/v1",
  "plan_id": "PLAN_ID"
}
```

- `contract_version`: must be `build-test-plan-notification/v1`.
- `plan_id`: terminal plan; the key BCO uses to read the result.

The notification is sent only for terminal plans; non-terminal job states are internal to BTO and
are never notified.

The notification must not carry the outcome, artifacts, or raw output. BCO reads those from the
plan result.

### Notification delivery

The notification is best-effort and not the source of truth: it may be lost or delivered more than
once. The result stays retrievable by `plan_id` whether or not the notification arrives, and BCO
must handle repeated notifications for the same `plan_id` idempotently.

## Compatibility Rules

- Producers must include `reported_build_identity` whenever `outcome` is `content_result` and the
  builder role established the build inputs it used.
- Consumers must ignore unknown optional fields.
- BTO must not split one plan into multiple results. If retry inside the plan is required, BTO
  resolves it internally before returning the bundled result.
