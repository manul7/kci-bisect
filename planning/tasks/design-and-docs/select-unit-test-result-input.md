---
stream: "Design&Docs"
topic: "Unit-test results"
priority: high
publish: false
---

# Select unit-test result input

## Description

Results Analyzer needs a defined BTO output to decide whether the expected unit-test failure signature
appeared. The proposal does not select that input.

## Contribution

- Delivers: Defined BTO output used for unit-test observation

## Acceptance criteria

- [ ] Select one artifact_refs or raw_output_refs entry.
- [ ] Define the selected input's format.
- [ ] Define how Results Analyzer identifies the test suite, test case, and signature.
- [ ] Define how the plan request asks for this output so every unit-test attempt returns it.
- [ ] Define errors for missing or unsupported input.

## Sources

- [Build-test plan result](../../../docs/contracts/build-test-plan-result.md)
- [Results Analyzer request](../../../docs/contracts/results-analyzer-request.md)
- [Observation contract](../../../docs/contracts/observation-contract.md)
