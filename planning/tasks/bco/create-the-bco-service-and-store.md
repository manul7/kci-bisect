---
stream: "BCO"
topic: "Service foundation"
priority: high
publish: false
---

# Create the BCO service, store, and REST API

## Description

BCO must run as its own service, expose its REST API, and own an isolated durable store before campaign
records and workflows are implemented.

## Contribution

- Delivers: BCO REST service bootstrap, isolated store initialization, and startup/isolation tests

## Acceptance criteria

- [ ] A fresh service starts with the defined BCO REST routes and an empty BCO store.
- [ ] The REST API can read and write the initialized BCO store.
- [ ] BCO cannot read or write the BTO store.

## Sources

- [Architecture](../../../docs/architecture.md)
- [BCO design](../../../docs/components/bco.md)
- [State store design](../../../docs/components/state-store.md)
