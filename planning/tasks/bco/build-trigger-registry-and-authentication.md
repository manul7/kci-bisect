---
stream: "BCO"
topic: "Trigger registry"
priority: high
publish: false
---

# Authenticate Triggers and load execution settings

## Description

BCO must identify the caller and load its Trigger settings before checking a campaign request. This
is authentication for campaign admission. It does not manage access to source repositories, and
credentials do not belong in the campaign request.

## Contribution

- Delivers: Authenticated Trigger identity and execution settings available to campaign admission

## Acceptance criteria

- [ ] The Trigger registry stores and loads one record containing a Trigger identity, its credential
      reference, and its execution settings.
- [ ] A valid admission credential resolves to that Trigger and its settings.
- [ ] A missing, invalid, or unknown credential is rejected before campaign state is created.
- [ ] Campaign requests, responses, and logs omit credential values.

## Sources

- [Components: Trigger registry](../../../docs/components.md)
- [State store design](../../../docs/components/state-store.md)
- [Service-auth design](../design-and-docs/define-service-authentication.md)
