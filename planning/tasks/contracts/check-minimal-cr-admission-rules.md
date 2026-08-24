---
stream: "Contracts"
topic: "Admission and configuration"
priority: high
publish: false
---

# Check minimal CR admission rules

## Description

`Accept a CR` already tests one correct unit-test request and one malformed request. This task checks
only the missing and invalid fields listed below for the same unit-test path. Each test changes one
part of the request, sends it to BCO, checks the returned error, and checks that BCO saved no campaign
or step data. Checks that need the full deployment profile remain in the later full CR validation
task.

## Contribution

- Delivers: Listed unit-test CR errors are returned without creating campaign or step data

## Acceptance criteria

- [ ] Tests reject a `contract_version` other than `campaign-request/v1`.
- [ ] Tests remove each required top-level field in turn: `contract_version`, `regression_type`,
      `source_tree`, `boundaries`, `scope`, `expected_signal`, and `search_policy`.
- [ ] Tests reject an unrecognized `regression_type` or `search_policy.type`.
- [ ] Tests remove each scope field required by the unit-test CR definition.
- [ ] Tests reject an expected signal without `type` or `signature`.
- [ ] Each bad request returns the response defined under `Admission Rejection`, with at least one
      error. Every error names its field and includes a message.
- [ ] Each bad request creates no campaign or step data.

## Sources

- [Minimal CR admission](../bco/accept-cr.md)
- [Unit-test CR fields](../design-and-docs/define-unit-test-cr-fields.md)
- [CR](../../../docs/contracts/campaign-request.md)
