# ADR-0004: Use Results Analyzer as the evidence boundary

## Status

Accepted — 2026-05-18

## Context

Build and test execution may produce raw logs, raw measurements, pre-analyzed performance records,
or a mix of those. The Decision engine needs stable, implementation-neutral evidence shapes.

The design question is whether to expose source-specific output details directly to the Decision
engine, split evidence adaptation into a separate component, or make Results Analyzer the single
evidence boundary.

## Decision

Results Analyzer is the single interface between plan output and the Decision engine.

Results Analyzer emits the normalized evidence consumed by the Decision engine. Aggregation,
statistical significance, consistency, power, and effect-size computation are internal to Results
Analyzer or its wrapped implementation.

## Consequences

- Decision engine consumes stable evidence contracts and does not parse raw source output.
- No additional adapter component exists between Results Analyzer and Decision engine.
- Performance evidence exposes the normalized summary needed by the Decision engine.
- Analyzer-native records may be referenced for audit, but their internal fields are not part of
  the decision contract.
