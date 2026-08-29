# WealthLab Testing — Implementation & Contribution Guide

**Status:** Planning  
**Last Updated:** July 2026  
**Companion doc:** [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) (breadth catalogue)  
**Audience:** QA engineers, developers, contributors  

---

## 1. Why this document exists

[`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) lists **~450 scenarios** — a breadth target, not a random checklist. This guide answers:

| Question | Answer location |
|----------|-----------------|
| **What** are we testing? | §3 Framework taxonomy |
| **Why** does each test exist? | §4 Scenario derivation |
| **How** do we create them? | §7 QA workflow |
| **Where** do inputs come from? | §5 Data input sources |
| **When** can we start? | §6 Prerequisites |
| **Who** does what? | §8 Contribution model |

**Core idea:** Tests are not invented one-by-one. They are **generated from a matrix** (feature × path type × data source × layer), then written as Gherkin, then backed by unit/integration code.

---

## 2. The three-layer model (recap)

```
GHERKIN          →  "What the user/system must do"     (human-readable contract)
UNIT + MUTATION  →  "The math and rules are correct"   (machine-verified primitives)
INTEGRATION      →  "The wires connect"                (modules compose correctly)
```

Each layer uses the **same scenario ID** (e.g. `FD-14`) and the **same input fixture** where possible.

---

## 3. Test framework taxonomy

Every testable surface in WealthLab falls into one of **five path types**. A complete feature is not "done" until all applicable path types are covered.

### 3.1 Path types

| Path type | Code | What it proves | Typical layer | Example |
|-----------|------|----------------|---------------|---------|
| **Happy path** | `HP` | Valid inputs → correct outputs, UI updates | Gherkin + Unit + Integration | ₹1L FD @ 7% for 5y → maturity ≈ ₹1,41,478 |
| **Boundary** | `BD` | Min, max, exact threshold values | Unit + Gherkin | PPF ₹1,50,000 accepted; ₹1,50,001 rejected |
| **Edge / abnormal** | `EG` | Empty, zero, negative, corrupt, missing fields | Unit + Integration | `null` principal → error, not `NaN` |
| **Cross-feature** | `XF` | Two or more modules interact | Gherkin + Integration | Header tax slab vs corpus tax slab |
| **Degradation** | `DG` | External dependency fails | Integration + Gherkin | Gold API down → fallback price |

### 3.2 Feature surfaces

| Surface | ID prefix | Scope |
|---------|-----------|-------|
| App shell | `NAV`, `THM` | Routing, theme, layout |
| Global preferences | `PREF` | Tax slab, inflation toggle, persistence |
| Calculator (×16) | `PPF`, `FD`, `SIP`, … | Single instrument, standalone page |
| Corpus Simulator | `CORP` | 4-step wizard, save/restore |
| Goal Planning | `GOAL` | `@wip` |

### 3.3 Test layers (what runs where)

| Layer | Runs | Speed | Proves |
|-------|------|-------|--------|
| **Gherkin** | Full app in browser (or BDD runner) | Slow | User-visible behavior end-to-end |
| **Integration** | RTL + real stores/hooks, mocked boundaries | Medium | Data flows across modules |
| **Unit** | Pure functions, isolated hooks | Fast | Formulas, validation, sanitization |
| **Mutation** | Unit tests + Stryker | Very slow (nightly) | Tests actually catch code changes |

**Rule:** Every `HP` and `BD` scenario for financial output **must** have a unit golden-value test. Gherkin alone is not enough.

---

## 4. How scenarios are derived (the matrix)

The ~450 scenarios in the strategy doc are not arbitrary. They come from:

```
SCENARIOS = FEATURES × PATH_TYPES × INPUT_DIMENSIONS (where applicable)
```

Not every cell gets a test — `@wip` and low-risk cells are skipped. But **every cell is considered**.

### 4.1 Calculator matrix (per instrument)

For each of the 16 calculators, fill this matrix:

| Dimension | Values to test | Path types |
|-----------|----------------|------------|
| **Amount** | min, min−1, typical, max, max+1, 0, negative | HP, BD, EG |
| **Tenure** | min, max, years+months (FD), fixed lock-in (NSC/ELSS) | HP, BD |
| **Rate** | default (from `investmentRates`), user override, 0%, 100% | HP, BD, EG |
| **Mode** | SIP vs lumpsum (where applicable) | HP |
| **Step-up** | off, 5%, 10% (where applicable) | HP |
| **Tax slab** | 0%, 5%, 20%, 30% | HP, XF |
| **Inflation toggle** | on, off | HP, XF |
| **Tax rule** | EEE, LTCG+₹1L exempt, STCG, TDS threshold | HP, BD |
| **Instrument-specific** | See §4.3 | HP, BD, EG |

**Scenario count per calculator (typical):**

| Bucket | Count | Notes |
|--------|-------|-------|
| Shared template (`{CALC}-01` … `{CALC}-15`) | ~15 | All instruments |
| Instrument-specific | ~5–10 | PPF max, SSY age, SGB API, etc. |
| **Subtotal per calculator** | **~20–25** | |
| **× 16 calculators** | **~320–400** | Before deduplication |

Many scenarios are **Scenario Outlines** with an Examples table — one Gherkin scenario, many rows. The ~450 number is **logical test cases**, not 450 separate `.feature` files.

### 4.2 Corpus Simulator matrix

| Step | Dimensions | Path types |
|------|------------|------------|
| **S1 Selection** | 0 instruments, 1, many, deselect | HP, EG, XF |
| **S2 Details** | existing only, future only, both; per instrument type | HP, BD |
| **S3 Settings** | horizon, tax method, slab, inflation, city | HP, BD, XF |
| **S4 Results** | aggregation, per-instrument, purchasing power | HP |
| **Navigation** | valid/invalid step jumps | EG |
| **Persistence** | save, load, corrupt, quota, schema drift | HP, DG, EG |

### 4.3 Instrument-specific dimension table

| Instrument | Extra dimensions beyond shared matrix |
|------------|--------------------------------------|
| PPF | yearly amount, step-up, 15y lock-in |
| FD | compounding freq (4 values), years+months, legacy tenure |
| SIP | step-up %, LTCG tenure boundary (364d vs 366d) |
| SSY | girl age <10, 21y maturity |
| NSC | fixed 5y |
| SCSS | age 60+, max ₹30L, quarterly interest |
| SGB | gold API, appreciation rate, 2.5% interest |
| NPS | allocation %, weighted return, 60/40 tax split |
| Equity | SIP/lumpsum, step-up |
| ELSS | 3y lock-in, 80C |
| RD | monthly deposit, tenure units |
| POMIS | monthly payout, 5y fixed |
| ETF | type (4), expense ratio |
| Debt MF | indexation, 3y LTCG boundary |
| REITs | dividend + appreciation |
| 54EC | 5y lock-in, cap gains exempt |

---

## 5. Data input sources

Tests pull inputs from **six source types**. Each has an owner and update process.

### 5.1 Source catalogue

| ID | Source | Location (target) | Used by | Owner | Update trigger |
|----|--------|-------------------|---------|-------|----------------|
| **DS-1** | Product constants | `src/constants/investmentRates.js` | Defaults in HP tests | Engineering | Govt rate announcements |
| **DS-2** | Instrument rules | `src/constants/investmentInfo.js` | Copy in info panels, eligibility | Engineering | Product change |
| **DS-3** | Tax & regulatory tables | `tests/fixtures/regulatory/` | Golden expected outputs | QA + CA review | Budget / Finance Act |
| **DS-4** | Golden value spreadsheets | `tests/fixtures/golden/` | Unit + Gherkin Examples | QA | DS-1 or DS-3 change |
| **DS-5** | Joi schemas | `src/**/**Schema.js` | Boundary + EG tests | Engineering | Form change |
| **DS-6** | Synthetic / adversarial | `tests/fixtures/adversarial/` | Mutation, fuzz, EG | QA + Engineering | New bug found |

### 5.2 DS-3: Regulatory tables (authoritative for tax)

```
tests/fixtures/regulatory/
├── tax-slabs-fy2024-25.json      # New regime: 0/5/20/30%
├── ltcg-exemptions.json          # ₹1L equity, debt indexation rules
├── tds-thresholds.json           # FD ₹40K / SCSS senior ₹50K
├── instrument-tax-rules.json     # EEE, LTCG, STCG per instrument
└── README.md                     # Source citations, last reviewed date
```

**Rule:** Gherkin `Examples` tables for `@tax` scenarios are **generated from or validated against** these files — not hand-typed in isolation.

### 5.3 DS-4: Golden values (authoritative for math)

```
tests/fixtures/golden/
├── fd.json
├── sip.json
├── ppf.json
├── corpus-portfolios.json        # Multi-instrument saved scenarios
└── README.md                     # How each value was verified
```

**Golden value record format:**

```json
{
  "id": "FD-14",
  "description": "₹1L @ 7% quarterly, 5 years",
  "inputs": {
    "principal": 100000,
    "tenureYears": 5,
    "tenureMonths": 0,
    "rate": 7,
    "compoundingFrequency": "quarterly"
  },
  "expected": {
    "maturityAmount": 141478,
    "tolerance": 50
  },
  "verifiedAgainst": ["manual spreadsheet 2026-01-15", "Groww calculator"],
  "verifiedBy": "QA",
  "lastVerified": "2026-01-15"
}
```

**Tolerance:** Financial outputs allow small rounding tolerance (document per instrument). Unit tests assert `abs(actual - expected) <= tolerance`.

### 5.4 DS-5: Schema-derived boundaries

Joi schemas are a **machine-readable boundary source**. QA extracts test values directly:

| Schema rule | Boundary tests to generate |
|-------------|---------------------------|
| `.min(1000)` | 999 (fail), 1000 (pass), 1001 (pass) |
| `.max(150000)` | 149999, 150000, 150001 |
| `.valid('quarterly', 'monthly', …)` | each valid value (HP), invalid string (EG) |
| `.when(...)` conditional | both branches |

**Process:** When a schema changes, regenerate boundary test list — do not rely on memory.

### 5.5 DS-6: Adversarial payloads

```
tests/fixtures/adversarial/
├── null-undefined.json
├── type-confusion.json       # "100000", true, []
├── overflow.json             # MAX_SAFE_INTEGER
├── unicode-injection.json
├── corrupt-localStorage.json
└── README.md
```

Used by **unit tests** and **mutation testing**. Not usually duplicated in Gherkin (too many combinations) — Gherkin picks **representative** EG cases.

### 5.6 Data flow diagram

```
                    ┌─────────────────────┐
                    │  Regulatory (DS-3)  │  ← CA / Budget
                    └──────────┬──────────┘
                               │ defines expected tax
┌──────────────┐    ┌──────────▼──────────┐    ┌─────────────────┐
│ Constants    │───►│  Golden values      │◄───│  QA verification │
│ (DS-1, DS-2) │    │  (DS-4)             │    │  (spreadsheet)   │
└──────────────┘    └──────────┬──────────┘    └─────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
   Gherkin Examples      Unit test asserts      Integration loads
   (Scenario Outline)    golden JSON by ID       fixture into store
         │                     │                     │
         └─────────────────────┴─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Adversarial (DS-6)  │ → Unit + Mutation only
                    └─────────────────────┘
```

---

## 6. Prerequisites (bare minimum before starting)

Do **not** write test code until these are in place.

### 6.1 Must-have (blocking)

| # | Prerequisite | Why | Owner |
|---|--------------|-----|-------|
| P1 | **Gherkin runner chosen and scaffolded** | Without it, specs aren't executable | Engineering |
| P2 | **`tests/fixtures/regulatory/` v1** | Tax scenarios need authoritative expected values | QA + CA |
| P3 | **Golden value template + 1 complete instrument** (recommend FD) | Proves the pipeline end-to-end | QA |
| P4 | **Scenario ID convention agreed** | Traceability across layers | QA + Eng |
| P5 | **Tag convention documented** | CI can run `@smoke` only | QA |
| P6 | **`tests/TRACEABILITY.md` started** | Map ID → feature → unit → integration | QA |
| P7 | **CA sign-off process defined** | Who approves tax expected values | Product/CA |
| P8 | **npm scripts**: `test:gherkin`, `test:unit`, `test:integration` | Contributors can run locally | Engineering |

### 6.2 Should-have (week 1)

| # | Prerequisite | Why |
|---|--------------|-----|
| P9 | Playwright BDD config with `baseURL` | SPA routing |
| P10 | `renderWithProviders` extended for corpus | Integration tests |
| P11 | `mockLocalStorage`, `mockFetch` helpers | Persistence + SGB tests |
| P12 | Highcharts mock (already in `src/test/setup.js`) | Chart scenarios don't flake |
| P13 | CI job for `@smoke` Gherkin | Fast feedback |

### 6.3 Nice-to-have (can defer)

| # | Item |
|---|------|
| P14 | Stryker config |
| P15 | fast-check fuzz |
| P16 | Visual regression |
| P17 | Full 16-instrument golden JSON |

### 6.4 Definition: "ready to write tests"

```
✅ P1–P8 complete
✅ FD golden fixture has ≥3 cases (HP, BD, tax) with CA-reviewed expected values
✅ One Gherkin scenario (FD-14) passes end-to-end
✅ One unit test loads FD-14 from golden JSON
✅ TRACEABILITY.md has FD rows filled in
```

That single vertical slice is the **template for all other instruments**.

---

## 7. QA workflow — how to do this work

### 7.1 Roles

| Role | Responsibility |
|------|----------------|
| **QA lead** | Matrix completeness, golden value review, traceability |
| **QA engineer** | Write Gherkin, adversarial fixtures, manual verification |
| **Developer** | Step definitions, unit/integration implementation, mutation fixes |
| **CA / domain expert** | Sign off DS-3 and golden tax outputs |

### 7.2 Per-feature workflow (repeat for each calculator, then corpus)

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: DISCOVER                                                  │
│  • Read: investmentInfo, investmentRates, *Schema.js, hook       │
│  • Fill calculator matrix (§4.1) — mark N/A cells               │
│  • Output: Scenario Card list (§7.4) with IDs                    │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: SPECIFY (Gherkin)                                        │
│  • Write feature file with Scenario Outlines + Examples          │
│  • Pull Examples from golden JSON (DS-4) where numeric           │
│  • Tag: @smoke @regression @tax @edge @known-bug                 │
│  • Add row to TRACEABILITY.md (status: specified)                │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: FIXTURE (data)                                           │
│  • Add/update golden JSON for HP + BD cases                      │
│  • Verify expected values (spreadsheet + 1 external calculator)  │
│  • CA review for @tax cases                                      │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: UNIT                                                     │
│  • Developer: unit test per golden ID                            │
│  • QA: adversarial cases from DS-6 + schema boundaries (DS-5)    │
│  • Nightly: mutation on touched utils                            │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: INTEGRATE                                                │
│  • RTL test: hook + component shows golden output in DOM        │
│  • Corpus: store + step + validation                           │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: GHERKIN PASS                                             │
│  • Step definitions implemented                                  │
│  • Scenario green in CI                                          │
│  • TRACEABILITY.md → status: done                                │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Sprint cadence (suggested)

| Sprint | Focus | Exit criteria |
|--------|-------|---------------|
| **S0** | Prerequisites P1–P8, FD vertical slice | FD-14 green all layers |
| **S1** | Gherkin breadth: all feature files as stubs + `@smoke` for app, prefs, 4 calculators | ~60 scenarios specified |
| **S2** | Golden JSON for 8 calculators + unit tests | Mutation on `calculations.js` ≥70% |
| **S3** | Remaining 8 calculators + corpus S1–S2 Gherkin | Calculator `@regression` 80% green |
| **S4** | Corpus S3–S4 + persistence + integration | Corpus `@smoke` green |
| **S5** | Edge, degradation, `@known-bug` triage | Nightly full suite |

### 7.4 Scenario Card template

Every test starts as a **Scenario Card** (in TRACEABILITY.md or a ticket):

```markdown
## FD-14 — Standard FD maturity (golden)

| Field | Value |
|-------|-------|
| **ID** | FD-14 |
| **Feature** | FD Calculator |
| **Path type** | HP |
| **Priority** | P0 |
| **Tags** | @smoke @regression @calculator-fd |

### Why
Verify core FD formula matches industry reference. Regression guard for compounding logic.

### Inputs (from DS-4 `golden/fd.json#FD-14`)
- principal: 100000
- tenure: 5y 0m
- rate: 7%
- compounding: quarterly

### Expected
- maturity: 141478 (±50)
- post-tax: per 30% slab on interest only

### Layers
- [ ] Gherkin: `tests/features/calculators/fd.feature`
- [ ] Unit: `calculations.test.js`
- [ ] Integration: `fd-hook.integration.test.jsx`
- [ ] Golden JSON: `tests/fixtures/golden/fd.json`

### Verified against
- Manual spreadsheet (link)
- Groww FD calculator (screenshot date)

### Notes
—
```

### 7.5 When to create a new test vs extend an Outline

| Situation | Action |
|-----------|--------|
| Same flow, different numbers | Add row to Scenario Outline `Examples` |
| Same flow, different instrument | New column in corpus Outline or new `{CALC}-xx` ID |
| Different user journey | New scenario |
| Bug found in prod | New `@edge` or `@known-bug` scenario + adversarial fixture |
| Formula change | Update golden JSON + all linked IDs |

---

## 8. Contribution model

### 8.1 What QA contributes

| Artifact | Format |
|----------|--------|
| Scenario Cards | Markdown / TRACEABILITY.md |
| Gherkin feature files | `.feature` |
| Golden value JSON | `tests/fixtures/golden/` |
| Regulatory tables | `tests/fixtures/regulatory/` |
| Adversarial payloads | `tests/fixtures/adversarial/` |
| Manual verification evidence | Linked in golden README |
| External calculator screenshots | Attached to Scenario Card |

### 8.2 What Engineering contributes

| Artifact | Format |
|----------|--------|
| Step definitions | `tests/step-definitions/` |
| Unit tests | `src/__unit__/` or co-located |
| Integration tests | `src/__integration__/` |
| Test helpers | `src/test/` |
| CI configuration | `.github/workflows/` |
| Stryker config | `stryker.conf.json` |

### 8.3 PR rules

1. **Gherkin-only PRs** allowed for breadth (stubs with `@wip` steps).
2. **Unit PR** must reference Scenario Card ID in test name: `it('FD-14: standard quarterly FD', ...)`.
3. **No golden value change** without QA + CA review for `@tax` cases.
4. **`@known-bug`** scenarios must link a GitHub issue; test may `expect.fail` or use soft assert until fixed.
5. **Mutation regression:** nightly job; PR author notified if score drops >5% on touched files.

### 8.4 Review checklist

**QA reviews Engineering PR:**
- [ ] Scenario ID in test name matches TRACEABILITY.md
- [ ] Inputs match golden JSON (not hardcoded divergent values)
- [ ] Expected uses documented tolerance
- [ ] Adversarial case added if PR touches validation

**Engineering reviews QA PR:**
- [ ] Gherkin steps use existing step definition vocabulary
- [ ] Examples table columns match step placeholders
- [ ] Tags are valid
- [ ] No duplicate scenario ID

---

## 9. Framework quick reference

### 9.1 Decision tree: "Do we need a test?"

```
Is there user-visible behavior?
├─ No → Unit only (pure util)
└─ Yes → Is it a single module?
    ├─ Yes → Gherkin (HP) + Unit (golden) + optional Integration
    └─ No → Gherkin + Integration required
        └─ Does it involve tax/regulation?
            └─ Yes → Golden + DS-3 + CA sign-off required
```

### 9.2 Decision tree: "Which path type?"

```
What are you testing?
├─ Normal user journey → HP
├─ Min/max/limit from schema or law → BD
├─ Garbage input / corrupt state / API fail → EG or DG
└─ Two settings modules disagree → XF
```

### 9.3 Minimum test pack per calculator

| Path type | Gherkin | Unit | Integration | Golden JSON |
|-----------|---------|------|-------------|-------------|
| HP × 2 | ✅ | ✅ | ✅ | ✅ |
| BD × 2 | ✅ | ✅ | — | ✅ |
| EG × 2 | ✅ | ✅ | — | — |
| Tax × 1 | ✅ | ✅ | ✅ | ✅ + DS-3 |
| **Minimum** | **7 scenarios** | **7+ adversarial** | **3** | **5 rows** |

Corpus Simulator minimum: **15 scenarios** (see TESTING_STRATEGY §4.3).

---

## 10. Instrument rollout order

Don't do all 16 at once. Order by risk and complexity:

| Wave | Instruments | Rationale |
|------|-------------|-----------|
| **W1** | FD, SIP, PPF | Most users; FD has tenure edge cases; formulas foundational |
| **W2** | ELSS, Equity, NSC, RD | Tax variety (LTCG, 80C) |
| **W3** | SSY, SCSS, POMIS, 54EC | Regulatory limits, age rules |
| **W4** | NPS, SGB, ETF, Debt MF, REITs | Allocation, API, indexation |
| **W5** | Corpus Simulator | Depends on W1–W4 golden portfolios |
| **W6** | App, prefs, goal `@wip` | Cross-cutting |

---

## 11. Templates to create (next artifacts)

| File | Purpose |
|------|---------|
| `tests/features/calculators/_template.feature` | Copy for new calculator |
| `tests/fixtures/golden/_template.json` | Golden record shape |
| `tests/fixtures/regulatory/tax-slabs-fy2024-25.json` | First regulatory file |
| `tests/TRACEABILITY.md` | Living matrix |
| `tests/README.md` | How to run locally |
| `.github/pull_request_template.md` | Scenario ID field |

---

## 12. FAQ

**Q: Why ~450 tests?**  
A: ~16 calculators × ~20 cases + ~55 corpus + ~25 app/prefs + outlines with multiple Example rows. Many are table rows, not separate scenarios.

**Q: Do we write all Gherkin before any unit tests?**  
A: Specify all feature *files* early (breadth). Implement in waves (W1 first). Unit tests follow each wave's golden JSON.

**Q: Who owns expected tax numbers?**  
A: QA proposes from DS-3 + external verification; CA signs off. Engineering does not invent tax expectations.

**Q: What if the app has a bug?**  
A: Write the Scenario Card with correct expected behavior, tag `@known-bug`, file issue. Test documents intent; fix is separate PR.

**Q: Mutation testing vs adversarial fixtures?**  
A: Adversarial fixtures are **explicit** bad inputs you choose. Mutation testing **discovers** if your tests catch arbitrary code changes. Both required.

**Q: How does this relate to existing `*.test.jsx` files?**  
A: Migrate gradually: add Scenario IDs to test names, align with golden JSON, delete redundant tests that don't map to the matrix.

---

## 13. Summary

| Topic | Answer |
|-------|--------|
| **Framework** | 5 path types (HP, BD, EG, XF, DG) × feature surfaces × 6 data sources |
| **Matrix** | Per-calculator dimensions (§4.1) generate scenarios systematically |
| **Data sources** | DS-1 constants → DS-4 golden → Gherkin Examples; DS-3 for tax; DS-5 schema boundaries; DS-6 adversarial |
| **QA workflow** | Discover → Specify → Fixture → Unit → Integrate → Gherkin pass (§7.2) |
| **Before starting** | P1–P8 prerequisites + FD vertical slice (§6) |
| **First implementation** | FD-14 through all layers as the template |

**Next action:** Complete prerequisites §6.1, then execute FD vertical slice. Do not bulk-write 450 tests — generate them from the matrix one wave at a time.

---

**See also:**
- [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) — full scenario catalogue
- `tests/TRACEABILITY.md` — to be created in S0
