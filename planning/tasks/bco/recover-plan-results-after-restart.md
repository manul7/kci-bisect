---
stream: "BCO"
topic: "Plan result recovery"
priority: medium
publish: false
---

# Recover plan submissions and results after restart

## Description

After normal result lookup works, BCO must continue an interrupted submission or lookup without
duplicating the plan. Two crash windows matter: after BTO accepts a submission but before BCO
saves the returned `plan_id`, and after the `plan_id` is saved but before the final result is
saved.

## Contribution

- Delivers: Restart-safe recovery of BTO plan submissions and results by BCO

## Acceptance criteria

- [ ] After a restart with a stored `plan_id` and no final result, BCO resumes result lookup.
- [ ] After a restart with recorded submission intent and no stored `plan_id`, BCO repeats the
      submission with the stored idempotency key and saves the returned `plan_id`.
- [ ] Recovery creates no second plan or execution and no duplicate evidence or decision records.

## Sources

- [BCO design](../../../docs/components/bco.md)
- [BTO design](../../../docs/components/bto.md)
- [State store design](../../../docs/components/state-store.md)
- [Build-test plan request](../../../docs/contracts/build-test-plan-request.md)
