---
stream: "Contracts"
topic: "Binary decisions"
priority: high
publish: false
---

# Check unit-test decision rules

## Description

This task checks the unit-test evidence cases listed below and their `good`, `bad`, `skip`, or `weak`
results. The separate Decision engine rules task checks the common request and result fields and
makes sure their IDs match.

## Contribution

- Delivers: Listed unit-test evidence cases return their defined `good`, `bad`, `skip`, or `weak` decision

## Acceptance criteria

- [ ] When `qualification.reached` is true and the error-signature observation matches the requested
      signature, Decision engine returns `bad` with `matched_expected_signal: true`.
- [ ] When `qualification.reached` is true and the error-signature observation says the requested
      signature is absent, Decision engine returns `good` with `matched_expected_signal: false`.
- [ ] Conflicting observations return `weak` with `uncertainty_reason: conflicting_observations`; an
      unexpected failure uses `unexpected_failure`; a flaky result uses `flaky_result`.
- [ ] When `qualification.reached` is false, Decision engine returns `skip`. It copies `not_built`,
      `not_booted`, `did_not_run`, or `crashed` from the qualification observation into `skip_reason`.
- [ ] A parse error returns `skip_reason: parse_error`; a missing required observation returns
      `missing_required_observation`; an unsupported observation returns `unsupported_observation`;
      an incompatible evidence shape or regression type returns `strategy_not_applicable`.
- [ ] Every result sets `decision_details.strategy: binary` when the binary rules run and cites
      only observation IDs present in the request.

## Sources

- [Decision contract](../../../docs/contracts/decision-contract.md)
- [Binary decision strategy](../../../docs/contracts/binary-decision-strategy.md)
