---
stream: "Design&Docs"
topic: "Deployment configuration"
priority: high
publish: false
---

# Define the campaign execution profile source

## Description

Admission must check each request against the campaign execution profile. The contract defines the
profile fields, but no document says who provides a profile instance, in what format, or how BCO
loads it.

## Contribution

- Delivers: Defined provider, format, and loading path for the campaign execution profile

## Acceptance criteria

- [ ] Choose the profile provider: a deployment file, the BCO store, or the Trigger registry.
- [ ] Define the profile format, its location, and when BCO loads it.
- [ ] Define what BCO does when the profile is missing or fails contract validation.
- [ ] Write the minimal MVP profile content: the unit-test regression type, the `bisect` policy,
      the minimal composition, and their evidence path and decision strategy.

## Sources

- [Campaign execution profile](../../../docs/contracts/campaign-execution-profile.md)
- [BCO design](../../../docs/components/bco.md)
