---
stream: "E2E"
topic: "Functional scenario"
priority: high
publish: false
---

# Test the unit-test campaign path

## Description

The unit-test vertical slice needs proof that one expected test failure reaches the expected culprit through
every component boundary.

## Contribution

- Delivers: Proof that the unit-test path reaches a culprit E2E

## Acceptance criteria

- [ ] The test admits one `unit_test` campaign and reaches the expected culprit.
- [ ] The requested test suite and test case reach execution unchanged.
- [ ] The test checks the happy-path shape of each exchange: CR and BCO output, selection request
      and result, plan request and result, analyzer request and evidence, decision request and
      result. Negative cases stay in the contract-check tasks.
- [ ] The final BCO output matches the expected campaign result.

## Sources

- [Architecture](../../../docs/architecture.md)
- [CR](../../../docs/contracts/campaign-request.md)
- [BCO output](../../../docs/contracts/bco-output.md)
- [Unit-test CR fields](../design-and-docs/define-unit-test-cr-fields.md)
