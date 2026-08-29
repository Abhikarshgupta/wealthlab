## Summary

<!-- What changed and why -->

## Scenario IDs

<!-- e.g. FD-14, FD-20 — must match tests/TRACEABILITY.md -->

## Test plan

- [ ] `npm test -- --run`
- [ ] `npm run test:gherkin:smoke` (if Gherkin touched)
- [ ] Golden JSON unchanged or CA-reviewed for `@tax` rows

## Layers touched

- [ ] Gherkin (`tests/features/`)
- [ ] Golden (`tests/fixtures/golden/`)
- [ ] Unit (`src/__unit__/`)
- [ ] Integration (`src/__integration__/`)
- [ ] Production code (I2 only)
