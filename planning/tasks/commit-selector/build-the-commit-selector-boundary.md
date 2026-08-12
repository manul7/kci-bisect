---
stream: "Commit selector"
topic: "Contract boundary"
priority: high
publish: false
---

# Build the Commit selector boundary

## Description

BCO supplies current boundaries and decision history. Commit selector must return one contract
result without reading or changing campaign state. This task implements contract checks and
dispatch with an injected deterministic fake; the real selection policy arrives with the
standard-bisect task.

## Contribution

- Delivers: A stateless Commit selector service boundary for BCO

## Acceptance criteria

- [ ] A valid request returns selected, converged, or blocked.
- [ ] Invalid input returns invalid_request with field errors.
- [ ] Replaying the same request returns the same result.

## Sources

- [Commit selector design](../../../docs/components/commit-selector.md)
- [Commit selection request](../../../docs/contracts/commit-selection-request.md)
- [Commit selection result](../../../docs/contracts/commit-selection-result.md)
