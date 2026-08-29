# WealthLab — Parallel Testing Tasks (Multi-Task Playbook)

**Status:** Ready to execute  
**Companion docs:** [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) · [`TESTING_IMPLEMENTATION_GUIDE.md`](./TESTING_IMPLEMENTATION_GUIDE.md)  
**Skill:** [`.cursor/skills/calculator-test-suite/SKILL.md`](../.cursor/skills/calculator-test-suite/SKILL.md)

---

## Does this workflow sound good?

**Yes.** The 6-step split is the right granularity for parallel work:

| Phase | Steps | Outcome |
|-------|-------|---------|
| **Spec (tests first)** | T1 → T2 → T3 | Executable contract before fixing code |
| **Implementation** | I1 → I2 → I3 | Review → RGR → harden |

Each calculator (or surface) is an **independent workstream**. Steps T1–T3 can run without touching prod code. Steps I1–I3 only start after T3 is reviewable.

**One correction from “4 test todos”:** Integration *specs* belong in **T3** (written red/stub). Integration *green* belongs in **I2** with unit + Gherkin. That keeps the 6-step model clean.

---

## The 6-step workflow (every workstream)

Copy this checklist into every multi-task prompt.

### Phase A — Spec (no prod fixes unless blocking)

| Step | ID | Name | Deliverables | Done when |
|------|-----|------|--------------|-----------|
| 1 | **T1** | **Define** | Scenario Cards, matrix filled, golden JSON plan, constraints doc | `TRACEABILITY.md` rows exist; min pack §9.3 met |
| 2 | **T2** | **Gherkin** | `.feature` file + Scenario Outlines + tags | Scenarios run (may fail — red is OK) |
| 3 | **T3** | **Unit + Integration specs** | Unit tests + integration stubs loading golden JSON by ID | `npm test` runs; tests fail for right reasons |

### Phase B — Implementation

| Step | ID | Name | Deliverables | Done when |
|------|-----|------|--------------|-----------|
| 4 | **I1** | **Review** | Peer/self review checklist §8.4; CA sign-off for `@tax` | Review notes resolved; traceability updated |
| 5 | **I2** | **Red → Green → Refactor** | Step defs, hook/utils fixes, minimal diffs | All T2/T3 tests green |
| 6 | **I3** | **Harden** | Mutation spot-check, `@known-bug` filed/fixed, CI tags | `@smoke` + `@regression` green for this surface |

### Constraints (apply to every step)

- Scenario IDs: `{PREFIX}-{NN}` (e.g. `FD-14`) — same ID in Gherkin, unit, integration, golden JSON
- Golden expected values: from `tests/fixtures/golden/` — not invented in test code
- Tax scenarios: must reference `tests/fixtures/regulatory/` — CA review before I2 merge
- `@known-bug`: allowed in T2; must link GitHub issue before I3 close
- Do not skip T1 matrix — scenario count comes from framework, not intuition
- Minimum pack per calculator: 7 Gherkin scenarios, 7+ unit cases, 3 integration, 5 golden rows (see IMPLEMENTATION_GUIDE §9.3)

---

## Execution order

```
S0 (once, blocking) ──► Wave 1 (3 parallel) ──► Wave 2 (4 parallel) ──► …
                              │                      │
                              └──── Corpus (W5) needs W1–W4 golden portfolios
```

| Wave | Workstreams | Parallel? |
|------|-------------|-------------|
| **S0** | Global setup | Sequential (1 task) |
| **W1** | FD, SIP, PPF | ✅ 3 parallel |
| **W2** | ELSS, Equity, NSC, RD | ✅ 4 parallel |
| **W3** | SSY, SCSS, POMIS, 54EC | ✅ 4 parallel |
| **W4** | NPS, SGB, ETF, Debt MF, REITs | ✅ 5 parallel |
| **W5** | Corpus Simulator | 1 (after W1 golden portfolios exist) |
| **W6** | App + Global prefs | ✅ 1–2 parallel |

