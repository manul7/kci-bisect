# ADR-0001: Keep `skip` and `weak` as distinct step decisions

## Status

Accepted — 2026-05-18

## Context

A bisection step records a decision derived from evidence. `git bisect` defines three values:
`good`, `bad`, `skip`. This design also needs to represent *tested but uncertain* results, which
are common when evidence is noisy, partial, or inconsistent.

The question is whether "untestable at this commit" and "tested but uncertain" share one outcome
(`skip`) or are kept separate (`skip` + `weak`).
The two states drive different follow-ups:

- `skip` advances the search to a different commit,
- `weak` suggests re-testing the same commit before deciding.

## Decision

Use four step decisions: `good`, `bad`, `skip`, `weak`.

`skip` and `weak` are distinct.

## Consequences

- Decision results carry one extra value over `git bisect`.
- Step records must distinguish the two for audit and replay.
- Commit selector and retry policy can handle `skip` and `weak` differently.
- Diverges from `git bisect` vocabulary.
- A retry-then-skip policy can be layered on top later without changing the decision vocabulary.
