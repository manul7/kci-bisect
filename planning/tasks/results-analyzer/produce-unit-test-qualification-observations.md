---
stream: "Results Analyzer"
topic: "Qualification"
priority: high
publish: false
---

# Produce unit-test qualification observations

## Description

A candidate that does not build, boot, or run the requested test cannot show the expected unit-test
failure. Results Analyzer must record that distinction. The analyzer handler adds the single
qualification observation this task produces to the final observation set.

## Contribution

- Delivers: Structured evidence of whether the requested test ran successfully

## Acceptance criteria

- [ ] A test that ran gets reached=true.
- [ ] not_built, not_booted, did_not_run, and crashed cases get the qualification observation stage
      and reason.
- [ ] A parse_error remains separate.

## Sources

- [Results Analyzer design](../../../docs/components/results-analyzer.md)
- [Observation contract](../../../docs/contracts/observation-contract.md)
- [ADR-0009](../../../docs/adr/0009-two-stage-step-decision.md)
