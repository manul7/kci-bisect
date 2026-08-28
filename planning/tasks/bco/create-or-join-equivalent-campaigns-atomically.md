---
stream: "BCO"
topic: "Admission"
priority: high
publish: false
---

# Create or join equivalent campaigns atomically

## Description

Two Triggers may submit equivalent CRs at the same time. BCO must create one campaign instead of
starting duplicate build-test work.

## Contribution

- Delivers: One shared campaign for concurrent equivalent requests

## Acceptance criteria

- [ ] Concurrent equivalent requests create one campaign.
- [ ] Each authorized Trigger is attached once.
- [ ] Repeated requests from that Trigger add nothing.
- [ ] Unauthorized requests return no campaign ID and reveal no existing campaign.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [CR](../../../docs/contracts/campaign-request.md)
- [ADR-0007](../../../docs/adr/0007-equivalence-key-and-trigger-membership.md)
