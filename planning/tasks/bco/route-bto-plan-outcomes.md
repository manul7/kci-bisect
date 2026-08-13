---
stream: "BCO"
topic: "Executor"
priority: high
publish: false
---

# Route BTO plan outcomes

## Description

BTO can return `content_result`, `infrastructure_failure`, or `invalid_request`. BCO must send only
`content_result` to Results Analyzer. This task implements the outcome-kind and correlation checks
routing needs; the remaining negative cases belong to the contract-check tasks.

## Contribution

- Delivers: Correct routing of BTO outcomes into analysis or campaign failure

## Acceptance criteria

- [ ] A `content_result` creates one Results Analyzer request.
- [ ] An `infrastructure_failure` creates no evidence or step decision.
- [ ] An `invalid_request` creates no evidence or step decision.
- [ ] Both failure outcomes fail the campaign under the current no-automatic-retry default.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [Build-test plan result](../../../docs/contracts/build-test-plan-result.md)
