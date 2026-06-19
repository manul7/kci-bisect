# Commit Selection Result Contract

**Status:** DRAFT

**Version:** 1

Defines the plain `bisect` result shape only, returned by the Commit selector to BCO.

Plain `bisect` returns either one candidate commit, a converged single-culprit state, a blocked
state, or an invalid-request result. Multi-candidate result metadata for `n_bisect` and
`multi_level_bisect` remains outside this contract.

## JSON Shape: Selected Candidate

```json
{
  "contract_version": "commit-selection-result/v1",
  "request_id": "CSR-0001",
  "campaign_id": "CAMPAIGN_ID",
  "selection_round": 3,
  "search_policy": {
    "type": "bisect"
  },
  "result_type": "selected",
  "candidates": [
    {
      "commit": "CANDIDATE_COMMIT_SHA",
      "position": {
        "kind": "git_bisect_midpoint"
      },
      "rationale": "Selected by git bisect for the current good/bad range."
    }
  ],
  "selector_state": {
    "good_boundary": "GOOD_BOUNDARY_COMMIT_SHA",
    "bad_boundary": "BAD_BOUNDARY_COMMIT_SHA",
    "skipped_commits": [],
    "weak_commits": [],
    "history_view": {
      "type": "git_bisect_default"
    }
  }
}
```

## JSON Shape: Converged

```json
{
  "contract_version": "commit-selection-result/v1",
  "request_id": "CSR-0002",
  "campaign_id": "CAMPAIGN_ID",
  "selection_round": 4,
  "search_policy": {
    "type": "bisect"
  },
  "result_type": "converged",
  "candidates": [],
  "selector_state": {
    "good_boundary": "GOOD_BOUNDARY_COMMIT_SHA",
    "bad_boundary": "BAD_BOUNDARY_COMMIT_SHA",
    "skipped_commits": [],
    "weak_commits": [],
    "history_view": {
      "type": "git_bisect_default"
    }
  }
}
```

## JSON Shape: Blocked

```json
{
  "contract_version": "commit-selection-result/v1",
  "request_id": "CSR-0003",
  "campaign_id": "CAMPAIGN_ID",
  "selection_round": 4,
  "search_policy": {
    "type": "bisect"
  },
  "result_type": "blocked",
  "candidates": [],
  "blocked_reason": "only_skipped_or_weak_candidates_remain",
  "selector_state": {
    "good_boundary": "GOOD_BOUNDARY_COMMIT_SHA",
    "bad_boundary": "BAD_BOUNDARY_COMMIT_SHA",
    "skipped_commits": [
      "SKIPPED_COMMIT_SHA"
    ],
    "weak_commits": [
      "WEAK_COMMIT_SHA"
    ],
    "history_view": {
      "type": "git_bisect_default"
    }
  }
}
```

## Result Types

- `selected`: exactly one candidate is returned.
- `converged`: no candidate remains because the bad boundary is isolated as the first bad commit.
- `blocked`: the selector cannot return a new candidate that can move the range.
- `invalid_request`: the request cannot be evaluated, for example because boundary commits cannot
  be resolved or the requested history view is unsupported.

## Required Fields

Every result contains:

- `contract_version`: must be `commit-selection-result/v1`.
- `request_id`: copied from the request.
- `campaign_id`: copied from the request.
- `selection_round`: copied from the request.
- `search_policy.type`: `bisect`.
- `result_type`: one of `selected`, `converged`, `blocked`, or `invalid_request`.
- `candidates`: one candidate for `selected`, empty for all other result types.
- `selector_state`: the selector's view of the bisect state (see Selector State Fields), present when
  the request was valid enough to construct state.

## Conditional Fields

- `blocked_reason`: present only for `result_type: blocked`; machine-readable reason the range cannot
  advance. The only defined value is `only_skipped_or_weak_candidates_remain`.
- `errors`: present only for `result_type: invalid_request`; see Invalid Request.

## Candidate Fields

Plain `bisect` returns exactly one candidate.

Candidate fields:

- `commit`: commit SHA to test next; identifies the candidate.
- `position.kind`: `git_bisect_midpoint` for plain bisect.
- `rationale`: short human-readable explanation.

## Selector State Fields

`selector_state` reports the selector's view of the bisect state. It is omitted for `invalid_request`
when no state could be constructed.

- `good_boundary`: the selector's current known-good boundary commit.
- `bad_boundary`: the selector's current known-bad boundary commit. For `converged`, this is the
  isolated first bad commit.
- `skipped_commits`: commits the selector is treating as skipped.
- `weak_commits`: commits marked `weak`; uncertain, and do not advance the boundaries.
- `history_view`: the history view the selector used, echoing the request.

## Invalid Request

An `invalid_request` result carries the common fields, an empty `candidates`, and a non-empty
`errors`. It omits `selector_state` when no state could be constructed.

```json
{
  "contract_version": "commit-selection-result/v1",
  "request_id": "CSR-0003",
  "campaign_id": "CAMPAIGN_ID",
  "selection_round": 4,
  "search_policy": {
    "type": "bisect"
  },
  "result_type": "invalid_request",
  "candidates": [],
  "errors": [
    {
      "field": "boundaries.good.commit",
      "code": "commit_not_found",
      "message": "Good boundary could not be resolved in the selected source tree."
    }
  ]
}
```

- `errors`: non-empty for `invalid_request`. Each entry has:
  - `field`: dotted path to the offending request field.
  - `code`: machine-readable error code.
  - `message`: human-readable explanation.

`invalid_request` is not a campaign outcome and not a step decision. It indicates BCO accepted a
campaign state that the selector cannot evaluate.
