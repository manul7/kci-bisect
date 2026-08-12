---
stream: "Results Analyzer"
topic: "Contract boundary"
priority: high
publish: false
---

# Implement the Results Analyzer contract

## Description

Results Analyzer is the only boundary between plan output and Decision engine evidence, so Decision
engine must never read backend-specific data. This task implements contract checks and dispatch
with injected fakes; real parsing arrives with the unit-test observation tasks. The
analyzer handler owns the final observation set: it combines the producers' target and
qualification observations, assigns observation IDs, and returns one set per request.

## Contribution

- Delivers: A backend-independent boundary from plan output to decision evidence

## Acceptance criteria

- [ ] Accept only content_result plan results.
- [ ] Validate campaign, step, attempt, scope, and expected signal.
- [ ] Emit exactly one documented evidence contract.
- [ ] Return one observation set per request that satisfies the contract's set rules.

## Sources

- [Results Analyzer design](../../../docs/components/results-analyzer.md)
- [Results Analyzer request](../../../docs/contracts/results-analyzer-request.md)
- [Observation contract](../../../docs/contracts/observation-contract.md)
