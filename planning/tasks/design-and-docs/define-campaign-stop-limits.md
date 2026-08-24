---
stream: "Design&Docs"
topic: "Resource limits"
priority: medium
publish: false
---

# Define campaign stop limits

## Description

BCO must know when campaign policy stops further work. The proposal says every limit chooses failure or a
normal conclusion but does not define the supported limits.

## Contribution

- Delivers: Defined campaign limits and their completion outcomes

## Acceptance criteria

- [ ] List the limits supported by this implementation and each limit's configuration source.
- [ ] Define each limit's value, when it starts counting, and the exact event that counts toward it.
- [ ] Define what happens to in-flight work when a limit is reached.
- [ ] Define whether reaching each limit fails the campaign or produces a normal conclusion.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [Open questions: oq-006](../../../oq.md)
