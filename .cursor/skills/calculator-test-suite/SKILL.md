---
name: calculator-test-suite
description: >-
  Create or extend WealthLab calculator/corpus test suites using the 6-step
  workflow (T1 Define, T2 Gherkin, T3 Unit+Integration specs, I1 Review,
  I2 RGR, I3 Harden). Use when adding tests for a calculator, corpus simulator,
  or parallel multi-task test workstreams.
---

# Calculator Test Suite — 6-Step Workflow

Use this skill for every calculator or surface workstream. Read companion docs first:

- `docs/TESTING_STRATEGY.md` — scenario IDs and breadth
- `docs/TESTING_IMPLEMENTATION_GUIDE.md` — matrix, data sources, constraints
- `docs/TESTING_PARALLEL_TASKS.md` — workstream prompts and progress tracker

## When to use

- User asks to add tests for a calculator (FD, SIP, PPF, etc.)
- User spawns parallel multi-task work for test suite creation
- User says "6-step", "T1", "RGR", or "test workstream"

## The 6 steps (mandatory order)

### Phase A — Spec (tests first; RED is OK)

#### T1 — Define

**Goal:** Business rules and test plan before any `.feature` or test code.

1. Read source of truth for this surface:
   - `src/constants/investmentRates.js`
   - `src/constants/investmentInfo.js`
   - `src/components/calculators/{Name}/*Schema.js`
   - `use{Name}Calculator.js` hook
2. Fill calculator matrix (IMPLEMENTATION_GUIDE §4.1): amount, tenure, rate, tax, instrument-specific.
3. Create Scenario Cards for each ID from TESTING_STRATEGY (prefix e.g. `FD-14`).
4. Plan `tests/fixtures/golden/{instrument}.json` — min 5 rows (2 HP, 2 BD, 1 tax).
5. Append rows to `tests/TRACEABILITY.md` (your prefix section only).

**Deliverables:** Scenario Cards, matrix notes, golden plan, TRACEABILITY rows.  
**Do not:** Write passing tests or fix production code.

#### T2 — Gherkin

**Goal:** Executable human contract.

1. Create `tests/features/calculators/{instrument}.feature` (or corpus/app path).
2. Use Scenario Outlines with `Examples` from golden JSON — not hand-typed divergent numbers.
3. Tag every scenario: `@smoke`, `@regression`, `@tax`, `@edge`, `@known-bug`, `@calculator-{id}`.
4. Shared scenarios `{PREFIX}-01`..`{PREFIX}-15` per TESTING_STRATEGY template.
5. Add instrument-specific scenarios from TESTING_STRATEGY §4.2.

**Deliverables:** `.feature` file; scenarios may fail — expected in Phase A.

#### T3 — Unit + Integration specs

**Goal:** Machine-verifiable tests that load the same golden IDs.

1. Populate `tests/fixtures/golden/{instrument}.json` from T1 plan.
2. Unit: `src/__unit__/` or co-located — test names include ID: `it('{PREFIX}-14: description', ...)`.
3. Integration (if UI/hook): `src/__integration__/calculators/{instrument}.integration.test.jsx` — min 3 cases.
4. Adversarial cases from `tests/fixtures/adversarial/` for utils (null, NaN, boundary±1).
5. Tests must **fail for the right reasons** if prod is wrong — do not fix prod in T3.

**Deliverables:** Golden JSON, unit tests, integration stubs, RED suite runnable via `npm test`.

---

### Phase B — Implementation

#### I1 — Review

**Goal:** Validate spec quality before writing fixes.

1. Run IMPLEMENTATION_GUIDE §8.4 review checklist.
2. Confirm golden `verifiedAgainst` and `tolerance` documented.
3. `@tax` scenarios: confirm regulatory fixture alignment; note CA review status.
4. Resolve review comments; update TRACEABILITY status → `reviewed`.

**Do not:** Skip review to jump to fixes.

#### I2 — Red → Green → Refactor

**Goal:** Make tests pass with minimal production changes.

1. Implement Gherkin step definitions in `tests/step-definitions/`.
2. Fix `utils/`, hooks, components until unit + integration + Gherkin green.
3. **Red:** run tests, confirm failures. **Green:** minimal fix. **Refactor:** only when green.
4. Golden JSON is source of expected values — do not change golden to match wrong code without verification.

**Deliverables:** All tests for this workstream green.

#### I3 — Harden

**Goal:** CI-ready, documented exceptions.

1. Spot-check mutation on touched utils (or note for nightly).
2. Triage `@known-bug`: fix or file GitHub issue with scenario ID.
3. Mark TRACEABILITY rows `done`.
4. Confirm `@smoke` and `@regression` tags pass for this surface.

---

## Constraints (non-negotiable)

| Rule | Detail |
|------|--------|
| Scenario ID | Same ID in Gherkin, unit, integration, golden JSON |
| Golden source | `tests/fixtures/golden/` — not hardcoded divergent expected values |
| Tax | `tests/fixtures/regulatory/` + CA sign-off before I2 merge for `@tax` |
| Minimum pack | 7 Gherkin, 7+ unit, 3 integration, 5 golden rows per calculator |
| Path types | HP, BD, EG, XF, DG — see IMPLEMENTATION_GUIDE §3.1 |
| Parallel work | One prefix per agent; TRACEABILITY append-only per section |
| `@known-bug` | Allowed in spec; must link issue before I3 close |

## File layout per calculator

```
tests/features/calculators/{id}.feature
tests/fixtures/golden/{id}.json
src/__unit__/calculations.{id}.test.js    # or calculations.test.js section
src/__integration__/calculators/{id}.integration.test.jsx
tests/TRACEABILITY.md                     # append {PREFIX} section
```

## Scenario Card template

```markdown
## {PREFIX}-{NN} — {title}
| Field | Value |
| Path type | HP / BD / EG / XF / DG |
| Tags | @smoke @calculator-{id} |
| Why | One sentence |
| Inputs | From golden/{id}.json#{PREFIX}-{NN} |
| Expected | Value ± tolerance |
| Layers | Gherkin / Unit / Integration |
```

## Workstream prompt template

When user provides a workstream (e.g. TASK-W1-FD), execute steps T1→T3 in one session if Phase A only, or full T1→I3 if requested. State current step at start of response.

```
Workstream: {NAME}
Prefix: {PREFIX}
Phase: {T1|T2|T3|I1|I2|I3}
Skill: calculator-test-suite
Stop after: {step} unless user says continue
```

## Anti-patterns

- Writing 450 scenarios without matrix — derive from framework
- Green-washing: changing golden expected values to match buggy code
- Skipping T1 and writing Gherkin from memory
- Fixing prod during T1–T3
- Two agents editing same golden file or TRACEABILITY section

## Reference

Full parallel task list: `docs/TESTING_PARALLEL_TASKS.md`
