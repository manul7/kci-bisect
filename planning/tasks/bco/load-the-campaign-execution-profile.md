---
stream: "BCO"
topic: "Deployment configuration"
priority: high
publish: false
---

# Load the campaign execution profile

## Description

Admission capability checks read the campaign execution profile, but no task creates or loads a
profile instance. Implement the provider chosen by the profile design task and make the loaded
profile available to admission.

## Contribution

- Delivers: A loaded, validated campaign execution profile available to BCO admission

## Acceptance criteria

- [ ] BCO loads the profile from the provider chosen by the design task.
- [ ] A profile that fails contract validation, including an empty required capability array, is
      rejected and reported as the design task defines.
- [ ] Admission can read the loaded profile's supported types, policies, compositions, evidence
      paths, and decision strategies.
- [ ] The deployment ships the minimal MVP profile defined by the design task.

## Sources

- [Campaign execution profile](../../../docs/contracts/campaign-execution-profile.md)
- [BCO design](../../../docs/components/bco.md)
- [Profile source design](../design-and-docs/define-campaign-execution-profile-source.md)
