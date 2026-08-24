---
stream: "Design&Docs"
topic: "Execution recovery"
priority: medium
publish: false
---

# Define how BTO avoids duplicate backend work

## Description

BTO can crash after a backend accepts planner, builder, or tester work but before BTO saves the
reply. An intent record alone cannot tell recovery whether to submit again. The design must give
each backend action a stable identity and a replay rule before BTO restart recovery is
implemented.

## Contribution

- Delivers: Defined backend action identity and replay rule for BTO restart recovery

## Acceptance criteria

- [ ] Give each planner, builder, and tester action a stable identity.
- [ ] Choose the replay rule for the crash window: idempotent backend submission by that identity,
      or lookup of the saved backend job reference before retrying.
- [ ] Define where BTO saves the action identity and the backend job reference.
- [ ] Define what recovery does when the backend cannot confirm whether it accepted the work.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Execution composition](../../../docs/contracts/execution-composition.md)
