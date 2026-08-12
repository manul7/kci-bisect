---
stream: "Design&Docs"
topic: "Source scope"
priority: medium
publish: false
---

# Document the source-repository scope

## Description

The MVP bisects publicly readable open-source Linux kernel repositories, but no design document
states that boundary. Without it, repository access can look like an unfinished auth design.

## Contribution

- Delivers: A recorded public-repository scope statement in the architecture

## Acceptance criteria

- [ ] The architecture states that the MVP bisects publicly readable open-source Linux kernel Git
      repositories.
- [ ] It states that repository credential management and repository-level authorization are out
      of scope, and that a private deployment may use a non-public repository only when its
      environment already provides read access.

## Sources

- [Architecture](../../../docs/architecture.md)
- [Commit selector design](../../../docs/components/commit-selector.md)
