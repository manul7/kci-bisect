---
stream: "Contracts"
topic: "Campaign output"
priority: high
publish: false
---

# Check MVP BCO output rules

## Description

The minimal E2E test checks one completed response with one culprit. This task checks only the
campaign states, fields, timestamps, step order, and outcomes listed below. The tests use the same
code that builds the REST API response. The optional Verifier's `verifying` state and the future
retry policy's `exhausted` state are not part of this task.

## Contribution

- Delivers: BCO responses for the listed campaign states contain the listed fields, timestamps, step order, and outcomes

## Acceptance criteria

- [ ] Tests cover campaign status `accepted`, `running`, `completed`, and `failed`,
      and step status `pending`, `running`, and `decided`.
- [ ] Every response includes `contract_version: bco-output/v1`, `campaign_id`, `status`,
      `regression_type`, `source_tree`, initial and latest search boundaries, `scope`, `composition`,
      `expected_signal`, `search_policy`, ordered `steps`, `outcome`, and `failure`.
- [ ] Every campaign has `timestamps.accepted_at`; `started_at` is absent while status is `accepted`
      and present after execution starts; `terminal_at` is present only for `completed` or `failed`.
- [ ] Every step includes `step_id`, `round`, `commit`, and `status`, and the response orders steps by
      `round` and then `step_id`.
- [ ] Completed responses contain an `outcome` and set `failure` to null. Failed responses set
      `outcome` to null and contain a `failure`. Accepted and running responses set both to null.
- [ ] Tests cover `single_culprit`, `narrowed_range`, `not_confirmed`, and `unresolved`, including
      each result's required `culprit`, `range`, or `rationale` field.

## Sources

- [BCO output](../../../docs/contracts/bco-output.md)
- [State store design](../../../docs/components/state-store.md)
