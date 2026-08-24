---
stream: "Contracts"
topic: "Build-test orchestration"
priority: high
publish: false
---

# Check MVP BTO request and result rules

## Description

The minimal BTO round trip checks one accepted plan and one final result. This task checks only the
request errors, acknowledgement fields, lookup cases, and final-result fields listed below. Handling
repeated submissions with the same idempotency key remains a separate later task.

## Contribution

- Delivers: BTO rejects the listed request errors and returns the listed acknowledgement, lookup, and result fields

## Acceptance criteria

- [ ] A correct `build-test-plan-request/v1` returns a submission response containing a BTO-owned
      `plan_id` and the request's `request_id`.
- [ ] A request with a `contract_version` other than `build-test-plan-request/v1`, or without
      `request_id`, `idempotency_key`, `source`, `scope`, or `composition`, returns the submission
      error defined by the BTO OpenAPI operation and creates no plan state.
- [ ] Lookup tests check the status and response body defined by the BTO OpenAPI operation for
      a known non-terminal plan, a known terminal plan, and an unknown `plan_id`.
- [ ] Every terminal `build-test-plan-result/v1` contains the looked-up `plan_id`, the accepted
      request's `request_id`, and one outcome from `content_result`, `infrastructure_failure`, or
      `invalid_request`.
- [ ] A `content_result` contains at least one `artifact_refs` or `raw_output_refs` entry and includes
      `reported_build_identity` when the builder knows which build inputs it used.
- [ ] When the request contains `trace_context`, the terminal result returns it unchanged; when the
      request omits it, the result omits it.

## Sources

- [BTO OpenAPI](../design-and-docs/define-bto-oapi-spec.md)
- [BTO result lookup behavior](../design-and-docs/define-bto-result-lookup-behavior.md)
- [Build-test plan request](../../../docs/contracts/build-test-plan-request.md)
- [Build-test plan result](../../../docs/contracts/build-test-plan-result.md)
