---
stream: "Commit selector"
topic: "Source history"
priority: high
publish: false
---

# Prepare source history for selection

## Description

Standard bisect needs the requested repository and commit history. Missing or stale references can select a
commit outside the requested range.

## Contribution

- Delivers: A valid, current source-history view for commit selection

## Acceptance criteria

- [ ] Refresh history before selection.
- [ ] Resolve boundaries and decision-history commits.
- [ ] Return named repository, revision, and source-read errors.
- [ ] Support concurrent refresh without corrupting the history view.

## Sources

- [Commit selector design](../../../docs/components/commit-selector.md)
- [Commit selection request](../../../docs/contracts/commit-selection-request.md)
- [Source-repository scope](../design-and-docs/document-source-repository-scope.md)
