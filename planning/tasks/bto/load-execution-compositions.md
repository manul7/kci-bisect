---
stream: "BTO"
topic: "Execution composition"
priority: high
publish: false
---

# Load execution compositions

## Description

A composition name has no effect until BTO maps planner, builder, and tester roles to configured instances.

## Contribution

- Delivers: Configured planner, builder, and tester roles for a composition

## Acceptance criteria

- [ ] BTO loads composition configuration.
- [ ] BTO resolves known composition names and role mappings.
- [ ] BTO rejects missing, invalid, or unknown compositions before calling a backend.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Execution composition](../../../docs/contracts/execution-composition.md)
- [ADR-0008](../../../docs/adr/0008-runtime-bto-execution-composition.md)
