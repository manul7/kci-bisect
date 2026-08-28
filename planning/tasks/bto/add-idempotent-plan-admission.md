---
stream: "BTO"
topic: "Plan lifecycle"
priority: high
publish: false
---

# Reuse a BTO plan when BCO retries

## Description

BCO may retry a plan submission after a timeout or restart. When the idempotency key and execution
content are unchanged, BTO must return the plan created by the first submission and must not start
the work again. This task does not decide what happens when execution content changes under the
same key because the request contract does not define that case.

## Contribution

- Delivers: One BTO plan and one execution when BCO retries the same submission

## Acceptance criteria

- [ ] The first valid submission creates one plan and returns its `plan_id` and `request_id`.
- [ ] A retry with the same idempotency key and execution fields returns the original `plan_id` and
      the `request_id` stored from the first submission.
- [ ] A different retry `request_id` is ignored as the request contract defines.
- [ ] A different retry `trace_context` does not change the plan identity or start the plan again.
- [ ] Two submissions with the same idempotency key cannot create two plan records or start the plan
      twice.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Build-test plan request](../../../docs/contracts/build-test-plan-request.md)
