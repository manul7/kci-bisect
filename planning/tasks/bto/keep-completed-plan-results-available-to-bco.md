---
stream: "BTO"
topic: "Results"
priority: high
publish: false
---

# Keep completed plan results available to BCO

## Description

BCO needs the final result after plan execution, so BTO must expose it for lookup by plan ID.

## Contribution

- Delivers: Final BTO plan results available for lookup by BCO

## Acceptance criteria

- [ ] BTO stores one final result per plan.
- [ ] Repeated lookup returns the same result.
- [ ] A finished result cannot be replaced.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Build-test plan result](../../../docs/contracts/build-test-plan-result.md)
- [BTO result lookup design](../design-and-docs/define-bto-result-lookup-behavior.md)