---

## S0 — Global setup (run once before parallel calculators)

**Multi-task prompt:**

```
Workstream: S0 — Global testing infrastructure
Skill: .cursor/skills/calculator-test-suite/SKILL.md
Docs: docs/TESTING_STRATEGY.md, docs/TESTING_IMPLEMENTATION_GUIDE.md

Complete S0 only. Do not start calculator-specific work.

T1: Create tests/fixtures/regulatory/tax-slabs-fy2024-25.json, ltcg-exemptions.json, tds-thresholds.json with README citing sources.
T2: Scaffold tests/features/_shared/, tests/step-definitions/, tests/README.md, tag conventions.
T3: Add tests/fixtures/golden/_template.json, tests/TRACEABILITY.md, npm scripts test:gherkin test:integration.
I1: Review structure against IMPLEMENTATION_GUIDE §6 prerequisites P1–P8.
I2: Choose Playwright BDD (or document choice), minimal working runner for one @smoke scenario.
I3: CI stub for npm test -- --run @smoke.

Exit: P1–P8 checklist in IMPLEMENTATION_GUIDE §6.4 satisfied except FD vertical slice.
```

---

## Wave 1 — Parallel tasks (copy one per multi-task agent)

### TASK-W1-FD — Fixed Deposit

```
Workstream: FD Calculator — full 6-step test suite
Prefix: FD | Route: /calculators/fd
Skill: .cursor/skills/calculator-test-suite/SKILL.md
Code: src/components/calculators/FDCalculator/, src/utils/calculations.js (calculateFD), fdSchema.js

T1 — Define
- Fill calculator matrix (IMPLEMENTATION_GUIDE §4.1) for FD
- Scenario Cards: FD-01..FD-25 per TESTING_STRATEGY §4.2 FD table
- Extra dimensions: compounding (4), years+months, legacy tenure, TDS threshold
- Plan tests/fixtures/golden/fd.json (min 5 rows: 2 HP, 2 BD, 1 tax)
- Add rows to tests/TRACEABILITY.md

T2 — Gherkin
- Create tests/features/calculators/fd.feature
- Shared template scenarios FD-01..FD-15 + FD-specific FD-20..FD-25
- Examples from golden JSON; tags @smoke @regression @tax @calculator-fd

T3 — Unit + Integration specs
- tests/fixtures/golden/fd.json (populate from T1 plan)
- src/__unit__/calculations.fd.test.js — golden IDs FD-14 etc., adversarial from DS-6
- src/__integration__/calculators/fd.integration.test.jsx — hook + Results DOM, 3 cases
- Extend/replace src/components/calculators/FDCalculator/FDCalculator.test.jsx with ID-named tests
- Tests RED where prod wrong; do not fix yet

I1 — Review
- Checklist IMPLEMENTATION_GUIDE §8.4
- Verify golden tolerance documented; CA review for @tax rows

I2 — RGR
- Implement step definitions for fd.feature
- Fix calculateFD / useFDCalculator / validation until green
- Refactor only after green

I3 — Harden
- Mutation spot-check on calculateFD
- File @known-bug for any deferred (e.g. senior TDS FD-24)
- Mark TRACEABILITY FD rows done; @smoke @regression pass
```

### TASK-W1-SIP — Systematic Investment Plan

```
Workstream: SIP Calculator — full 6-step test suite
Prefix: SIP | Route: /calculators/sip
Skill: .cursor/skills/calculator-test-suite/SKILL.md
Code: src/components/calculators/SIPCalculator/, calculateSIPFutureValue, calculateStepUpSIP

T1 — Define
- Matrix + Scenario Cards SIP-01..SIP-24 (step-up, LTCG ₹1L, STCG <1y)
- Golden plan: tests/fixtures/golden/sip.json
- TRACEABILITY.md rows

T2 — Gherkin — tests/features/calculators/sip.feature

T3 — Unit + Integration specs
- Golden + adversarial (min ₹500, tenure 1-50)
- sip.integration.test.jsx
- RED tests

I1 — Review (tax rules DS-3 for LTCG/STCG)

I2 — RGR — green all SIP tests

I3 — Harden — mutation on SIP formulas; @known-bug for SWP SIP-24 if not implemented
```

