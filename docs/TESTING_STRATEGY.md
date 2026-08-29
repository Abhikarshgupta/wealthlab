# WealthLab Testing Strategy

**Status:** Planning (breadth-first)  
**Last Updated:** July 2026  
**Audience:** Engineers, QA, product  

---

## 1. Purpose

WealthLab is a financial calculator platform for Indian retail investors. Wrong numbers are worse than missing features. This document defines **how we test**, in what order, and at what breadth — before any new test code is written.

### What exists today

| Layer | Status |
|-------|--------|
| Vitest + RTL | 17 files (~200 `it()` blocks), mostly calculator smoke/render tests |
| Gherkin / BDD | None |
| Integration (multi-step flows) | None |
| Mutation testing | None |
| E2E (browser) | None |

### Target approach (inverted from typical pyramid)

```
┌─────────────────────────────────────────────┐
│  1. GHERKIN — Spec of truth                 │  ← Write first (breadth)
│     Every flow, edge case, regulatory rule  │
├─────────────────────────────────────────────┤
│  2. UNIT + MUTATION — Prove primitives      │  ← Make contracts concrete
│     Bad payloads, sanitization, law drift   │
├─────────────────────────────────────────────┤
│  3. INTEGRATION — Wire units to Gherkin     │  ← Make scenarios pass
│     Store → hook → component → result       │
├─────────────────────────────────────────────┤
│  4. E2E (thin) — Critical journeys only     │  ← Optional guardrail later
└─────────────────────────────────────────────┘
```

**Gherkin is not documentation.** It is the executable contract. Unit and integration tests exist to satisfy it.

---

## 2. Principles

1. **Spec before code tests** — A Gherkin scenario must exist (or be drafted) before we write the unit/integration that proves it.
2. **Regulatory accuracy is a first-class requirement** — Tax slabs, LTCG exemptions, lock-ins, TDS thresholds, and instrument limits are scenario inputs with explicit expected outputs.
3. **Fail loudly on bad input** — UI, hooks, and utils must reject or sanitize garbage; mutation tests verify that removing a guard breaks the build.
4. **No silent failures** — Corpus step navigation, storage errors, and API degradation must have Gherkin scenarios (even if tagged `@known-bug` until fixed).
5. **Tag everything** — `@smoke`, `@regression`, `@tax`, `@edge`, `@known-bug`, `@wip`, `@calculator-{id}`, `@corpus`.
6. **Breadth before depth** — Catalogue all scenarios first; implement highest-risk paths first in code.

---

## 3. Tooling (proposed)

| Purpose | Tool | Rationale |
|---------|------|-----------|
| Gherkin runner | **Playwright + playwright-bdd** (or Cucumber + `@cucumber/cucumber`) | Gherkin maps to real browser; SPA routing already in place |
| Unit / integration | **Vitest** (existing) | Already configured, jsdom, RTL |
| Mutation testing | **Stryker Mutator** (`@stryker-mutator/vitest-runner`) | JS-native, works with Vitest |
| Property / fuzz | **fast-check** (optional, Phase 2) | Random bad payloads for utils |
| Coverage | **Vitest v8 coverage** | Gate on `utils/`, `hooks/`, stores |
| CI | GitHub Actions | `gherkin → unit → integration → mutation (nightly)` |

### Folder layout (target)

```
tests/
├── features/                    # Gherkin — source of truth
│   ├── _shared/                 # Backgrounds, tax tables, golden values
│   ├── app/                     # Navigation, theme, legal
│   ├── preferences/             # Global tax slab, inflation toggle
│   ├── calculators/             # One feature file per instrument
│   ├── corpus/                  # Multi-step simulator
│   └── goal-planning/           # @wip until feature ships
├── step-definitions/            # Playwright/Cucumber step glue
├── fixtures/                    # Golden corpora, saved scenarios, mock API
├── support/                     # World object, hooks, tags
└── README.md

src/
├── __unit__/                    # Pure util/store/hook tests (or co-located)
├── __integration__/               # Multi-module, no full browser
└── components/**/**.test.jsx    # Existing co-located tests (migrate gradually)
```

