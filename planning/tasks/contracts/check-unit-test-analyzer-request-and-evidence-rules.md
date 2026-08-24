---
stream: "Contracts"
topic: "Results analysis"
priority: high
publish: false
---

# Check unit-test analyzer request and evidence rules

## Description

This task checks only the request, rejection, evidence, and observation fields listed below for the
unit-test path. It does not change how Results Analyzer turns raw test output into a qualification or
error-signature observation. The two earlier Results Analyzer tasks implement those rules.

## Contribution

- Delivers: Results Analyzer rejects the listed non-content inputs and returns the listed unit-test evidence fields and IDs

## Acceptance criteria

- [ ] A correct `results-analyzer-request/v1` contains `request_id`, `campaign_id`, `step_id`,
      `attempt_id`, `regression_type: unit_test`, `scope`, `expected_signal`, and an inline
      `build-test-plan-result/v1` whose outcome is `content_result`.
- [ ] Requests containing `infrastructure_failure` or `invalid_request` plan outcomes are rejected by
      Results Analyzer without returning evidence.
- [ ] Returned evidence copies `campaign_id`, `step_id`, and `attempt_id` from the request and contains
      a non-empty `observations` list.
- [ ] A non-`parse_error` set contains exactly one `qualification` observation; a `parse_error` set
      contains exactly one observation, of type `parse_error`.
- [ ] Every observation has `observation_id`, a contract-defined `observation_type`, `name`, `value`,
      and `source_refs.artifact_ref`. `value` contains JSON data, not source-specific free-form text.

## Sources

- [Results Analyzer request](../../../docs/contracts/results-analyzer-request.md)
- [Observation contract](../../../docs/contracts/observation-contract.md)
