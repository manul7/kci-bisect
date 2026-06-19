# ADR-0005: Keep performance baseline and metric direction trigger-supplied

## Status

Accepted — 2026-05-18

## Context

Performance bisection needs a metric direction and a baseline value for comparing candidate
measurements. The trigger detects the regression before bisection starts and has the external
context needed to classify the metric.

The design question is whether the bisection system should own a metric registry or measure
baseline boundaries itself.

## Decision

The trigger supplies both:

- metric direction, sourced from an external metric registry;
- baseline value, measured at the good boundary before campaign admission.

The bisection system has no metric registry of its own and does not run a baseline measurement
phase.

## Consequences

- Campaign admission rejects incomplete performance requests instead of trying to infer metric
  context.
- Results Analyzer uses the trigger-supplied baseline value for per-step comparison.
- Decision engine checks evidence against the request's metric direction and baseline value.
- Boundary measurement and metric registry ownership remain outside the bisection system.
