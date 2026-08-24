---
stream: "Design&Docs"
topic: "Toolchain catalog"
priority: medium
publish: false
---

# Define configurable toolchain admission

## Description

Minimal admission uses an implementation-owned toolchain list. The toolchain catalog owner,
identity fields, and admission error are open (oq-025). The owner choice decides whether BCO loads
the rules or validation happens before a request reaches BCO.

## Contribution

- Delivers: Defined configurable toolchain rules for campaign admission

## Acceptance criteria

- [ ] Choose the toolchain catalog provider and decide whether name and version are sufficient identity.
- [ ] Define exact-match rules and the admission error for a missing or unsupported value.
- [ ] State where admission reads the rules, or that the chosen provider validates toolchains
      before requests reach BCO.
- [ ] Record the decision and remove oq-025.

## Sources

- [CR](../../../docs/contracts/campaign-request.md)
- [Campaign execution profile](../../../docs/contracts/campaign-execution-profile.md)
- [Open questions: oq-025](../../../oq.md)
