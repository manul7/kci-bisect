---
stream: "Design&Docs"
topic: "Evidence storage"
priority: high
publish: false
---

# Define evidence storage

## Description

BCO must reload the exact evidence used for a decision, but the proposal only requires stored
evidence references. It does not say whether BCO stores the full evidence object, a reference, or
both, or who owns a referenced payload.

## Contribution

- Delivers: Defined owner and shape of stored decision evidence

## Acceptance criteria

- [ ] Choose what the BCO store keeps: the full evidence object, an immutable reference with the
      IDs and digest needed to verify it, or compact evidence with large artifacts kept externally.
- [ ] Name the owner of any external evidence store.
- [ ] State what the Decision engine input and BCO audit read, consistent with that choice.

## Sources

- [State store design](../../../docs/components/state-store.md)
- [Results Analyzer design](../../../docs/components/results-analyzer.md)
