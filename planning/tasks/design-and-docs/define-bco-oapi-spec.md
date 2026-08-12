---
stream: "Design&Docs"
topic: "BCO REST API"
priority: high
publish: false
---

# Define BCO OpenAPI spec

## Description

BCO needs an OpenAPI spec before its REST service is implemented.

## Contribution

- Delivers: OpenAPI operations for CR submission and campaign reads

## Acceptance criteria

- [ ] Define methods, paths, request bodies, responses, and errors for CR submission.
- [ ] Define methods, paths, responses, and errors for campaign reads.
- [ ] Define timeouts and response codes.
- [ ] Name the OpenAPI document's path in the repository.
- [ ] Validate the OpenAPI document.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [CR](../../../docs/contracts/campaign-request.md)
- [BCO output](../../../docs/contracts/bco-output.md)
