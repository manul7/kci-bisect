# ADR-0009: Two-stage step decision — qualification then evaluation

## Status

Accepted — 2026-06-15

## Context

A bisection step turns one terminal plan result into a step decision. Candidates frequently do
not reach a state where the target regression can be evaluated: the kernel does not build, does
not boot, the test harness does not start, or the workload crashes before producing a
measurement, etc. These outcomes occur in every regression type, including performance, and none
of them are evidence about the target regression.

The earlier model treated the evidence shape as determined by regression type and did not separate
qualification from evaluation strategy. That left no place to represent "the candidate produced
no usable result." A performance step that did not build cannot produce valid performance
evidence, yet the performance path required it, and treating a missing measurement as
"no regression" would send the search in the wrong direction.

The design question is how to separate "is there a usable result to process?" from "does the
usable result show the target regression?".

## Decision

A step decision is a two-stage pipeline.

- Stage 1 - "qualification" - is universal across regression types. It determines whether the
  evidence represents a usable result for the campaign's evidence type. When the candidate did
  not reach a testable state, the step decision is `skip`, with a reason, for every regression type.
- Stage 2 - "evaluation" - runs only on a qualified result. It applies the named decision
  strategy to map the result to `good`, `bad`, or `weak` — or to `skip` when the qualified
  result's evidence cannot be used.

`decision_strategy` names the stage 2 evaluator. It is resolved from the campaign execution
profile by regression type and is not carried in the campaign request.

Results Analyzer emits evidence based on qualification:

- an observation set when the candidate did not produce the needed result;
- performance evidence when a performance candidate produced a usable measurement.

## Consequences

- `skip` (no usable result, stage 1) stays distinct from `weak` (usable but noisy, partial, or
  ambiguous, stage 2).
- A performance results-analyzer request may return an observation set instead of performance
  evidence when the candidate is unqualified.
- The binary and performance strategies are documented as stage 2 evaluators behind one shared
  qualification gate.
- A `parse_error` observation set has no qualification observation; the strategy maps it directly to
  `skip` (`parse_error`), outside the gate.
- Each decision request still carries exactly one evidence record.
- Evidence shape is no longer one-to-one with regression type; qualification is shared and the
  stage 2 evaluator is selected per regression type.
- The `qualification` observation is produced by Results Analyzer, not BTO. Qualification is relative
  to the campaign's regression type — a build failure is unqualified for `boot`, `unit_test`, and
  `performance`, but is the qualified result for `build` — and BTO must stay mechanical and
  regression-type-agnostic. BTO supplies the mechanical inputs; RA
  interprets them into the regression-type-relative qualification observation.