---

## 4. Phase 1 — Gherkin breadth (write first)

This section is the **catalogue**. Every item below should become at least one scenario (many will need several). Scenarios are tagged; not all run on every CI pass.

### 4.1 Global / cross-cutting (`features/app/`, `features/preferences/`)

#### Navigation & routing

| ID | Scenario | Tags |
|----|----------|------|
| NAV-01 | Home loads with hero and CTA to calculators | @smoke |
| NAV-02 | Calculator index shows all 16 instruments | @smoke |
| NAV-03 | Each calculator route `/calculators/{id}` renders without error | @smoke @regression |
| NAV-04 | Corpus Simulator route loads 4-step wizard | @smoke |
| NAV-05 | Goal Planning route shows placeholder with "Soon" badge | @wip |
| NAV-06 | Legal pages (privacy, terms, disclaimer) render | @smoke |
| NAV-07 | Invalid route shows 404 or redirects to home | @edge |
| NAV-08 | Lazy-loaded calculator shows loading spinner then content | @edge |
| NAV-09 | Scroll position resets on calculator navigation | @edge |
| NAV-10 | Header links active state matches current route | @edge |

#### Theme & layout

| ID | Scenario | Tags |
|----|----------|------|
| THM-01 | Toggle dark mode updates page styling | @smoke |
| THM-02 | Theme persists across page reload | @regression |
| THM-03 | Calculator layout: inputs left / results right on desktop | @edge |
| THM-04 | Calculator layout: stacked on mobile viewport | @edge |

#### Global preferences (tax slab + inflation)

| ID | Scenario | Tags |
|----|----------|------|
| PREF-01 | Default tax slab is 30% on first visit | @smoke |
| PREF-02 | Changing tax slab in header updates standalone calculator post-tax output | @tax @regression |
| PREF-03 | Tax slab persists in localStorage across reload | @regression |
| PREF-04 | Inflation toggle OFF → spending power hidden or nominal only | @smoke |
| PREF-05 | Inflation toggle ON → spending power shown in calculators | @tax |
| PREF-06 | Corpus Simulator tax slab is independent of header slab (document current behavior) | @tax @known-bug |
| PREF-07 | Preferences menu on mobile exposes same controls as desktop header | @edge |

---

### 4.2 Calculator catalogue (16 instruments)

**Shared scenario template** — every calculator gets these (substitute instrument-specific limits):

| ID pattern | Scenario | Tags |
|------------|----------|------|
| `{CALC}-01` | Calculator loads with documented default values | @smoke |
| `{CALC}-02` | Results update in real time without Calculate button | @smoke |
| `{CALC}-03` | Results panel shows Money in Hand (post-tax) | @tax @smoke |
| `{CALC}-04` | Tax breakdown visible with rule explanation | @tax |
| `{CALC}-05` | Inflation toggle affects spending power when ON | @tax |
| `{CALC}-06` | Evolution table shows year-wise breakdown | @smoke |
| `{CALC}-07` | Info panel shows current rate and last updated | @smoke |
| `{CALC}-08` | Invalid min amount shows inline validation error | @edge |
| `{CALC}-09` | Invalid max amount shows inline validation error | @edge |
| `{CALC}-10` | Zero / empty input does not crash; shows error or zero state | @edge |
| `{CALC}-11` | Negative input rejected or clamped | @edge |
| `{CALC}-12` | Non-numeric input rejected | @edge |
| `{CALC}-13` | Extremely large value handled without overflow/UI break | @edge |
| `{CALC}-14` | Golden calculation matches reference value (see `_shared/golden-values.feature`) | @regression @tax |
| `{CALC}-15` | Pie chart renders (or graceful fallback if chart mocked) | @edge |

#### Instrument-specific scenarios (breadth)

