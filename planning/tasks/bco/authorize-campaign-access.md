---
stream: "BCO"
topic: "Campaign authorization"
priority: medium
publish: false
---

# Authorize campaign access

## Description

After the unauthenticated REST workflow works, BCO must enforce the defined campaign access rules.

## Contribution

- Delivers: Authorized campaign reads and cancellation

## Acceptance criteria

- [ ] Campaign reads enforce the defined access rules.
- [ ] Cancellation enforces the defined access rules.
- [ ] A denied read or cancellation returns the same response as an unknown campaign ID.
- [ ] Rejected access writes no campaign state.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BCO output](../../../docs/contracts/bco-output.md)
- [Trigger registry and authentication](build-trigger-registry-and-authentication.md)
- [Campaign access design](../design-and-docs/define-who-can-access-a-campaign.md)
