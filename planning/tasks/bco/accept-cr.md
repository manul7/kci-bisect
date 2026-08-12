---
stream: "BCO"
topic: "Minimal admission"
priority: high
publish: false
---

# Accept a CR

## Description

Before admission is hardened, BCO must accept and store one valid unit-test CR. The hardcoded
toolchain list is a temporary test-only value shared with the E2E fixture.

Further task(s) will replaces it with the configured catalog.

## Contribution

- Delivers: A stored campaign and `campaign_ref` from the BCO REST API

## Acceptance criteria

- [ ] Accept a valid unit-test CR through the BCO REST API.
- [ ] Accept toolchains from an implementation-owned hardcoded list.
- [ ] Store the request and return its `campaign_ref`.
- [ ] Reject a malformed request without creating campaign state.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [CR](../../../docs/contracts/campaign-request.md)
