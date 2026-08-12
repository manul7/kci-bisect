---
stream: "Design&Docs"
topic: "Execution backend"
priority: high
publish: false
---

# Select the first execution backend

## Description

The proposal lists possible execution systems but selects none. The adapter, the minimal
composition, and the outcome map cannot be built without one concrete target.

## Contribution

- Delivers: A selected first build-test backend with its composition, settings, and outcome map

## Acceptance criteria

- [ ] Select the first combined build-test backend and instance.
- [ ] Define its private request and response and the minimal composition it supports.
- [ ] Define its endpoint and capability settings and its credential reference.
- [ ] Map its native terminal states to the plan-result outcomes.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Execution composition](../../../docs/contracts/execution-composition.md)
- [Build-test plan result](../../../docs/contracts/build-test-plan-result.md)
