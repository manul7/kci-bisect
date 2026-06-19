# Commit Selector Design

**Status:** DRAFT
**Version:** 1

The Commit selector owns commit-selection policy. It chooses the next commit or commits to test
from the campaign's source history and the step decisions already recorded by BCO.

## Role

The Commit selector keeps search-policy logic separate from campaign lifecycle and build/test
execution. BCO asks it for the next candidate or a terminal selection result; BCO remains
responsible for running the selected candidates and promoting campaign outcomes.

## Boundaries

The Commit selector does not:

- admit campaigns,
- execute build or test work,
- parse build/test output,
- decide whether evidence is `good`, `bad`, `skip`, or `weak`,
- retry campaign work,
- promote campaign outcomes.

## Inputs

Primary input is a commit-selection request from BCO.

For the current default bisect policy, the request shape is defined by
[commit selection request](../contracts/commit-selection-request.md).
Request shapes for policies beyond standard bisect remain open under oq-011.

## Outputs

The selector returns either candidate commits to test or a terminal selection result.

For the current plain bisect policy, the result shape is defined by
[commit selection result](../contracts/commit-selection-result.md).
Multi-candidate result shape remains open under oq-023.

## Policies

Standard `bisect` is the only policy with a generic selector contract in this draft.
Other declared policies are future/TBD and require explicit request/result contract
definitions before they can be used.

## Source History

The selector needs access to source history, not build checkouts. Each supported policy must define
the history view it uses and how that view affects candidate selection.

It's important to keep in mind that Linux kernel history is often non-linear.

Plain bisect uses `git_bisect_default`, defined in
[commit selection request](../contracts/commit-selection-request.md). History views for other
policies remain open under oq-008.

## State store

The Commit selector does not own campaign lifecycle state.

BCO provides the terminal step outcomes needed for each selection request, and BCO stores the
resulting candidate or terminal selection state in its own state store.
