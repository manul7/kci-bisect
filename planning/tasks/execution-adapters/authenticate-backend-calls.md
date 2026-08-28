---
stream: "Execution adapters"
topic: "Service auth"
priority: medium
publish: false
---

# Authenticate BTO calls to the execution backend

## Description

The service-auth design covers BTO calls to configured planner, builder, and tester instances, but
no task attaches those credentials. Use the design's credential references on every backend call
made for a plan.

## Contribution

- Delivers: Backend calls carry the credentials the service-auth design defines

## Acceptance criteria

- [ ] Each planner, builder, and tester call carries the credential the service-auth design defines
      for that instance.
- [ ] A missing or invalid configured credential fails the plan without starting backend work.
- [ ] Plans, results, and logs omit credential values.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Execution composition](../../../docs/contracts/execution-composition.md)
- [Service-auth design](../design-and-docs/define-service-authentication.md)