### TASK-W1-PPF — Public Provident Fund

```
Workstream: PPF Calculator — full 6-step test suite
Prefix: PPF | Route: /calculators/ppf
Skill: .cursor/skills/calculator-test-suite/SKILL.md
Code: src/components/calculators/PPFCalculator/, calculatePPF, calculatePPFWithStepUp

T1 — Define
- Matrix: max ₹1.5L, min ₹500, 15y lock-in, step-up, EEE tax
- Scenario Cards PPF-01..PPF-25
- Golden: tests/fixtures/golden/ppf.json

T2 — Gherkin — tests/features/calculators/ppf.feature

T3 — Unit + Integration specs — RED

I1 — Review — EEE: post-tax equals nominal

I2 — RGR

I3 — Harden
```

---

## Wave 2 — Parallel tasks

### TASK-W2-ELSS
```
Prefix: ELSS | Route: /calculators/elss
T1: 3y lock-in, 80C, LTCG. Cards ELSS-01..ELSS-22. Golden elss.json.
T2: tests/features/calculators/elss.feature
T3: Unit + integration RED
I1–I3: Standard 6-step
```

### TASK-W2-EQUITY
```
Prefix: EQ | Route: /calculators/equity
T1: SIP/lumpsum, step-up, LTCG/STCG, risk warnings. Golden equity.json.
T2: tests/features/calculators/equity.feature
T3: Unit + integration RED
I1–I3: Standard 6-step
```

### TASK-W2-NSC
```
Prefix: NSC | Route: /calculators/nsc
T1: Fixed 5y, 80C, interest at maturity. Golden nsc.json.
T2: tests/features/calculators/nsc.feature
T3: Unit + integration RED
I1–I3: Standard 6-step
```

### TASK-W2-RD
```
Prefix: RD | Route: /calculators/rd
T1: Monthly deposit, tenure units, taxable interest. Golden rd.json.
T2: tests/features/calculators/rd.feature
T3: Unit + integration RED
I1–I3: Standard 6-step
```

---

## Wave 3 — Parallel tasks

### TASK-W3-SSY
```
Prefix: SSY | Route: /calculators/ssy | T1: age <10, ₹1.5L max, 21y, EEE
```

### TASK-W3-SCSS
```
Prefix: SCSS | Route: /calculators/scss | T1: age 60+, ₹30L max, quarterly interest, TDS
```

### TASK-W3-POMIS
```
Prefix: POMIS | Route: /calculators/pomis | T1: 5y fixed, monthly payout, max limits
```

### TASK-W3-54EC
```
Prefix: 54EC | Route: /calculators/54ec-bonds | T1: 5y lock-in, cap gains exempt, taxable interest
```

*(Each follows full 6-step block like W1-FD — expand T2/T3/I1/I2/I3 identically when spawning tasks.)*

---

## Wave 4 — Parallel tasks

| Task ID | Prefix | Route | T1 focus |
|---------|--------|-------|----------|
| TASK-W4-NPS | NPS | `/calculators/nps` | Allocation 100%, weighted return, 60/40 tax |
| TASK-W4-SGB | SGB | `/calculators/sgb` | Gold API DG scenarios, 2.5% interest, maturity tax-free |
| TASK-W4-ETF | ETF | `/calculators/etf` | 4 ETF types, expense ratio, SIP/lumpsum |
| TASK-W4-DMF | DMF | `/calculators/debt-mutual-fund` | Indexation, 3y LTCG boundary |
| TASK-W4-REIT | REIT | `/calculators/reits` | Dividend + appreciation, LTCG/STCG |

---

## Wave 5 — Corpus Simulator (single stream, after W1–W4)

