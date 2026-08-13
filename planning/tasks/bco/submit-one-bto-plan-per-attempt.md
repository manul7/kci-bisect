---
stream: "BCO"
topic: "Executor"
priority: high
publish: false
---

# Submit one BTO plan per attempt

## Description

BCO submits one build-test plan request for a stored step attempt and retains the BTO acknowledgement.

## Contribution

- Delivers: One BTO plan submission for each step attempt

## Acceptance criteria

- [ ] The request carries the stored candidate, scope, and composition.
- [ ] The request asks for the unit-test result output as the input design defines.
- [ ] The idempotency key encodes the campaign, step, attempt number, and action type.
- [ ] BCO stores the returned `plan_id` and `request_id` against the attempt.
- [ ] Submission failure stores no plan reference.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [Build-test plan request](../../../docs/contracts/build-test-plan-request.md)
- [Unit-test result input](../design-and-docs/select-unit-test-result-input.md)
