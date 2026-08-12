---
stream: "Results Analyzer"
topic: "Binary evidence"
priority: high
publish: false
---

# Produce unit-test observations

## Description

The binary strategy needs a structured observation showing whether the expected unit-test failure
signature appeared. The analyzer handler assembles these observations into the final
observation set.

## Contribution

- Delivers: Structured evidence of the expected unit-test failure signature

## Acceptance criteria

- [ ] A matched signature and an absent signature each produce a target observation.
- [ ] Conflicting results produce the observations the binary strategy needs to decide weak.
- [ ] An unparseable input produces a parse_error set.
- [ ] Each observation identifies the test suite and test case and points to its source.

## Sources

- [Results Analyzer design](../../../docs/components/results-analyzer.md)
- [Observation contract](../../../docs/contracts/observation-contract.md)
