---
stream: "Contracts"
topic: "Commit selection"
priority: high
publish: false
---

# Check plain-bisect request and result rules

## Description

Standard bisect can already select a commit and finish a search. This task checks only the request
fields, result fields, and invalid-input cases listed below. It covers the `bisect` policy and the
`git_bisect_default` history view. It does not add another selection policy.

## Contribution

- Delivers: Plain bisect rejects the listed bad inputs and returns the listed request IDs and result fields

## Acceptance criteria

- [ ] A correct `commit-selection-request/v1` uses `search_policy.type: bisect` and
      `history_view.type: git_bisect_default` and contains `request_id`, `campaign_id`,
      `selection_round`, `source_tree`, `boundaries.good`, `boundaries.bad`, and `decision_history`.
- [ ] Every result copies `request_id`, `campaign_id`, `selection_round`, and `search_policy` from the
      request.
- [ ] A `selected` result contains exactly one candidate; `converged`, `blocked`, and
      `invalid_request` contain no candidates.
- [ ] `blocked_reason` appears only on `blocked`, and `errors` is non-empty and appears only on
      `invalid_request`.
- [ ] Commit references that cannot be resolved or do not form a usable Git bisect range return
      `invalid_request`.
- [ ] A policy other than `bisect` or a history view other than `git_bisect_default` returns
      `invalid_request`.
- [ ] Duplicate commits with conflicting marks, or marks that contradict the supplied boundaries,
      return `invalid_request`.
- [ ] Every `invalid_request` contains at least one error. Every error contains `field`, `code`, and
      `message`.

## Sources

- [Commit selection request](../../../docs/contracts/commit-selection-request.md)
- [Commit selection result](../../../docs/contracts/commit-selection-result.md)
