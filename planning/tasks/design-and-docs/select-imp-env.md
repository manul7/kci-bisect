---
stream: "Design&Docs"
topic: "Dev env"
priority: high
publish: false
---

# Select the dev env

## Description

Select the dev env that all project services and tests will use.
Record the decision in `docs/imp-env.md` before implementation starts.
We can take KernelCI as a reference for the dev env, but we should not be constrained by it.

## Contribution

- Delivers: Approved runtime and dev toolchain in `docs/imp-env.md`

## Acceptance criteria

- [ ] The document names the primary programming language and supported version.
- [ ] The document names the API framework.
- [ ] The document defines initial dependency and packaging tools.
- [ ] The document defines formatting, linting, type-checking, and test tools.
- [ ] The document defines how a developer runs the project locally.

## Sources

- [Architecture](../../../docs/architecture.md)
- [Components](../../../docs/components.md)
