---
stream: "Decision engine"
topic: "Binary strategy"
priority: high
publish: false
---

# Implement unit-test decisions

## Description

A qualified unit-test observation must become the step decision used by BCO and Commit selector.

## Contribution

- Delivers: Binary unit-test decisions for BCO and Commit selector

## Acceptance criteria

- [ ] A matched expected signal returns bad.
- [ ] An absent signal returns good.
- [ ] Conflicts and unexpected failures return weak.
- [ ] Missing or unsupported observations and parse_error return skip.
- [ ] Replay returns the same result.

## Sources

- [Decision engine design](../../../docs/components/decision-engine.md)
- [Binary decision strategy](../../../docs/contracts/binary-decision-strategy.md)
