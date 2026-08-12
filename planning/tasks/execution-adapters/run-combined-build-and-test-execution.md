---
stream: "Execution adapters"
topic: "Combined execution"
priority: high
publish: false
---

# Run combined build and test execution

## Description

A deployment may use one backend for planning, building, and testing. BTO must run that combined execution.

## Contribution

- Delivers: Combined backend build and test execution

## Acceptance criteria

- [ ] One plan creates one backend job.
- [ ] Repeated plan submissions create no second job.
- [ ] Output references and errors are retained.
- [ ] Logs omit credentials.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Execution composition](../../../docs/contracts/execution-composition.md)
- [Runner outcome](../../../docs/contracts/runner-outcome.md)