##### PPF (`@calculator-ppf`)

| ID | Scenario |
|----|----------|
| PPF-20 | Yearly investment capped at ₹1.5L validation |
| PPF-21 | Minimum ₹500/year validation |
| PPF-22 | Step-up yearly increase reflected in maturity |
| PPF-23 | 15-year default tenure |
| PPF-24 | Maturity is tax-free (EEE) — post-tax equals nominal |
| PPF-25 | Partial withdrawal / loan — @wip (not implemented) |

##### FD (`@calculator-fd`)

| ID | Scenario |
|----|----------|
| FD-20 | Years + months tenure (e.g. 1 year 3 months) |
| FD-21 | Legacy tenure format still works |
| FD-22 | Quarterly / monthly / annual / cumulative compounding |
| FD-23 | TDS warning when annual interest exceeds ₹40,000 |
| FD-24 | Senior citizen TDS threshold ₹50,000 — @wip if not in UI |
| FD-25 | Premature withdrawal — @wip |

##### SIP (`@calculator-sip`)

| ID | Scenario |
|----|----------|
| SIP-20 | Minimum ₹500/month |
| SIP-21 | Step-up SIP percentage increase |
| SIP-22 | LTCG: 10% above ₹1L exemption after 1 year |
| SIP-23 | STCG when tenure < 1 year |
| SIP-24 | SWP — @wip |

##### SSY (`@calculator-ssy`)

| ID | Scenario |
|----|----------|
| SSY-20 | Girl child age < 10 validation |
| SSY-21 | Max ₹1.5L/year |
| SSY-22 | 21-year maturity from account opening |
| SSY-23 | Tax-free maturity (EEE) |

##### NSC (`@calculator-nsc`)

| ID | Scenario |
|----|----------|
| NSC-20 | Fixed 5-year tenure |
| NSC-21 | 80C deduction noted in info |
| NSC-22 | Interest taxable; paid at maturity |

##### SCSS (`@calculator-scss`)

| ID | Scenario |
|----|----------|
| SCSS-20 | Age 60+ validation |
| SCSS-21 | Max ₹30L principal |
| SCSS-22 | Quarterly interest payout |
| SCSS-23 | TDS on interest above threshold |

##### SGB (`@calculator-sgb`)

| ID | Scenario |
|----|----------|
| SGB-20 | 2.5% semi-annual interest component |
| SGB-21 | Gold appreciation rate user-adjustable |
| SGB-22 | Real-time gold price fetch succeeds |
| SGB-23 | Gold API failure → fallback price used |
| SGB-24 | Gold API rate limit (once per 24h) → cached price |
| SGB-25 | Missing `VITE_GOLDAPI_KEY` → fallback |
| SGB-26 | Tax-free if held to maturity (5+ years) |

##### NPS (`@calculator-nps`)

| ID | Scenario |
|----|----------|
| NPS-20 | Asset allocation sliders sum to 100% |
| NPS-21 | Weighted return reflects allocation |
| NPS-22 | 60% tax-free / 40% taxable on withdrawal |
| NPS-23 | Tier 2 — @wip |
| NPS-24 | Negative return edge case does not produce NaN |

##### Equity (`@calculator-equity`)

| ID | Scenario |
|----|----------|
| EQ-20 | SIP mode vs lumpsum mode |
| EQ-21 | Step-up SIP |
| EQ-22 | LTCG vs STCG by tenure |
| EQ-23 | Risk warning displayed |

##### ELSS (`@calculator-elss`)

| ID | Scenario |
|----|----------|
| ELSS-20 | 3-year lock-in enforced |
| ELSS-21 | 80C benefit in info panel |
| ELSS-22 | LTCG above ₹1L exemption |

##### RD (`@calculator-rd`)

| ID | Scenario |
|----|----------|
| RD-20 | Monthly deposit minimum |
| RD-21 | Tenure in months/years |
| RD-22 | Interest taxable per slab |

