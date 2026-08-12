---
stream: "BTO"
topic: "Minimal plan admission"
priority: high
publish: false
---

# Accept build-test plan

## Description

Before admission is hardened, BTO must accept and store one build-test plan request.

## Contribution

- Delivers: A stored BTO plan and plan-submission acknowledgement

## Acceptance criteria

- [ ] Accept a valid build-test plan request through the BTO REST API.
- [ ] Store the request and return its `plan_id` and `request_id`.
- [ ] Reject a malformed request without creating plan state.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Build-test plan request](../../../docs/contracts/build-test-plan-request.md)
