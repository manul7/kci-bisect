# Binary Decision Strategy Contract

**Status:** DRAFT

**Version:** 1

This contract defines the Decision engine strategy that maps an
[observation set](observation-contract.md) to a step decision for discrete regression types
(`build`, `boot`, `config`, `unit_test`).

It is the stage 2 evaluator for these types and runs after the universal qualification gate in
[decision-contract](decision-contract.md): a candidate that did not reach a testable state is
already `skip` before this strategy sees it.

## Strategy Type

The campaign execution profile selects this evaluator for discrete regression types. The profile
stores the strategy as the string `binary`; the Decision request carries the object form:

```json
{
  "type": "binary"
}
```

Parameters are optional. The CR does not carry a decision strategy; the campaign execution profile
resolves it by regression type.

## Required Inputs

The Decision engine request must contain:

- a discrete `regression_type` (`build`, `boot`, `config`, or `unit_test`);
- `observation_set` conforming to [observation-contract](observation-contract.md);
- `expected_signal` from the campaign request, shaped as `{type, signature}`;
- `decision_strategy.type: "binary"`;
- campaign `scope` relevant to the decision.

## Decision Mapping

On a qualified observation set the strategy returns one decision. The `good`/`bad`/`skip`/`weak`
`decision_details` shapes live in [decision-contract](decision-contract.md); this strategy sets
`strategy: "binary"` and adds the binary rule:

- `bad`: the observation set shows the expected regression (`matched_expected_signal: true`).
- `good`: it shows the expected regression did not occur (`matched_expected_signal: false`).
- `weak`: the result is usable but gives no clean `good` or `bad` — conflicting observations, a
  failure other than the expected one, or flaky results across repetitions.
- `skip`: the set cannot support a `good` or `bad` decision, with a baseline `skip_reason` from
  [decision-contract](decision-contract.md) — `missing_required_observation` when the observation
  needed to decide is absent, `unsupported_observation`, or `strategy_not_applicable` when the
  evidence shape or `regression_type` is incompatible with `binary`. A `parse_error` set has no
  `qualification` observation and maps directly to `skip` (`parse_error`) — the exception to the
  qualified-only rule defined in [decision-contract](decision-contract.md). A candidate that never
  reached a testable state is already `skip` from the stage 1 gate.

Beyond the common `uncertainty_reason` values in [decision-contract](decision-contract.md), this
strategy adds `unexpected_failure` and `flaky_result`.

## Rationale Requirements

Decision rationale references the supporting observation IDs, the matched or expected signature,
and the `weak` or `skip` reason when applicable.

## Compatibility Rules

- The strategy references observation IDs from the input set, not raw logs or excerpts.
- Known culprit or fix metadata must not affect the decision.
