---
stream: "BCO"
topic: "Executor"
priority: high
publish: false
---

# Drive the campaign loop

## Description

Each loop transition exists as its own task, but no task starts an accepted campaign and drives it
to a conclusion. BCO must own that loop: request a selection, create the step, submit the plan,
read the result, run analysis, request the decision, apply it, and repeat until a terminal
selector result or a failure ends the campaign.

## Contribution

- Delivers: One BCO loop that takes an accepted campaign to its recorded conclusion

## Acceptance criteria

- [ ] The loop moves an accepted campaign to running and starts its first selection round.
- [ ] Each round sends the Commit selector the current boundaries, the terminal step decisions,
      and the round number assigned by BCO.
- [ ] BCO records the next intended action before each downstream call.
- [ ] A downstream failure that cannot produce a step decision fails the campaign under the
      no-automatic-retry default.
- [ ] The loop repeats rounds until a terminal selector result or a campaign failure produces the
      recorded conclusion.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [State store design](../../../docs/components/state-store.md)
- [Commit selection request](../../../docs/contracts/commit-selection-request.md)