##### POMIS (`@calculator-pomis`)

| ID | Scenario |
|----|----------|
| POMIS-20 | Fixed 5-year tenure |
| POMIS-21 | Monthly interest payout display |
| POMIS-22 | Max investment limit |

##### ETF (`@calculator-etf`)

| ID | Scenario |
|----|----------|
| ETF-20 | ETF type: Equity / Debt / Gold / International |
| ETF-21 | SIP vs lumpsum |
| ETF-22 | Expense ratio input |
| ETF-23 | LTCG/STCG by type and tenure |

##### Debt Mutual Fund (`@calculator-debt-mf`)

| ID | Scenario |
|----|----------|
| DMF-20 | Indexation benefit for LTCG (>3 years) |
| DMF-21 | STCG for <3 years |
| DMF-22 | SIP vs lumpsum |

##### REITs (`@calculator-reits`)

| ID | Scenario |
|----|----------|
| REIT-20 | Dividend + capital appreciation |
| REIT-21 | LTCG/STCG by tenure |

##### 54EC Bonds (`@calculator-54ec`)

| ID | Scenario |
|----|----------|
| 54EC-20 | 5-year lock-in |
| 54EC-21 | Capital gains exemption on qualifying reinvestment |
| 54EC-22 | Interest taxable |

---

### 4.3 Corpus Simulator (`features/corpus/`)

#### Step 1 — Instrument selection

| ID | Scenario | Tags |
|----|----------|------|
| CORP-S1-01 | Cannot proceed to Step 2 with zero instruments | @smoke |
| CORP-S1-02 | Select single instrument (each of 15 available types) | @regression |
| CORP-S1-03 | Select multiple instruments | @smoke |
| CORP-S1-04 | Deselect instrument removes it from selection UI | @smoke |
| CORP-S1-05 | Deselect instrument clears stale investment data from store | @edge @known-bug |
| CORP-S1-06 | POMIS calculator exists but POMIS not in corpus list — document gap | @edge @known-bug |

#### Step 2 — Investment details

| ID | Scenario | Tags |
|----|----------|------|
| CORP-S2-01 | Defaults initialize when entering Step 2 | @smoke |
| CORP-S2-02 | Existing investment only (no future contributions) | @regression |
| CORP-S2-03 | Future investment only (no existing) | @smoke |
| CORP-S2-04 | Both existing + future for same instrument | @regression |
| CORP-S2-05 | `planToInvestMore` unchecked uses existing return rate | @tax |
| CORP-S2-06 | `yearsInvested` > `timeHorizon` → zero remaining growth | @edge |
| CORP-S2-07 | FD years+months tenure in corpus form | @edge |
| CORP-S2-08 | FD legacy tenure format migrated | @edge |
| CORP-S2-09 | NPS allocation in corpus matches standalone behavior | @regression |
| CORP-S2-10 | SGB gold rate in corpus | @edge |
| CORP-S2-11 | Validation blocks Next until all selected instruments valid | @smoke |
| CORP-S2-12 | Validation error identifies which instrument failed | @edge @known-bug |
| CORP-S2-13 | Instrument removed from Step 1 while on Step 2 — form updates | @edge |

#### Step 3 — Settings

| ID | Scenario | Tags |
|----|----------|------|
| CORP-S3-01 | Time horizon caps per-instrument tenure in calculations | @tax @regression |
| CORP-S3-02 | General inflation rate applied | @tax |
| CORP-S3-03 | Category-specific inflation rates applied | @tax |
| CORP-S3-04 | Tax method: withdrawal (default) | @tax @smoke |
| CORP-S3-05 | Tax method: during accumulation — FD/SCSS | @tax |
| CORP-S3-06 | Tax method: during accumulation — SGB interest | @tax @known-bug |
| CORP-S3-07 | Tax method: during accumulation — REITs dividend | @tax @known-bug |
| CORP-S3-08 | Tax slab 0% / 5% / 20% / 30% | @tax @regression |
| CORP-S3-09 | Old tax regime — @wip (not implemented) | @wip |
| CORP-S3-10 | City selection affects purchasing power | @regression |
| CORP-S3-11 | Changing horizon after Step 2 updates results on Step 4 | @edge |

