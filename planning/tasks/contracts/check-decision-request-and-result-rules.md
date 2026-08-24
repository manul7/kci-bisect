---
stream: "Contracts"
topic: "Step decisions"
priority: high
publish: false
---

# Check Decision request and result rules

## Description

This task checks only the common request fields, result fields, and ID and evidence-reference rules
listed below. It does not check how a strategy chooses `good` or `bad`. Decision engine rejects a bad
request. BCO does not save a result when its campaign, step, attempt, or evidence references do not
match the request.

## Contribution

- Delivers: Decision requests and results use the listed fields, and BCO saves no mismatched result

## Acceptance criteria

- [ ] A `decision-request/v1` contains `request_id`, `campaign_id`, `step_id`, `attempt_id`, `commit`,
      `regression_type`, `scope`, `expected_signal`, and `decision_strategy`.
- [ ] A request contains either `observation_set` or `performance_evidence`, but not both.
- [ ] Observation evidence has the same `campaign_id`, `step_id`, and `attempt_id` as the outer
      request.
- [ ] A result copies `request_id`, `campaign_id`, `step_id`, and `attempt_id` from the request and
      contains exactly one of `good`, `bad`, `skip`, or `weak` plus `rationale.summary`.
- [ ] A result references only supporting observation IDs or evidence IDs carried by the request.
- [ ] `good` and `bad` include `matched_expected_signal`; `skip` includes `skip_reason`; `weak`
      includes `uncertainty_reason`.
- [ ] When a result is missing a required field, has a different ID, or refers to evidence that was
      not in the request, BCO saves no step decision and fails the campaign under the existing
      no-retry behavior.

## Sources

- [Decision contract](../../../docs/contracts/decision-contract.md)
- [Observation contract](../../../docs/contracts/observation-contract.md)
