---
stream: "BCO"
topic: "Toolchain catalog"
priority: medium
publish: false
---

# Use configured toolchain admission rules

## Description

Minimal admission uses a hardcoded toolchain list. Replace it with the catalog provider, identity
fields, matching rule, and admission error chosen by the toolchain design task. Do not assume that
name and version are the complete identity unless that task says so. If the design places
validation outside BCO, rewrite this task to match before implementation.

## Contribution

- Delivers: Requests using a toolchain the deployment cannot provide are rejected before campaign creation

## Acceptance criteria

- [ ] BCO loads toolchain admission rules from the provider chosen by the design task.
- [ ] A request with one configured toolchain identity passes the toolchain check.
- [ ] A missing identity field or unsupported identity returns the error chosen by the design task.
- [ ] A rejected toolchain creates no campaign state and starts no downstream work.
- [ ] The hardcoded MVP toolchain list is no longer used.

## Sources

- [CR](../../../docs/contracts/campaign-request.md)
- [Toolchain admission design](../design-and-docs/define-how-admission-validates-toolchains.md)
