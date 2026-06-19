# Results Analyzer Design

**Status:** DRAFT
**Version:** 1

The Results Analyzer converts terminal plan output into normalized evidence consumed by the Decision
engine.

## Role

The Results Analyzer hides output-source variability from the Decision engine. It accepts the
output references from a completed build-test plan and emits one evidence contract per step,
selected by the campaign's regression type and the candidate's qualification.

## Boundaries

The Results Analyzer does not:

- run build or test work
- select commits
- decide bisection step outcomes
- schedule retries or repetitions
- promote campaign outcomes
- own campaign lifecycle state

## Inputs

Primary input is a [results analyzer request](../contracts/results-analyzer-request.md) from BCO.

The request references terminal plan output, admitted campaign context, expected signal, step
context, and analyzer configuration. For performance campaigns the expected signal carries the
trigger-supplied `baseline_value`, and the request also carries the admitted good boundary.

## Outputs

The Results Analyzer emits normalized evidence for the Decision engine.

Evidence contracts are:

- [observation contract](../contracts/observation-contract.md) for discrete regression types and
  for any unqualified candidate;
- [performance evidence](../contracts/performance-evidence.md) for a qualified performance candidate.

In a non-`parse_error` observation set, the Results Analyzer also produces the stage 1
`qualification` observation defined in [observation contract](../contracts/observation-contract.md):
it determines whether the candidate reached the testable state the campaign needs and maps backend
outcome and raw output to the standard qualification `reason`.

BTO does not produce this observation: qualification is relative to the campaign's regression type,
and BTO stays mechanical and regression-type-agnostic. See
[ADR-0009](../adr/0009-two-stage-step-decision.md).

## Output Variability

Some deployments provide raw logs or measurements. Others provide already analyzed records. The
Results Analyzer owns that variability and exposes a stable evidence shape to the Decision engine.

Analysis internals remain inside the Results Analyzer or its wrapped implementation. The
Decision engine consumes only the evidence contract.

## Idempotency

Analyzing the same request produces equivalent evidence, apart from generated evidence IDs,
timestamps, and producer metadata.

## State

The Results Analyzer does not own campaign state. BCO records analyzer attempts and evidence
references in the BCO State store.
