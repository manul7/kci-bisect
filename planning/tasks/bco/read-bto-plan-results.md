---
stream: "BCO"
topic: "Plan result lookup"
priority: high
publish: false
---

# Read BTO plan results

## Description

BCO reads the result by plan ID after submitting a BTO plan.

## Contribution

- Delivers: One BTO plan result stored against its step attempt

## Acceptance criteria

- [ ] BCO stores the final result against its attempt exactly once.
- [ ] BCO handles a not-yet-final result as the lookup behavior defines.
- [ ] BCO handles an unknown plan ID as the lookup behavior defines.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BTO design](../../../docs/components/bto.md)
- [Build-test plan result](../../../docs/contracts/build-test-plan-result.md)
- [BTO result lookup design](../design-and-docs/define-bto-result-lookup-behavior.md)
