# Commit Selection Request Contract

**Status:** DRAFT

**Version:** 1

Defines the plain `bisect` request shape only, sent by BCO to the Commit selector.

The request describes the source tree, the current known good/bad boundaries, and `decision_history`
- per-commit selector marks projected from the campaign's terminal step outcomes. The Commit
selector uses this information to reproduce the current `git bisect` state and choose the next single
candidate commit, or to report that the range has converged or cannot progress.

Note: `n_bisect`, `multi_level_bisect`, and `custom` need separate contract extensions. They must not
reuse this shape silently if they require additional policy metadata.

## JSON Shape

```json
{
  "contract_version": "commit-selection-request/v1",
  "request_id": "CSR-0001",
  "campaign_id": "CAMPAIGN_ID",
  "selection_round": 3,
  "source_tree": {
    "url": "SOURCE_REPO_URL"
  },
  "search_policy": {
    "type": "bisect",
    "parameters": {}
  },
  "history_view": {
    "type": "git_bisect_default"
  },
  "boundaries": {
    "good": {
      "commit": "GOOD_COMMIT_SHA"
    },
    "bad": {
      "commit": "BAD_COMMIT_SHA"
    }
  },
  "decision_history": [
    {
      "step_id": "STEP_ID",
      "commit": "TESTED_COMMIT_SHA",
      "selector_mark": "good"
    }
  ]
}
```

## Required Fields

- `contract_version`: must be `commit-selection-request/v1`.
- `request_id`: unique identifier for this selector request.
- `campaign_id`: campaign requesting selection.
- `selection_round`: monotonic round number assigned by BCO.
- `source_tree`: Git repository identity from the campaign request.
- `search_policy`: must have `type: "bisect"` for this contract; `parameters` must be absent or
  empty. A non-empty `parameters` is `invalid_request` unless a separate contract defines it.
- `history_view`: Git history view used by the selector.
- `boundaries`: current known good and bad boundary commits.
- `decision_history`: per-commit selector marks BCO projects from the campaign's terminal step
  outcomes; empty on the first selection.

## Field Semantics

### `source_tree`

The selector resolves all commits against this repository. If either boundary commit or any
`decision_history[*].commit` cannot be resolved in the selected history view, the selector returns
`invalid_request`.

### `history_view`

`history_view` selects which commits the selector treats as candidates. Kernel history is
non-linear: with merges, the commits between `good` and `bad` depend on how history is traversed,
and that changes which commit gets tested.

For plain `bisect`, the only defined value is:

```json
{
  "type": "git_bisect_default"
}
```

`git_bisect_default` uses Git's default bisect machinery over the full reachable history between the
boundaries. Other views, such as first-parent only, are open under oq-008.

### `boundaries`

`boundaries.good.commit` is the current known-good commit. `boundaries.bad.commit` is the current
known-bad commit.

The selector must verify that the boundaries define a usable Git bisect range in the selected
history view. If the relationship is invalid or ambiguous for the configured history view, the
selector returns `invalid_request`.

### `decision_history`

BCO projects this from the campaign's terminal step outcomes in its State store; the selector never
reads the State store. Each entry carries:

- `step_id`: the BCO step the mark came from; correlation only, not used for selection.
- `commit`: the tested commit, applied to the bisect state by its `selector_mark`.
- `selector_mark`: how the selector should treat the commit, one of:
  - `good`: mark the commit good in the bisect state.
  - `bad`: mark the commit bad in the bisect state.
  - `skip`: mark the commit skipped in the bisect state.
  - `weak`: do not mark the commit good or bad. The selector should avoid returning the same commit
    again unless no untested candidate can move the range.

BCO projects an exhausted step (oq-005; not produced under the current no-retry default) as
`selector_mark: "skip"`.

If a `selector_mark` contradicts the supplied boundaries (for example a commit marked `bad` that is
an ancestor of `good`, or conflicting marks for one commit), the selector returns `invalid_request`.

## Plain Bisect Selection Rules

The selector reconstructs the Git bisect state from the boundaries and `decision_history`, then asks
Git for the next bisect candidate in the configured `history_view`. It returns at most one candidate,
or a terminal result, as defined in [commit-selection-result](commit-selection-result.md).