#### Step 4 — Results

| ID | Scenario | Tags |
|----|----------|------|
| CORP-S4-01 | Total nominal corpus displayed | @smoke |
| CORP-S4-02 | Per-instrument breakdown table | @smoke |
| CORP-S4-03 | Post-tax corpus matches tax method + slab | @tax @regression |
| CORP-S4-04 | Purchasing power panel with category comparisons | @regression |
| CORP-S4-05 | Tax education overlay opens and explains rules | @smoke |
| CORP-S4-06 | Pie/bar charts render | @edge |
| CORP-S4-07 | LTCG ₹1L exemption shared across equity instruments in portfolio | @tax @regression |
| CORP-S4-08 | Results recalculate when returning from Step 4 to Step 3 and changing settings | @regression |

#### Step navigation & UX

| ID | Scenario | Tags |
|----|----------|------|
| CORP-NAV-01 | Cannot jump to Step 4 from Step 1 | @smoke |
| CORP-NAV-02 | Can return to completed steps | @smoke |
| CORP-NAV-03 | Invalid step click gives user feedback | @edge @known-bug |
| CORP-NAV-04 | Step indicator shows completed ✓ state | @edge |
| CORP-NAV-05 | Calculate button only enabled when Steps 1–3 valid | @smoke |

#### Persistence & saved scenarios

| ID | Scenario | Tags |
|----|----------|------|
| CORP-PER-01 | Session auto-saved to localStorage on change | @regression |
| CORP-PER-02 | Restore banner shown on return with saved session | @smoke |
| CORP-PER-03 | Dismiss restore banner | @edge |
| CORP-PER-04 | Save named scenario to saved calculations list | @smoke |
| CORP-PER-05 | Load saved scenario restores all inputs | @regression |
| CORP-PER-06 | Save with empty name blocked | @edge |
| CORP-PER-07 | Max 20 saved scenarios — oldest evicted | @edge |
| CORP-PER-08 | Results not in session persist — recalculated on restore | @edge |
| CORP-PER-09 | Corrupt localStorage JSON — graceful recovery | @edge |
| CORP-PER-10 | localStorage quota exceeded — user notified | @edge |
| CORP-PER-11 | Save and start fresh resets wizard | @regression |
| CORP-PER-12 | Delete saved scenario | @edge |
| CORP-PER-13 | Schema drift: old saved scenario missing new fields | @edge |

---

### 4.4 Goal Planning (`features/goal-planning/`) — `@wip`

Placeholder scenarios drafted now; implementation later.

| ID | Scenario |
|----|----------|
| GOAL-01 | Page shows coming-soon state |
| GOAL-02 | Single goal: target corpus + timeline + risk profile |
| GOAL-03 | Risk-based asset allocation (Low / Med / High / Very High) |
| GOAL-04 | Shortfall detection and SIP increase suggestion |
| GOAL-05 | Multi-goal prioritization |
| GOAL-06 | Educational side panel per step |

---

### 4.5 Shared golden values (`features/_shared/`)

Centralise reference calculations verified against Groww / ET Money / manual spreadsheet / CA sign-off:

| File | Contents |
|------|----------|
| `golden-values.feature` | Scenario outlines with Examples tables per instrument |
| `tax-rules-2024-25.feature` | FY 2024-25 New Regime slabs, LTCG ₹1L, STCG rates |
| `instrument-limits.feature` | PPF ₹1.5L, SCSS ₹30L, SSY age, etc. |

---

### 4.6 Gherkin scenario count (breadth estimate)

