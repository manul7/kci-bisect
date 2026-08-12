---
stream: "Design&Docs"
topic: "BTO result lookup"
priority: high
publish: false
---

# Define BTO result lookup behavior

## Description

BCO asks BTO for a plan result after submission. The proposal does not define what BTO returns before the
result exists or for an unrecognized plan ID.

## Contribution

- Delivers: Defined BTO lookup responses and BCO handling

## Acceptance criteria

- [ ] Define what BTO returns when a known plan has no final result.
- [ ] Define what BTO returns when a known plan has a final result.
- [ ] Define what BTO returns when the plan ID is unknown.
- [ ] Define how BCO handles each result.
- [ ] Decide how BCO learns that a plan finished in the MVP: polling only, or the terminal-state
      notification with polling fallback, and record the replay rule for a repeated notification.
- [ ] Add the lookup operation to the BTO OpenAPI spec.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Build-test plan result](../../../docs/contracts/build-test-plan-result.md)
