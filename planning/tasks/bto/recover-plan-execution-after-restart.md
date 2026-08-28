---
stream: "BTO"
topic: "Execution recovery"
priority: medium
publish: false
---

# Recover plan execution after restart

## Description

After the successful execution path works, BTO must resume interrupted plans without duplicating
backend work. Recovery follows the backend-work recovery design: stable action identities, saved
backend job references, and a replay rule for the window between backend acceptance and the saved
reply.

## Contribution

- Delivers: Restart-safe BTO plan execution

## Acceptance criteria

- [ ] BTO saves intent, the action identity, and the backend job reference around each planner,
      builder, and tester call as the backend-work recovery design defines.
- [ ] Restart resumes the same plan.
- [ ] For a crash between backend acceptance and the saved reply, recovery reuses the accepted
      work as the design defines and creates no replacement backend work.

## Sources

- [BTO design](../../../docs/components/bto.md)
- [Backend-work recovery design](../design-and-docs/define-backend-work-recovery.md)
