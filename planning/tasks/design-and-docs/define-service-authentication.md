---
stream: "Design&Docs"
topic: "Credentials and access"
priority: high
publish: false
---

# Define service auth

## Description

BCO must authenticate trigger calls and BCO-to-BTO calls. BTO must authenticate calls to configured planner,
builder, and tester instances. The proposal does not define how.

## Contribution

- Delivers: Defined auth for Trigger, BCO, BTO, and execution calls

## Acceptance criteria

- [ ] Choose the credential source for each caller boundary and record the decision for oq-012.
- [ ] Define how BCO authenticates Triggers and calls BTO, and how BTO authenticates configured instances.
- [ ] Add the selected security schemes to the BCO and BTO OpenAPI specs.
- [ ] CRs, responses, and logs contain no passwords, tokens, or private keys.
- [ ] Remove oq-012 after its decision is recorded in the owning document.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BTO design](../../../docs/components/bto.md)
- [Open questions: oq-012](../../../oq.md)
