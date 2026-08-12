---
stream: "BTO"
topic: "Service foundation"
priority: high
publish: false
---

# Create the BTO service, store, and REST API

## Description

BTO must run as its own service, expose its REST API, and own an isolated durable store before plan records
and execution workflows are implemented.

## Contribution

- Delivers: BTO REST service bootstrap, isolated store initialization, and startup/isolation tests

## Acceptance criteria

- [ ] A fresh service starts with the defined BTO REST routes and an empty BTO store.
- [ ] The REST API can read and write the initialized BTO store.
- [ ] BTO cannot read or write the BCO store.

## Sources

- [Architecture](../../../docs/architecture.md)
- [BTO design](../../../docs/components/bto.md)
- [ADR-0002](../../../docs/adr/0002-separate-bco-and-bto.md)
