---
stream: "BCO"
topic: "Admission"
priority: high
publish: false
---

# Check requests against deployment capabilities

## Description

The minimal CR admission checks cover the listed unit-test request fields. Before creating or
joining a campaign, BCO
must also resolve the composition and check the request against the campaign execution profile and
the authenticated Trigger settings. Toolchain catalog checks remain in their separate task.

## Contribution

- Delivers: Requests outside deployment capabilities are rejected before campaign creation

## Acceptance criteria

- [ ] BCO resolves the composition from the request or from the authenticated Trigger or deployment
      default before checking deployment support.
- [ ] Tests reject a regression type, search policy, or resolved composition that the loaded
      campaign execution profile does not support.
- [ ] For an accepted regression type, BCO selects the evidence path and decision strategy from the
      loaded profile rather than from the campaign request.
- [ ] Tests reject a resolved composition that the authenticated Trigger cannot use.
- [ ] Each rejection uses the Campaign Request `Admission Rejection` response.
- [ ] Each rejection creates no campaign, membership, or step state and starts no downstream work.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [CR](../../../docs/contracts/campaign-request.md)
- [Campaign execution profile](../../../docs/contracts/campaign-execution-profile.md)
- [Trigger registry and authentication](build-trigger-registry-and-authentication.md)
- [Loaded execution profile](load-the-campaign-execution-profile.md)
