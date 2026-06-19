# Runner Outcome Contract

**Status:** DRAFT

**Version:** 1

When BTO invokes builder or tester roles separately, those role backends may return
backend-specific job metadata, but they must expose the same normalized terminal outcome
category. The category states whether the terminal result is content-attributable,
infrastructure-attributable, or rejected as an invalid request.

This contract defines terminal role outcomes only. Intermediate job states such as `queued`,
`running`, and `unknown` are not terminal outcomes; they are internal backend or BTO status.

## Outcome Categories

### `content_result`

The role backend executed the requested build or test action far enough to produce
trustworthy content evidence.

This category includes both successful and failing kernel-content behavior:

- a build that produced the requested kernel artifacts;
- a build that failed because the source/config/toolchain combination did not build;
- a test that completed and produced logs or measurements;
- a test that failed in a way attributable to the kernel, test payload, or expected workload.

`content_result` does not mean `good` or `bad`. It only says the role result is trustworthy
content evidence for a downstream consumer.

### `infrastructure_failure`

The role backend could not produce trustworthy content evidence because the execution
infrastructure failed or the result is not attributable to the kernel content under test.

Examples include scheduler failure, lost job, lab controller failure, missing device,
backend API failure, artifact upload/download failure, and a timeout that the role backend cannot
attribute to the kernel or workload under test.

This category is not content evidence.

### `invalid_request`

The role backend rejected the request because it was malformed, internally contradictory,
unsupported by that backend, or missing required backend-specific parameters.

`invalid_request` is not content evidence and does not describe infrastructure health.

## Classification Rule

A role backend must choose the outcome from what caused a failure, not from how it looks.

For example, a timeout caused by a lab scheduler or missing device is `infrastructure_failure`.
A timeout with serial output showing the kernel hung during the requested boot or workload may be
`content_result`, because it is evidence about the kernel content under test.

When attribution is uncertain, the role backend should return `infrastructure_failure` with
diagnostic references.
