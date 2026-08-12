---
stream: "BCO"
topic: "BCO-BTO integration"
priority: high
publish: false
---

# Connect BCO to BTO plan submission

## Description

BCO and BTO must exchange one build-test plan request before the remaining campaign workflow is
added. This task builds the BCO HTTP client and proves it with a valid fixture request. Building
the request from stored campaign state belongs to the later plan-submission task.

## Contribution

- Delivers: BCO plan submission through the BTO REST API

## Acceptance criteria

- [ ] BCO submits one valid build-test plan request through the BTO REST API.
- [ ] BTO stores the request and returns its `plan_id` and `request_id`.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BTO design](../../../docs/components/bto.md)
- [Build-test plan request](../../../docs/contracts/build-test-plan-request.md)