| Area | Scenarios (estimate) |
|------|----------------------|
| Global / nav / prefs | ~25 |
| 16 calculators × ~20 each | ~320 |
| Corpus Simulator | ~55 |
| Goal Planning (wip) | ~10 |
| Shared / golden | ~40 |
| **Total** | **~450** |

Not all 450 run on every CI pass. Tag strategy:

| CI job | Tags |
|--------|------|
| PR smoke | `@smoke` (~60 scenarios) |
| PR regression | `@smoke` + `@regression` (~150) |
| Nightly | All except `@wip` |
| Weekly | Full + `@edge` |

---

## 5. Phase 2 — Unit tests + mutation testing

Units prove that **primitives** behind Gherkin steps are correct and **cannot be silently broken**.

### 5.1 What gets unit tested

| Layer | Modules | Priority |
|-------|---------|----------|
| P0 | `utils/calculations.js` | All formulas |
| P0 | `utils/taxCalculations.js` | All instrument tax rules |
| P0 | `utils/corpusCalculations.js` | Aggregation, horizon cap |
| P0 | `utils/corpusValidation.js` | Per-step, per-instrument |
| P1 | `utils/corpusDefaults.js` | Already started |
| P1 | `utils/corpusCalculatorStorage.js` | Save/load/corrupt |
| P1 | `utils/goldPriceService.js` | API, cache, fallback |
| P1 | `utils/fdTenureUtils.js` | Years+months migration |
| P1 | `utils/formatters.js`, `utils/purchasingPowerComparisons.js` | |
| P2 | `store/*.js` | State transitions |
| P2 | `hooks/use*Calculator.js` | Each calculator hook |
| P2 | `hooks/useCorpusCalculator.js`, `useCorpusPersistence.js` | |
| P3 | Joi schemas (`*Schema.js`) | Invalid payloads |

### 5.2 Golden value unit tests

Each Gherkin golden scenario maps to a **unit test with the same ID**:

```
Gherkin:  FD-14  →  unit: calculations.test.js > FD golden #FD-14
```

Keeps spec and implementation traceable.

### 5.3 Bad payload / sanitization matrix

For every public function in `utils/` and every hook export, test:

| Category | Examples |
|----------|----------|
| **Null / undefined** | `null`, `undefined`, missing keys |
| **Type confusion** | `"100000"`, `NaN`, `Infinity`, `-Infinity` |
| **Boundary** | `0`, `-1`, `MAX_SAFE_INTEGER` |
| **Regulatory boundary** | PPF ₹1,49,999 vs ₹1,50,001; SCSS ₹30,00,001 |
| **Percent vs decimal** | `30` vs `0.30` for tax slab |
| **Empty collections** | `[]`, `{}` |
| **Corrupt persisted state** | Partial JSON, wrong types after parse |
| **Unicode / injection** | `"₹1,00,000"`, `<script>`, emoji in name fields |

**Contract:** Function must either (a) return a valid result, (b) throw a typed error, or (c) return a documented safe default — never `NaN`, never silent wrong money.

### 5.4 Mutation testing strategy

**Tool:** Stryker Mutator on Vitest.

**Target files (initial):**

```
utils/calculations.js
utils/taxCalculations.js
utils/corpusCalculations.js
utils/corpusValidation.js
```

**What mutations must kill tests:**

| Mutation type | Example | Expected test failure |
|---------------|---------|------------------------|
| Arithmetic operator | `+` → `-` | Golden value mismatch |
| Boundary | `<= 150000` → `< 150000` | PPF max test fails |
| Conditional | remove `if (tenure < 1)` guard | Edge case test fails |
| Return value | return `0` instead of calculated | Golden mismatch |
| Tax rate | `0.10` → `0.15` | LTCG test fails |

**Mutation score targets:**

| Module | Initial | Target |
|--------|---------|--------|
| `calculations.js` | — | ≥ 85% |
| `taxCalculations.js` | — | ≥ 80% |
| `corpusCalculations.js` | — | ≥ 75% |
| `corpusValidation.js` | — | ≥ 80% |

