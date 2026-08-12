---
stream: "Decision engine"
topic: "Contract and qualification"
priority: high
publish: false
---

# Implement the unit-test qualification check

## Description

A unit-test result is usable only if the candidate built, booted, and ran the requested test. An
earlier failure cannot prove the expected regression. This task dispatches qualified evidence to
an injected fake strategy; the real binary strategy arrives with the unit-test decisions task.

## Contribution

- Delivers: Exclusion of unit-test results that cannot prove the expected regression

## Acceptance criteria

- [ ] Validate request and evidence IDs and require one evidence object.
- [ ] Unqualified unit-test evidence returns skip with its reason.
- [ ] Qualified evidence reaches the binary strategy once.

## Sources

- [Decision engine design](../../../docs/components/decision-engine.md)
- [Decision contract](../../../docs/contracts/decision-contract.md)
- [ADR-0009](../../../docs/adr/0009-two-stage-step-decision.md)
