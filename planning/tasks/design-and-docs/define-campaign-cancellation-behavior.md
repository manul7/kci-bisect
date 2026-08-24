---
stream: "Design&Docs"
topic: "Campaign cancellation"
priority: high
publish: false
---

# Define campaign cancellation behavior

## Description

Cancellation is not defined by the campaign lifecycle or BCO output contracts. Its behavior must be
defined before implementation without adding new campaign or step statuses.

## Contribution

- Delivers: Defined cancellation behavior using the existing campaign and step statuses

## Acceptance criteria

- [ ] Define how cancellation maps to existing campaign status, outcome, or failure fields.
- [ ] Define how BCO handles pending and in-flight work and late results.
- [ ] Define where a late result is kept for audit and how it links to its plan and attempt.
- [ ] Define repeated-request behavior.
- [ ] Update the State store and BCO output documents without adding status values.
- [ ] Add cancellation to the BCO OpenAPI spec before implementation.

## Sources

- [State store design](../../../docs/components/state-store.md)
- [BCO output](../../../docs/contracts/bco-output.md)