```
Workstream: Corpus Simulator — full 6-step test suite
Prefix: CORP | Route: /corpus-calculator
Depends: golden corpus-portfolios.json from W1–W4

T1 — Define
- Matrix IMPLEMENTATION_GUIDE §4.2 (S1–S4, NAV, PER)
- Scenario Cards CORP-S1-01..CORP-PER-13
- Use tests/fixtures/golden/corpus-portfolios.json (multi-instrument)
- Document @known-bug: CORP-S1-05, CORP-S3-06/07, PREF-06

T2 — Gherkin
- tests/features/corpus/selection.feature
- tests/features/corpus/investment-details.feature
- tests/features/corpus/settings.feature
- tests/features/corpus/results.feature
- tests/features/corpus/persistence.feature

T3 — Unit + Integration specs
- src/__integration__/corpus/*.test.jsx (one file per concern from TESTING_STRATEGY)
- Unit: corpusCalculations, corpusValidation, corpusCalculatorStorage
- RED; mock localStorage + fetch

I1 — Review — persistence + tax method completeness

I2 — RGR — CorpusCalculatorPage, store, hooks; step definitions

I3 — Harden — full CORP @smoke @regression; triage @known-bug
```

---

## Wave 6 — App shell (parallel)

### TASK-W6-NAV
```
Prefix: NAV, THM | T1: TESTING_STRATEGY §4.1 tables
T2: tests/features/app/navigation.feature, theme.feature
T3: Light integration for routing + theme persistence
I1–I3: Standard
```

### TASK-W6-PREF
```
Prefix: PREF | T1: tax slab + inflation cross-feature matrix
T2: tests/features/preferences/global-preferences.feature
T3: src/__integration__/cross-cutting/tax-slab-consistency.test.jsx RED
I1–I3: Standard; PREF-06 @known-bug until corpus/header unified
```

---

## Multi-task spawn checklist

When starting N parallel agents:

- [ ] S0 complete
- [ ] Each agent gets **one TASK-* block** only
- [ ] Each agent reads **calculator-test-suite SKILL**
- [ ] Agents in same wave must not edit same files (conflict matrix below)
- [ ] Merge order: T1/T2/T3 PRs can merge in parallel; I2 PRs one per file owner if conflicts

### File ownership (avoid parallel conflicts)

| Agent | Owns (write) |
|-------|----------------|
| FD | `golden/fd.json`, `fd.feature`, `calculations.fd.test.js`, `FDCalculator/` |
| SIP | `golden/sip.json`, `sip.feature`, `SIPCalculator/` |
| … | One prefix per agent — no shared test files except TRACEABILITY (append-only rows) |

**TRACEABILITY.md rule:** Each agent adds only their prefix section; never rewrite other sections.

---

## Progress tracker

| Workstream | T1 | T2 | T3 | I1 | I2 | I3 |
|------------|----|----|----|----|----|-----|
| S0 Global | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| FD | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| SIP | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| PPF | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ELSS | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Equity | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| NSC | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| RD | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| SSY | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| SCSS | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| POMIS | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 54EC | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| NPS | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| SGB | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ETF | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Debt MF | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| REITs | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Corpus | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| App/Nav | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Prefs | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## How to use with Cursor multi-task

1. Complete **S0** as a single agent task.
2. Open multi-task; spawn **W1** with 3 agents — paste `TASK-W1-FD`, `TASK-W1-SIP`, `TASK-W1-PPF`.
3. Wait for all T1–T3 PRs → batch **I1** reviews → spawn I2 agents.
4. Repeat per wave.
5. **Corpus (W5)** only after at least W1 golden JSON merged.

**Agent instruction footer (append to every task):**

```
Follow calculator-test-suite SKILL 6-step workflow exactly.
Phase A (T1–T3): spec only, tests may be RED.
Phase B (I1–I3): implementation.
Update tests/TRACEABILITY.md for your prefix only.
Reference docs/TESTING_STRATEGY.md for scenario IDs.
Do not work outside your workstream file ownership.
```
