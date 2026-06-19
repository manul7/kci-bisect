# Execution Composition Contract

**Status:** DRAFT

**Version:** 1

This contract defines deployment-owned runtime configuration that maps one composition name to the
BTO role instances used for plan execution.

The composition definition is deployment configuration, not a trigger input, and it does not change
the BCO-facing plan request or final build-test plan result shape.

## Shape

```json
{
  "contract_version": "execution-composition/v1",
  "composition": "COMPOSITION_NAME",
  "roles": {
    "planner": "PLANNER_INSTANCE_ID",
    "builder": "BUILDER_INSTANCE_ID",
    "tester": "TESTER_INSTANCE_ID"
  },
  "artifact_handoff": {
    "mode": "ARTIFACT_HANDOFF_MODE"
  }
}
```

- `contract_version`: must be `execution-composition/v1`.
- `composition`: stable name referenced by campaign requests and execution profiles.
- `roles`: the instance selected for each logical role (`planner`, `builder`, `tester`). The roles
  are logical: one instance may fill one, two, or all three. How BTO calls the resolved instances
  is BTO-internal.
- `artifact_handoff`: optional. Present only for split-role compositions where builder and tester
  are separate instances that do not share produced artifacts internally; omitted otherwise. `mode`
  selects the handoff mechanism; its values are BTO-internal.

## Internal Detail

How BTO resolves a composition to runtime calls is BTO-internal; ADR-0008 records the resolution
model. A later contract may define a specific piece if one is needed.

## Boundaries

The composition contract does not define transport, endpoint URLs, credentials, secret storage, or
backend-specific request payloads. Those are deployment configuration details.