**CI:** Mutation runs **nightly** (slow). PR blocks on unit + Gherkin smoke only.

**Workflow when mutation survives:**

1. Add a unit test that kills the mutant, **or**
2. Mark as equivalent mutant in `stryker.conf.json` with comment explaining why.

### 5.5 Property-based fuzz (optional Phase 2b)

Use `fast-check` on pure functions:

```javascript
// Invariant: maturity >= principal for positive rate and tenure
fc.assert(fc.property(
  fc.record({ principal: fc.float({ min: 1, max: 1e7 }), ... }),
  (input) => calculateFD(...).maturityAmount >= input.principal
))
```

---

## 6. Phase 3 — Integration tests

Integration tests **wire modules together** without a full browser. They exist to make Gherkin scenarios pass faster and cheaper than Playwright alone.

### 6.1 Integration scope map

| Gherkin area | Integration test scope |
|--------------|------------------------|
| `{CALC}-02` real-time results | Hook + schema + Results component with RTL |
| `PREF-02` tax slab | `userPreferencesStore` → calculator hook → post-tax output |
| `CORP-S2-*` | Store + Step2 + `corpusValidation` + `corpusDefaults` |
| `CORP-S3-*` | Store + Step3 + `corpusCalculations` + `taxCalculations` |
| `CORP-S4-*` | Full page minus charts; assert numbers in DOM |
| `CORP-PER-*` | Store + `corpusCalculatorStorage` + mock localStorage |
| `SGB-22–25` | `goldPriceService` + SGB hook with mocked `fetch` |

### 6.2 Integration principles

1. **One Gherkin scenario → one integration test** (1:1 traceability where possible).
2. Mock only boundaries: `localStorage`, `fetch`, `Highcharts`.
3. Do not mock internal utils — that's what unit tests are for.
4. Use real Zustand stores; reset between tests.

### 6.3 Integration test catalogue (priority order)

| Priority | Suite | Gherkin IDs covered |
|----------|-------|---------------------|
| P0 | `corpus-full-flow.test.jsx` | CORP-S1 through CORP-S4 happy path |
| P0 | `corpus-persistence.test.jsx` | CORP-PER-01 through CORP-PER-11 |
| P0 | `corpus-validation-navigation.test.jsx` | CORP-NAV-*, CORP-S2-11 |
| P1 | `tax-slab-cross-cutting.test.jsx` | PREF-02, PREF-06, CORP-S3-08 |
| P1 | `corpus-tax-methods.test.jsx` | CORP-S3-04 through CORP-S3-07 |
| P1 | `corpus-time-horizon.test.jsx` | CORP-S3-01, CORP-S2-06 |
| P2 | Per-calculator hook integration | `{CALC}-02`, `{CALC}-03` |
| P2 | `gold-api-degradation.test.jsx` | SGB-22 through SGB-25 |

---

## 7. Execution roadmap

### Stage 0 — Setup (1 week)

