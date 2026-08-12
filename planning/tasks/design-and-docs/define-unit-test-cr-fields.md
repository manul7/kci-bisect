---
stream: "Design&Docs"
topic: "Unit-test input"
priority: high
publish: false
---

# Define unit-test CR fields

## Description

The data model requires a test suite and test case, but the CR does not state which fields carry
them. Admission cannot validate unit-test scope without that mapping.

## Contribution

- Delivers: Defined unit-test scope in CRs

## Acceptance criteria

- [ ] Map test suite and test case to CR fields.
- [ ] Define required values and equivalence-key use.
- [ ] Give accepted and rejected examples.

## Sources

- [CR](../../../docs/contracts/campaign-request.md)
- [Bisection data model](../../../docs/bisection-data-model.md)
