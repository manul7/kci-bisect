---
stream: "Design&Docs"
topic: "Campaign access"
priority: high
publish: false
---

# Define who can access a campaign

## Description

Triggers can create or join a campaign, but campaign reads and cancellation need access rules.

## Contribution

- Delivers: Defined authorization for campaign reads and cancellation

## Acceptance criteria

- [ ] Triggers attached to a campaign can read its BCO output.
- [ ] Define which Triggers may cancel a campaign.
- [ ] Other Triggers receive the same response as an unknown campaign ID.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [CR](../../../docs/contracts/campaign-request.md)
- [BCO output](../../../docs/contracts/bco-output.md)