- [ ] Choose Gherkin runner (recommend Playwright BDD)
- [ ] Create `tests/features/` skeleton and tag conventions
- [ ] Add `tests/_shared/golden-values.feature` with 5 instruments as template
- [ ] Configure Stryker draft config (don't gate CI yet)
- [ ] Add `npm run test:gherkin`, `test:unit`, `test:integration`, `test:mutation`

### Stage 1 — Gherkin breadth (2–3 weeks)

- [ ] Write all feature files (scenario stubs with `@wip` where steps don't exist)
- [ ] Implement step definitions for `@smoke` only (~60 scenarios)
- [ ] Smoke Gherkin runs in CI (expect failures — that's the backlog)

### Stage 2 — Unit + mutation (3–4 weeks)

- [ ] Unit tests for P0 utils with golden values + bad payload matrix
- [ ] Enable mutation testing on `calculations.js`; iterate until ≥ 85%
- [ ] Expand to `taxCalculations.js`, `corpusCalculations.js`
- [ ] Map each unit test to Gherkin ID in test name

### Stage 3 — Integration (2–3 weeks)

- [ ] P0 integration suites
- [ ] Drive Gherkin `@regression` pass rate from 0% → 80%

### Stage 4 — Hardening (ongoing)

- [ ] Close `@known-bug` scenarios (fix prod or update spec)
- [ ] Nightly full Gherkin + mutation
- [ ] Thin Playwright E2E for 5 critical journeys (optional)

---

## 8. Regulatory & rules maintenance

Financial rules change. Tests must not rot.

| Artifact | Owner | Update trigger |
|----------|-------|----------------|
| `tests/_shared/tax-rules-2024-25.feature` | Engineering + CA review | Budget / Finance Act |
| `src/constants/investmentRates.js` | Engineering | RBI / govt rate announcements |
| `golden-values.feature` Examples tables | Engineering | Rate or rule change |
| Gherkin `@tax` scenarios | QA | Any of the above |

**Process:** When rates change, update constants → golden values → Gherkin Examples → unit tests → integration. Mutation suite confirms no accidental formula drift.

---

## 9. Traceability matrix (template)

| Gherkin ID | Feature file | Unit test | Integration test | Status |
|------------|--------------|-----------|------------------|--------|
| FD-14 | `calculators/fd.feature` | `calculations.test.js#FD-14` | `fd-hook.test.jsx` | ⬜ |
| CORP-S1-05 | `corpus/selection.feature` | — | `corpus-selection-sync.test.jsx` | ⬜ |
| … | … | … | … | … |

Maintain in `tests/TRACEABILITY.md` as scenarios are implemented.

---

## 10. Definition of done (per scenario)

A Gherkin scenario is **done** when:

1. ✅ Scenario written and tagged in `tests/features/`
2. ✅ Step definitions implemented
3. ✅ Supporting unit tests exist with matching ID
4. ✅ Integration test exists (if multi-module)
5. ✅ Scenario passes in CI
6. ✅ Mutation score for touched utils does not regress
7. ✅ If `@known-bug`: linked to GitHub issue; scenario uses `Scenario Outline` with expected vs actual documented

---

## 11. What we deliberately defer

| Item | Reason |
|------|--------|
| Full Playwright E2E for all 450 scenarios | Gherkin + integration covers most; E2E for 5 journeys only |
| Visual regression | Low ROI initially |
| Goal Planning implementation tests | Feature not built; Gherkin stubs only |
| Old tax regime | Not implemented; `@wip` |
| Fixing prod bugs during test writing | Spec first; fix in separate PRs tagged from `@known-bug` |

---

## 12. Next documents (after this one)

| Doc | Purpose | Depth |
|-----|---------|-------|
| **`tests/features/README.md`** | Tag conventions, how to run, how to add scenarios | Operational |
| **`tests/TRACEABILITY.md`** | Gherkin ↔ unit ↔ integration matrix | Living doc |
| **`docs/TESTING_GHERKIN_CATALOG.md`** | Full scenario text for all ~450 (optional split from this doc) | Breadth |
| **`docs/TESTING_MUTATION_GUIDE.md`** | Stryker config, equivalent mutants, CI | Depth |
| **`docs/TESTING_GOLDEN_VALUES.md`** | CA-verified reference calculations | Depth |

---

## 13. Summary

| Priority | What | Output |
|----------|------|--------|
| **1. Gherkin** | ~450 scenarios across app, 16 calculators, corpus, prefs | Executable spec in `tests/features/` |
| **2. Unit + mutation** | Utils, hooks, stores, bad payloads, golden values | Stryker ≥ 80% on financial core |
| **3. Integration** | Wire store → hook → component → DOM numbers | Gherkin `@regression` passes |

**Start here:** Stage 0 setup + Stage 1 Gherkin breadth (all feature files as stubs, smoke steps implemented).

No test implementation code until Gherkin catalogue for `@smoke` is reviewed and approved.
