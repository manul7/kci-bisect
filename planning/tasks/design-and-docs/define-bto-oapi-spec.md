---
stream: "Design&Docs"
topic: "BTO REST API"
priority: high
publish: false
---

# Define BTO OpenAPI spec

## Description

BTO needs an OpenAPI spec before its REST service is implemented. This spec covers plan
submission; the result-lookup operation is added by the result-lookup design task.

## Contribution

- Delivers: OpenAPI operation for build-test plan submission

## Acceptance criteria

- [ ] Define the method, path, request body, acknowledgement, and errors for plan submission.
- [ ] Define timeouts and response codes.
- [ ] Name the OpenAPI document's path in the repository.
- [ ] Validate the OpenAPI document.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Build-test plan request](../../../docs/contracts/build-test-plan-request.md)
