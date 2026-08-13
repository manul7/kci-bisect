---
stream: "BCO"
topic: "Executor"
priority: high
publish: false
---

# Run one analysis attempt

## Description

BCO must bind each Results Analyzer request and result to the correct step attempt. This task
implements the ID and evidence-shape checks analysis needs; the remaining negative cases belong to
the contract-check tasks.

## Contribution

- Delivers: One evidence record bound to the step attempt that produced it

## Acceptance criteria

- [ ] Resending the same Results Analyzer request uses the same request and attempt IDs.
- [ ] BCO stores one accepted evidence record.
- [ ] Wrong IDs or contract errors fail the campaign without a decision.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [Results Analyzer request](../../../docs/contracts/results-analyzer-request.md)
