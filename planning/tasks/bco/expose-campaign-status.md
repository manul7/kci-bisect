---
stream: "BCO"
topic: "Query API"
priority: high
publish: false
---

# Expose campaign status

## Description

Triggers that create or join a campaign need its progress and result without direct access to BCO storage.

## Contribution

- Delivers: Campaign progress and final BCO output through the REST API

## Acceptance criteria

- [ ] A known campaign ID returns its BCO output.
- [ ] An unknown campaign ID returns the defined error.
- [ ] Reads write no state.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BCO output](../../../docs/contracts/bco-output.md)
- [BCO OpenAPI spec](../design-and-docs/define-bco-oapi-spec.md)
