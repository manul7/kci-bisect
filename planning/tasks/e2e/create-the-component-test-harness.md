---
stream: "E2E"
topic: "Harness"
priority: high
publish: false
---

# Create the component test harness

## Description

Component boundaries need repeatable integration tests. Isolated mocks hide incompatible contracts and
state ownership violations.

## Contribution

- Delivers: Repeatable component integration tests with controlled dependencies

## Acceptance criteria

- [ ] The harness runs BCO, BTO, Commit selector, Results Analyzer, and Decision engine.
- [ ] The harness uses controlled dependencies and resets both stores.
- [ ] The harness captures exchanged contracts.
- [ ] One command runs the harness locally and in CI with the same controlled dependencies.

## Sources

- [Architecture](../../../docs/architecture.md)
- [Components](../../../docs/components.md)
