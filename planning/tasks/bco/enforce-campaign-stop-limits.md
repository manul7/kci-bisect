---
stream: "BCO"
topic: "Resource limits"
priority: medium
publish: false
---

# Enforce campaign stop limits

## Description

When a configured campaign limit is reached, BCO must stop new work and record the result chosen by
that limit's policy.

## Contribution

- Delivers: Consistent campaign completion when a configured limit is reached

## Acceptance criteria

- [ ] Automated tests cover every limit listed by the campaign stop-limit design.
- [ ] Work below a limit continues, and the event defined as reaching the limit stops later plan
      submissions.
- [ ] BCO applies a reached limit once and handles in-flight work as the design defines.
- [ ] BCO records the campaign failure or normal conclusion mapped to that limit.
- [ ] Campaign status shows the recorded terminal result.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BCO output](../../../docs/contracts/bco-output.md)
- [Campaign stop-limit design](../design-and-docs/define-campaign-stop-limits.md)
