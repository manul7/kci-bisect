---
stream: "BTO"
topic: "Service auth"
priority: high
publish: false
---

# Authenticate BCO calls to BTO

## Description

Use the service-auth design for BCO plan submission and result lookup calls. BCO sends the selected
credential, and BTO checks it before returning or changing plan state. Authentication for BTO calls
to planner, builder, and tester roles is not part of this task.

## Contribution

- Delivers: Only authenticated BCO callers can submit or read BTO plans

## Acceptance criteria

- [ ] BCO sends the credential defined by the service-auth design on plan submission and result
      lookup calls.
- [ ] BTO accepts that credential on both operations.
- [ ] BTO rejects a missing, invalid, or unauthorized credential on both operations.
- [ ] A rejected submission creates no plan, and a rejected lookup returns no plan details.
- [ ] Responses and logs omit credential values.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BTO design](../../../docs/components/bto.md)
- [Service-auth design](../design-and-docs/define-service-authentication.md)
