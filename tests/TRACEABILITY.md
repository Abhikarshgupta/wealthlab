# Test traceability matrix

Maps scenario IDs across Gherkin, golden JSON, unit, and integration layers.

**Rule:** Each workstream appends rows under its own prefix section only. Do not edit other sections.

## Status legend

| Status | Meaning |
|--------|---------|
| `specified` | Gherkin written |
| `fixtured` | Golden JSON populated |
| `unit` | Unit test exists |
| `integration` | Integration test exists |
| `reviewed` | I1 checklist passed |
| `done` | All layers green |

## S0 — Infrastructure

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| NAV-01 | `tests/features/app/smoke.feature` | — | — | — | done | n/a |

## FD — Fixed Deposit

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| FD-01 | `calculators/fd.feature` | — | — | — | done | n/a |
| FD-02 | `calculators/fd.feature` | — | — | `fd.integration.test.jsx` | done | n/a |
| FD-03 | `calculators/fd.feature` | `fd.json#FD-03` | `calculations.fd.test.js` | `fd.integration.test.jsx` | done | false |
| FD-04 | `calculators/fd.feature` | `fd.json#FD-03` | — | — | done | false |
| FD-05 | `calculators/fd.feature` | `fd.json#FD-14` | — | — | done | n/a |
| FD-06 | `calculators/fd.feature` | `fd.json#FD-14` | — | `fd.integration.test.jsx` | done | n/a |
| FD-07 | `calculators/fd.feature` | — | — | — | done | n/a |
| FD-08 | `calculators/fd.feature` | `fd.json#FD-08` | `calculations.fd.test.js` | `FDCalculator.test.jsx` | done | n/a |
| FD-09 | `calculators/fd.feature` | — | — | `FDCalculator.test.jsx` | reviewed | n/a |
| FD-10 | `calculators/fd.feature` | `fd.json#FD-10` | `calculations.fd.test.js` | `FDCalculator.test.jsx` | done | n/a |
| FD-11 | `calculators/fd.feature` | — | — | `FDCalculator.test.jsx` | done | n/a |
| FD-12 | `calculators/fd.feature` | — | — | `FDCalculator.test.jsx` | done | n/a |
| FD-13 | `calculators/fd.feature` | — | — | `FDCalculator.test.jsx` | done | n/a |
| FD-14 | `calculators/fd.feature` | `fd.json#FD-14` | `calculations.fd.test.js` | `fd.integration.test.jsx` | done | false |
| FD-15 | `calculators/fd.feature` | — | — | `FDCalculator.test.jsx` | done | n/a |
| FD-20 | `calculators/fd.feature` | `fd.json#FD-20` | `calculations.fd.test.js` | — | done | n/a |
| FD-21 | `calculators/fd.feature` | `fd.json#FD-21` | `calculations.fd.test.js` | — | done | n/a |
| FD-22 | `calculators/fd.feature` | `fd.json#FD-22` | `calculations.fd.test.js` | `FDCalculator.test.jsx` | done | n/a |
| FD-23 | `calculators/fd.feature` | `fd.json#FD-23` | `calculations.fd.test.js` | `fd.integration.test.jsx` | done | false |
| FD-24 | `calculators/fd.feature` | — | — | — | specified | false |
| FD-25 | `calculators/fd.feature` | — | — | — | specified | n/a |

**I1 notes (FD):** §8.4 checklist passed — scenario IDs match golden JSON, tolerances documented, adversarial cases in unit layer. `@tax` rows (FD-03, FD-14, FD-23) reference `tds-thresholds.json` / slab logic — `caReviewed: false` pending CA sign-off. **Gap:** FD-09 has no schema max; Gherkin accepts large principal within slider cap (documented). **Gap:** FD-24/FD-25 `@wip` skipped in runner.

**I3 notes (FD):** `calculateFD` mutation spot-check deferred to nightly Stryker. `@smoke` + `@regression` Gherkin green (excl. `@wip`). Component tests FD-08/10/11/12/15 green after validation UX aligned with schema.

## SIP — Systematic Investment Plan

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| SIP-01 | `tests/features/calculators/sip.feature` | — | — | `sip.integration.test.jsx` | done | n/a |
| SIP-02 | `sip.feature` | — | — | `sip.integration.test.jsx` | done | n/a |
| SIP-03 | `sip.feature` | `sip.json#SIP-14` | — | `sip.integration.test.jsx` | done | false |
| SIP-04 | `sip.feature` | — | — | `sip.integration.test.jsx` | done | n/a |
| SIP-05 | `sip.feature` | — | — | — | done | n/a |
| SIP-06 | `sip.feature` | — | — | — | done | n/a |
| SIP-07 | `sip.feature` | — | — | — | done | n/a |
| SIP-08 | `sip.feature` | — | `calculations.sip.test.js` | `sip.integration.test.jsx` | done | n/a |
| SIP-09 | `sip.feature` | — | `calculations.sip.test.js` | `SIPCalculator.test.jsx` | done | n/a |
| SIP-10 | `sip.feature` | — | — | — | done | n/a |
| SIP-11 | `sip.feature` | — | — | — | done | n/a |
| SIP-12 | `sip.feature` | — | — | — | done | n/a |
| SIP-13 | `sip.feature` | `sip.json#SIP-13` | `calculations.sip.test.js` | — | done | n/a |
| SIP-14 | `sip.feature` | `sip.json#SIP-14` | `calculations.sip.test.js` | `sip.integration.test.jsx` | done | false |
| SIP-15 | `sip.feature` | — | — | `SIPCalculator.test.jsx` | done | n/a |
| SIP-20 | `sip.feature` | `sip.json#SIP-20` | `calculations.sip.test.js` | — | done | n/a |
| SIP-21 | `sip.feature` | `sip.json#SIP-21` | `calculations.sip.test.js` | `SIPCalculator.test.jsx` | done | n/a |
| SIP-22 | `sip.feature` | `sip.json#SIP-22` | `calculations.sip.test.js` | `sip.integration.test.jsx` | done | false |
| SIP-23 | `sip.feature` | `sip.json#SIP-23` | `calculations.sip.test.js` | — | done | false |
| SIP-24 | `sip.feature` | — | — | — | specified | n/a |
| SIP-BD-TENURE-50 | — | `sip.json#SIP-BD-TENURE-50` | `calculations.sip.test.js` | — | done | n/a |

**I1 notes (SIP):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `sip.json`; adversarial cases in `calculations.sip.test.js` (min ₹500, tenure 50, null inputs). LTCG/STCG golden aligned with `tests/fixtures/regulatory/ltcg-exemptions.json`. `@tax` rows (`SIP-03`, `SIP-14`, `SIP-22`, `SIP-23`): `caReviewed: false` pending CA sign-off.

**I3 notes (SIP):** Gherkin 20/20 executable scenarios green (SIP-24 `@wip` skipped). Vitest 34/34 green. Step defs in `sip.steps.js`; lazy-load wait on page Given. Mutation spot-check on `calculateSIPFutureValue` / `calculateStepUpSIP` recommended (nightly).

## PPF — Public Provident Fund

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| PPF-01 | `tests/features/calculators/ppf.feature` | — | — | `ppf.integration.test.jsx` | done | n/a |
| PPF-02 | `ppf.feature` | — | — | `ppf.integration.test.jsx` | done | n/a |
| PPF-03 | `ppf.feature` | — | — | `PPFCalculator.test.jsx` | done | n/a |
| PPF-04 | `ppf.feature` | — | — | — | done | n/a |
| PPF-05 | `ppf.feature` | — | — | — | done | n/a |
| PPF-06 | `ppf.feature` | — | — | `PPFCalculator.test.jsx` | done | n/a |
| PPF-07 | `ppf.feature` | — | — | `PPFCalculator.test.jsx` | done | n/a |
| PPF-08 | `ppf.feature` | — | `calculations.ppf.test.js` | `PPFCalculator.test.jsx` | done | n/a |
| PPF-09 | `ppf.feature` | — | `calculations.ppf.test.js` | `PPFCalculator.test.jsx` | done | n/a |
| PPF-10 | `ppf.feature` | — | `calculations.ppf.test.js` | — | done | n/a |
| PPF-11 | `ppf.feature` | — | `calculations.ppf.test.js` | — | done | n/a |
| PPF-12 | `ppf.feature` | — | — | — | done | n/a |
| PPF-13 | `ppf.feature` | — | `calculations.ppf.test.js` | — | done | n/a |
| PPF-14 | `ppf.feature` | `ppf.json#PPF-14` | `calculations.ppf.test.js` | `ppf.integration.test.jsx` | done | false |
| PPF-15 | `ppf.feature` | — | — | — | done | n/a |
| PPF-20 | `ppf.feature` | `ppf.json#PPF-20` | `calculations.ppf.test.js` | `PPFCalculator.test.jsx` | done | n/a |
| PPF-21 | `ppf.feature` | `ppf.json#PPF-21` | `calculations.ppf.test.js` | `PPFCalculator.test.jsx` | done | n/a |
| PPF-22 | `ppf.feature` | `ppf.json#PPF-22` | `calculations.ppf.test.js` | `PPFCalculator.test.jsx` | done | n/a |
| PPF-23 | `ppf.feature` | — | — | `ppf.integration.test.jsx` | done | n/a |
| PPF-24 | `ppf.feature` | `ppf.json#PPF-24` | `calculations.ppf.test.js` | `ppf.integration.test.jsx` | done | false |
| PPF-25 | `ppf.feature` | — | — | — | specified | n/a |

**I1 notes (PPF):** §8.4 checklist passed — scenario IDs match golden JSON, tolerances documented (`PPF-14` ±50, `PPF-14-max` ±100). EEE post-tax equals nominal verified in unit + integration. `caReviewed: false` on PPF-14/PPF-24 (pending CA sign-off). PPF-25 `@wip` skipped.

**I3 notes (PPF):** `@smoke` + `@regression` Gherkin green (PPF-25 skipped). Mutation spot-check deferred to nightly (`calculatePPF` / `calculatePPFWithStepUp`).

## I3 — Mutation / hardening notes (W1)

| Util | Nightly mutation target | Status |
|------|-------------------------|--------|
| `calculateFD` | Stryker spot-check recommended | noted |
| `calculateSIPFutureValue` / `calculateStepUpSIP` | Stryker spot-check recommended | noted |
| `calculatePPF` / `calculatePPFWithStepUp` | Stryker spot-check recommended | noted |

## NSC — National Savings Certificate

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| NSC-01 | `calculators/nsc.feature` | — | — | `nsc.integration.test.jsx` | done | n/a |
| NSC-02 | `nsc.feature` | — | — | `nsc.integration.test.jsx` | done | n/a |
| NSC-03 | `nsc.feature` | `nsc.json#NSC-03` | `calculations.nsc.test.js` | `nsc.integration.test.jsx` | done | false |
| NSC-04 | `nsc.feature` | `nsc.json#NSC-03` | — | — | done | false |
| NSC-05 | `nsc.feature` | `nsc.json#NSC-14` | — | — | done | n/a |
| NSC-06 | `nsc.feature` | — | `calculations.nsc.test.js` | `nsc.integration.test.jsx` | done | n/a |
| NSC-07 | `nsc.feature` | — | — | `NSCalculator.test.jsx` | done | n/a |
| NSC-08 | `nsc.feature` | `nsc.json#NSC-08` | `calculations.nsc.test.js` | `NSCalculator.test.jsx` | done | n/a |
| NSC-09 | `nsc.feature` | — | — | `NSCalculator.test.jsx` | reviewed | n/a |
| NSC-10 | `nsc.feature` | — | — | — | done | n/a |
| NSC-11 | `nsc.feature` | — | `calculations.nsc.test.js` | `NSCalculator.test.jsx` | done | n/a |
| NSC-12 | `nsc.feature` | — | — | — | done | n/a |
| NSC-13 | `nsc.feature` | `nsc.json#NSC-13` | `calculations.nsc.test.js` | — | done | n/a |
| NSC-14 | `nsc.feature` | `nsc.json#NSC-14` | `calculations.nsc.test.js` | `nsc.integration.test.jsx` | done | false |
| NSC-15 | `nsc.feature` | — | — | `NSCalculator.test.jsx` | done | n/a |
| NSC-20 | `nsc.feature` | `nsc.json#NSC-20` | `calculations.nsc.test.js` | `nsc.integration.test.jsx` | done | n/a |
| NSC-21 | `nsc.feature` | — | — | `NSCalculator.test.jsx` | done | n/a |
| NSC-22 | `nsc.feature` | `nsc.json#NSC-22` | `calculations.nsc.test.js` | — | done | false |
| NSC-25 | `nsc.feature` | — | — | — | specified | n/a |

**I1 notes (NSC):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `nsc.json`; adversarial cases in `calculations.nsc.test.js` (min ₹1,000, null principal, evolution rows). `@tax` rows (`NSC-03`, `NSC-14`, `NSC-22`): interest taxed per income slab — `caReviewed: false` pending CA sign-off. **Gap:** NSC-09 has no schema max; Gherkin accepts large principal within slider cap (documented). **Gap:** NSC-25 `@wip` skipped in runner.

**I3 notes (NSC):** `@smoke` + `@regression` Gherkin green (excl. `@wip` NSC-25). Mutation spot-check on `calculateNSC` / `calculateNSCEvolution` recommended (nightly).

## ELSS — Equity Linked Savings Scheme

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| ELSS-01 | `tests/features/calculators/elss.feature` | — | — | `elss.integration.test.jsx` | done | n/a |
| ELSS-02 | `elss.feature` | — | — | `elss.integration.test.jsx` | done | n/a |
| ELSS-03 | `elss.feature` | `elss.json#ELSS-14` | — | `elss.integration.test.jsx` | done | false |
| ELSS-04 | `elss.feature` | — | — | `elss.integration.test.jsx` | done | n/a |
| ELSS-05 | `elss.feature` | — | — | — | done | n/a |
| ELSS-06 | `elss.feature` | — | — | — | done | n/a |
| ELSS-07 | `elss.feature` | — | — | `ELSSCalculator.test.jsx` | done | n/a |
| ELSS-08 | `elss.feature` | — | `calculations.elss.test.js` | `elss.integration.test.jsx` | done | n/a |
| ELSS-09 | `elss.feature` | — | `calculations.elss.test.js` | `ELSSCalculator.test.jsx` | done | n/a |
| ELSS-10 | `elss.feature` | — | — | — | done | n/a |
| ELSS-11 | `elss.feature` | — | — | — | done | n/a |
| ELSS-12 | `elss.feature` | — | — | — | done | n/a |
| ELSS-13 | `elss.feature` | `elss.json#ELSS-13` | `calculations.elss.test.js` | — | done | n/a |
| ELSS-14 | `elss.feature` | `elss.json#ELSS-14` | `calculations.elss.test.js` | `elss.integration.test.jsx` | done | false |
| ELSS-15 | `elss.feature` | — | — | — | done | n/a |
| ELSS-20 | `elss.feature` | `elss.json#ELSS-20` | `calculations.elss.test.js` | `elss.integration.test.jsx` | done | n/a |
| ELSS-21 | `elss.feature` | `elss.json#ELSS-21` | `calculations.elss.test.js` | `ELSSCalculator.test.jsx` | done | n/a |
| ELSS-22 | `elss.feature` | `elss.json#ELSS-22` | `calculations.elss.test.js` | `elss.integration.test.jsx` | done | false |
| ELSS-23 | `elss.feature` | `elss.json#ELSS-23` | `calculations.elss.test.js` | — | done | false |
| ELSS-24 | `elss.feature` | `elss.json#ELSS-21` | `calculations.elss.test.js` | `ELSSCalculator.test.jsx` | done | n/a |
| ELSS-25 | `elss.feature` | `elss.json#ELSS-BD-TENURE-50` | `calculations.elss.test.js` | — | done | n/a |
| ELSS-BD-TENURE-3 | — | `elss.json#ELSS-BD-TENURE-3` | `calculations.elss.test.js` | — | done | n/a |
| ELSS-BD-TENURE-50 | — | `elss.json#ELSS-BD-TENURE-50` | `calculations.elss.test.js` | — | done | n/a |

**I1 notes (ELSS):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `elss.json`; adversarial cases in `calculations.elss.test.js` (min ₹500, tenure 3–50, null inputs). LTCG/STCG golden aligned with `tests/fixtures/regulatory/ltcg-exemptions.json` (3-year ELSS holding threshold). `@tax` rows (`ELSS-03`, `ELSS-14`, `ELSS-22`, `ELSS-23`): `caReviewed: false` pending CA sign-off. **Gap:** ELSS-23 STCG scenario uses tenure=2 which fails schema validation in UI — Gherkin documents tax math; UI blocks input below 3 years (lock-in enforced at form level).

**I3 notes (ELSS):** `@smoke` + `@regression` Gherkin green for executable scenarios. Vitest unit/integration/component green. Step defs in `elss.steps.js`. Mutation spot-check on `calculateSIPFutureValue` / `calculateCompoundInterest` + `calculateTaxOnWithdrawal` (`elss` branch) recommended (nightly).

## RD — Recurring Deposit

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| RD-01 | `tests/features/calculators/rd.feature` | — | — | — | done | n/a |
| RD-02 | `rd.feature` | — | — | `rd.integration.test.jsx` | done | n/a |
| RD-03 | `rd.feature` | `rd.json#RD-03` | `calculations.rd.test.js` | `rd.integration.test.jsx` | done | false |
| RD-04 | `rd.feature` | `rd.json#RD-03` | — | — | done | false |
| RD-05 | `rd.feature` | `rd.json#RD-14` | — | — | done | n/a |
| RD-06 | `rd.feature` | `rd.json#RD-14` | — | `rd.integration.test.jsx` | done | n/a |
| RD-07 | `rd.feature` | — | — | — | done | n/a |
| RD-08 | `rd.feature` | `rd.json#RD-08` | `calculations.rd.test.js` | `RDCalculator.test.jsx` | done | n/a |
| RD-09 | `rd.feature` | — | — | `RDCalculator.test.jsx` | done | n/a |
| RD-10 | `rd.feature` | `rd.json#RD-10` | `calculations.rd.test.js` | `RDCalculator.test.jsx` | done | n/a |
| RD-11 | `rd.feature` | — | — | `RDCalculator.test.jsx` | done | n/a |
| RD-12 | `rd.feature` | — | — | `RDCalculator.test.jsx` | done | n/a |
| RD-13 | `rd.feature` | `rd.json#RD-13` | `calculations.rd.test.js` | — | done | n/a |
| RD-14 | `rd.feature` | `rd.json#RD-14` | `calculations.rd.test.js` | `rd.integration.test.jsx` | done | false |
| RD-15 | `rd.feature` | — | — | `RDCalculator.test.jsx` | done | n/a |
| RD-20 | `rd.feature` | `rd.json#RD-20` | `calculations.rd.test.js` | `rd.integration.test.jsx` | done | n/a |
| RD-21 | `rd.feature` | `rd.json#RD-21` | `calculations.rd.test.js` | — | done | n/a |
| RD-22 | `rd.feature` | `rd.json#RD-22` | `calculations.rd.test.js` | — | done | false |
| RD-23 | `rd.feature` | — | — | — | specified | false |
| RD-24 | `rd.feature` | — | — | — | specified | false |
| RD-25 | `rd.feature` | — | — | — | specified | n/a |
| RD-CMP | — | `rd.json#RD-CMP` | `calculations.rd.test.js` | — | done | n/a |

**I1 notes (RD):** §8.4 checklist passed — scenario IDs match golden JSON, tolerances documented, adversarial cases in `calculations.rd.test.js`. `@tax` rows (RD-03, RD-14, RD-22) reference slab logic — `caReviewed: false` pending CA sign-off. **Gap:** RD-23/24 TDS not implemented in `taxCalculations.js` for RD instrument (only FD/SCSS); scenarios tagged `@wip`. RD-25 premature withdrawal not implemented.

**I3 notes (RD):** `@smoke` + `@regression` Gherkin green (excl. `@wip`). Mutation spot-check on `calculateRD` deferred to nightly Stryker.

<!-- W2–W6 sections added by parallel workstreams -->

## EQ — Equity (Direct Stocks)

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| EQ-01 | `tests/features/calculators/equity.feature` | — | — | `equity.integration.test.jsx` | done | n/a |
| EQ-02 | `equity.feature` | — | — | `equity.integration.test.jsx` | done | n/a |
| EQ-03 | `equity.feature` | `equity.json#EQ-14` | — | `equity.integration.test.jsx` | done | false |
| EQ-04 | `equity.feature` | — | — | `equity.integration.test.jsx` | done | n/a |
| EQ-05 | `equity.feature` | — | — | — | done | n/a |
| EQ-06 | `equity.feature` | — | — | — | done | n/a |
| EQ-07 | `equity.feature` | — | — | — | done | n/a |
| EQ-08 | `equity.feature` | `equity.json#EQ-08` | `calculations.equity.test.js` | `equity.integration.test.jsx` | done | n/a |
| EQ-09 | `equity.feature` | — | `calculations.equity.test.js` | `EquityCalculator.test.jsx` | done | n/a |
| EQ-10 | `equity.feature` | `equity.json#EQ-10` | `calculations.equity.test.js` | — | done | n/a |
| EQ-11 | `equity.feature` | — | — | — | done | n/a |
| EQ-12 | `equity.feature` | — | — | — | done | n/a |
| EQ-13 | `equity.feature` | `equity.json#EQ-13` | `calculations.equity.test.js` | — | done | n/a |
| EQ-14 | `equity.feature` | `equity.json#EQ-14` | `calculations.equity.test.js` | `equity.integration.test.jsx` | done | false |
| EQ-15 | `equity.feature` | — | — | `EquityCalculator.test.jsx` | done | n/a |
| EQ-20 | `equity.feature` | `equity.json#EQ-20-SIP`, `EQ-20-LUMPSUM` | `calculations.equity.test.js` | `equity.integration.test.jsx` | done | n/a |
| EQ-21 | `equity.feature` | `equity.json#EQ-21` | `calculations.equity.test.js` | `EquityCalculator.test.jsx` | done | n/a |
| EQ-22 | `equity.feature` | `equity.json#EQ-22` | `calculations.equity.test.js` | `equity.integration.test.jsx` | done | false |
| EQ-22-STCG | — | `equity.json#EQ-22-STCG` | `calculations.equity.test.js` | — | done | false |
| EQ-23 | `equity.feature` | — | — | `equity.integration.test.jsx` | done | n/a |
| EQ-24 | `equity.feature` | — | `calculations.equity.test.js` | — | specified | false |
| EQ-25 | `equity.feature` | — | — | — | specified | n/a |
| EQ-BD-TENURE-50 | — | `equity.json#EQ-BD-TENURE-50` | `calculations.equity.test.js` | — | done | n/a |

**I1 notes (EQ):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `equity.json`; adversarial cases in `calculations.equity.test.js` (min ₹500, tenure 50, null inputs, LTCG/STCG boundary). LTCG/STCG golden aligned with `tests/fixtures/regulatory/ltcg-exemptions.json`. `@tax` rows (`EQ-03`, `EQ-14`, `EQ-22`, `EQ-22-STCG`): `caReviewed: false` pending CA sign-off. **Gap:** UI tenure is integer years (min 1) — STCG (EQ-22-STCG) verified in unit/hook layer; EQ-24 `@wip` documents UI limitation.

**I3 notes (EQ):** `@smoke` + `@regression` Gherkin green (EQ-24/EQ-25 `@wip` skipped). Step defs in `equity.steps.js`; lazy-load wait on page Given. Mutation spot-check on `calculateSIPFutureValue` / `calculateStepUpSIP` / `calculateCompoundInterest` recommended (nightly).

## 54EC — Capital Gain Bonds

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| 54EC-01 | `tests/features/calculators/54ec.feature` | — | — | `54ec.integration.test.jsx` | done | n/a |
| 54EC-02 | `54ec.feature` | — | `calculations.54ec.test.js` | `54ec.integration.test.jsx` | done | n/a |
| 54EC-03 | `54ec.feature` | `54ec.json#54EC-03` | `calculations.54ec.test.js` | `54ec.integration.test.jsx` | done | false |
| 54EC-04 | `54ec.feature` | — | — | — | done | n/a |
| 54EC-05 | `54ec.feature` | — | — | — | done | n/a |
| 54EC-06 | `54ec.feature` | — | — | `54ec.integration.test.jsx` | done | n/a |
| 54EC-07 | `54ec.feature` | — | — | — | done | n/a |
| 54EC-08 | `54ec.feature` | `54ec.json#54EC-08` | `calculations.54ec.test.js` | — | done | n/a |
| 54EC-09 | `54ec.feature` | `54ec.json#54EC-09` | `calculations.54ec.test.js` | — | done | n/a |
| 54EC-10 | `54ec.feature` | — | `calculations.54ec.test.js` | — | done | n/a |
| 54EC-11 | `54ec.feature` | — | — | — | done | n/a |
| 54EC-12 | `54ec.feature` | — | — | — | done | n/a |
| 54EC-13 | `54ec.feature` | — | — | — | done | n/a |
| 54EC-14 | `54ec.feature` | `54ec.json#54EC-14` | `calculations.54ec.test.js` | `54ec.integration.test.jsx` | done | false |
| 54EC-15 | `54ec.feature` | — | — | — | done | n/a |
| 54EC-20 | `54ec.feature` | `54ec.json#54EC-20` | `calculations.54ec.test.js` | `54ec.integration.test.jsx` | done | n/a |
| 54EC-21 | `54ec.feature` | `54ec.json#54EC-21` | `calculations.54ec.test.js` | — | done | false |
| 54EC-22 | `54ec.feature` | `54ec.json#54EC-22` | `calculations.54ec.test.js` | — | done | false |

**I1 notes (54EC):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented (`54EC-14` ±50, `54EC-21` ±100). Fixed 5-year lock-in verified in UI + hook evolution length. Capital gains exemption (`54EC-21`) and interest-only taxation (`54EC-03`, `54EC-22`) aligned with `taxCalculations.js` bonds54EC branch. `@tax` rows: `caReviewed: false` pending CA sign-off. Schema max ₹50L per FY enforced via custom validation + UI slider cap.

**I3 notes (54EC):** `@smoke` + `@regression` Gherkin targeted green. Step defs in `54ec.steps.js`. Mutation spot-check on `calculateCompoundInterest` / `calculateTaxOnWithdrawal` bonds54EC branch recommended (nightly).

## SCSS — Senior Citizens Savings Scheme

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| SCSS-01 | `tests/features/calculators/scss.feature` | — | — | `scss.integration.test.jsx` | done | n/a |
| SCSS-02 | `scss.feature` | — | — | `scss.integration.test.jsx` | done | n/a |
| SCSS-03 | `scss.feature` | `scss.json#SCSS-03` | `calculations.scss.test.js` | `scss.integration.test.jsx` | done | false |
| SCSS-04 | `scss.feature` | `scss.json#SCSS-03` | — | — | done | false |
| SCSS-05 | `scss.feature` | `scss.json#SCSS-14` | — | — | done | n/a |
| SCSS-06 | `scss.feature` | — | — | `scss.integration.test.jsx` | done | n/a |
| SCSS-07 | `scss.feature` | — | — | `SCSSCalculator.test.jsx` | done | n/a |
| SCSS-08 | `scss.feature` | `scss.json#SCSS-08` | `calculations.scss.test.js` | — | done | n/a |
| SCSS-09 | `scss.feature` | — | — | — | done | n/a |
| SCSS-10 | `scss.feature` | — | — | — | done | n/a |
| SCSS-11 | `scss.feature` | — | — | — | done | n/a |
| SCSS-12 | `scss.feature` | — | — | — | done | n/a |
| SCSS-13 | `scss.feature` | `scss.json#SCSS-14-max` | — | — | done | n/a |
| SCSS-14 | `scss.feature` | `scss.json#SCSS-14`, `SCSS-14-max` | `calculations.scss.test.js` | `scss.integration.test.jsx` | done | false |
| SCSS-15 | `scss.feature` | — | — | `SCSSCalculator.test.jsx` | done | n/a |
| SCSS-20 | `scss.feature` | `scss.json#SCSS-20` | `calculations.scss.test.js` | `scss.integration.test.jsx` | done | n/a |
| SCSS-21 | `scss.feature` | `scss.json#SCSS-21` | `calculations.scss.test.js` | `scss.integration.test.jsx` | done | n/a |
| SCSS-22 | `scss.feature` | `scss.json#SCSS-22` | `calculations.scss.test.js` | `scss.integration.test.jsx` | done | n/a |
| SCSS-23 | `scss.feature` | `scss.json#SCSS-23` | `calculations.scss.test.js` | — | done | false |
| SCSS-25 | `scss.feature` | — | — | — | specified | n/a |

**I1 notes (SCSS):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `scss.json`; adversarial cases in `calculations.scss.test.js` (null principal, zero tenure, age 59 gate). `@tax` rows (`SCSS-03`, `SCSS-14`, `SCSS-23`): interest taxed per income slab + TDS display — `caReviewed: false` pending CA sign-off. **Gap:** TDS threshold in `taxCalculations.js` uses ₹40K flat (regulatory fixture notes ₹50K for SCSS seniors); SCSS-23 verifies current code behavior. **Gap:** SCSS-25 `@wip` skipped in runner.

**I3 notes (SCSS):** `@smoke` + `@regression` Gherkin green (excl. `@wip` SCSS-25). Step defs in `scss.steps.js`. Mutation spot-check on `useSCSSCalculator` formula recommended (nightly).

## SSY — Sukanya Samriddhi Yojana

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| SSY-01 | `tests/features/calculators/ssy.feature` | — | — | `ssy.integration.test.jsx` | done | n/a |
| SSY-02 | `ssy.feature` | — | — | `ssy.integration.test.jsx` | done | n/a |
| SSY-03 | `ssy.feature` | — | — | `SSYCalculator.test.jsx` | done | n/a |
| SSY-04 | `ssy.feature` | — | — | — | done | n/a |
| SSY-05 | `ssy.feature` | — | — | — | done | n/a |
| SSY-06 | `ssy.feature` | — | — | `SSYCalculator.test.jsx` | done | n/a |
| SSY-07 | `ssy.feature` | — | — | `SSYCalculator.test.jsx` | done | n/a |
| SSY-08 | `ssy.feature` | — | `calculations.ssy.test.js` | `SSYCalculator.test.jsx` | done | n/a |
| SSY-09 | `ssy.feature` | — | `calculations.ssy.test.js` | `SSYCalculator.test.jsx` | done | n/a |
| SSY-10 | `ssy.feature` | — | `calculations.ssy.test.js` | — | done | n/a |
| SSY-11 | `ssy.feature` | — | `calculations.ssy.test.js` | — | done | n/a |
| SSY-12 | `ssy.feature` | — | — | — | done | n/a |
| SSY-13 | `ssy.feature` | — | — | — | done | n/a |
| SSY-14 | `ssy.feature` | `ssy.json#SSY-14`, `SSY-14-max` | `calculations.ssy.test.js` | `ssy.integration.test.jsx` | done | false |
| SSY-15 | `ssy.feature` | — | — | — | done | n/a |
| SSY-20 | `ssy.feature` | `ssy.json#SSY-20` | `calculations.ssy.test.js` | `SSYCalculator.test.jsx` | done | n/a |
| SSY-21 | `ssy.feature` | `ssy.json#SSY-21` | `calculations.ssy.test.js` | `SSYCalculator.test.jsx` | done | n/a |
| SSY-22 | `ssy.feature` | `ssy.json#SSY-22` | `calculations.ssy.test.js` | `ssy.integration.test.jsx` | done | n/a |
| SSY-23 | `ssy.feature` | `ssy.json#SSY-23` | `calculations.ssy.test.js` | `ssy.integration.test.jsx` | done | false |

**I1 notes (SSY):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented (`SSY-14` ±50, `SSY-14-max` ±100). Age < 10 gate and 21-year maturity (`21 - girlsAge`) verified in unit + integration. EEE post-tax equals nominal verified in unit + integration. `caReviewed: false` on SSY-14/SSY-23 (pending CA sign-off).

**I3 notes (SSY):** `@smoke` + `@regression` Gherkin green. Step defs in `ssy.steps.js`. Mutation spot-check on `calculatePPF` / `useSSYCalculator` tenure loop recommended (nightly).

## POMIS — Post Office Monthly Income Scheme

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| POMIS-01 | `tests/features/calculators/pomis.feature` | — | — | — | done | n/a |
| POMIS-02 | `pomis.feature` | — | — | `pomis.integration.test.jsx` | done | n/a |
| POMIS-03 | `pomis.feature` | `pomis.json#POMIS-03` | `calculations.pomis.test.js` | `pomis.integration.test.jsx` | done | false |
| POMIS-04 | `pomis.feature` | `pomis.json#POMIS-03` | — | — | done | false |
| POMIS-05 | `pomis.feature` | `pomis.json#POMIS-14` | — | — | done | n/a |
| POMIS-06 | `pomis.feature` | — | `calculations.pomis.test.js` | `pomis.integration.test.jsx` | done | n/a |
| POMIS-07 | `pomis.feature` | — | — | — | done | n/a |
| POMIS-08 | `pomis.feature` | `pomis.json#POMIS-08` | `calculations.pomis.test.js` | — | done | n/a |
| POMIS-09 | `pomis.feature` | — | — | — | done | n/a |
| POMIS-10 | `pomis.feature` | — | — | — | done | n/a |
| POMIS-11 | `pomis.feature` | — | — | — | done | n/a |
| POMIS-12 | `pomis.feature` | — | — | — | done | n/a |
| POMIS-13 | `pomis.feature` | `pomis.json#POMIS-13` | `calculations.pomis.test.js` | — | done | n/a |
| POMIS-14 | `pomis.feature` | `pomis.json#POMIS-14` | `calculations.pomis.test.js` | `pomis.integration.test.jsx` | done | false |
| POMIS-15 | `pomis.feature` | — | — | — | done | n/a |
| POMIS-20 | `pomis.feature` | `pomis.json#POMIS-20` | `calculations.pomis.test.js` | — | done | n/a |
| POMIS-21 | `pomis.feature` | `pomis.json#POMIS-21` | `calculations.pomis.test.js` | `pomis.integration.test.jsx` | done | n/a |
| POMIS-22 | `pomis.feature` | `pomis.json#POMIS-22-SINGLE`, `POMIS-22-JOINT` | `calculations.pomis.test.js` | — | done | n/a |
| POMIS-TDS | `pomis.feature` | `pomis.json#POMIS-TDS` | `calculations.pomis.test.js` | `pomis.integration.test.jsx` | done | false |

**I1 notes (POMIS):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `pomis.json`; adversarial cases in `calculations.pomis.test.js` (null principal, sub-min rate, zero principal). `@tax` rows (`POMIS-03`, `POMIS-14`, `POMIS-TDS`): interest taxed per income slab — `caReviewed: false` pending CA sign-off. **Gap:** `pomisSchema` max is ₹15L globally; single-account ₹9L cap enforced in hook/UI only (POMIS-09 documents empty-state behavior). **Gap:** TDS display uses ₹40K threshold (not senior ₹50K variant).

**I3 notes (POMIS):** `@smoke` + `@regression` Gherkin targeted green. Step defs in `pomis.steps.js`. Mutation spot-check on `calculatePOMIS` recommended (nightly).

## ETF — Exchange Traded Funds

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| ETF-01 | `tests/features/calculators/etf.feature` | — | — | — | done | n/a |
| ETF-02 | `etf.feature` | — | — | `etf.integration.test.jsx` | done | n/a |
| ETF-03 | `etf.feature` | `etf.json#ETF-14` | — | `etf.integration.test.jsx` | done | false |
| ETF-04 | `etf.feature` | — | — | `etf.integration.test.jsx` | done | n/a |
| ETF-05 | `etf.feature` | — | — | — | done | n/a |
| ETF-06 | `etf.feature` | — | — | — | done | n/a |
| ETF-07 | `etf.feature` | — | — | — | done | n/a |
| ETF-08 | `etf.feature` | `etf.json#ETF-08` | `calculations.etf.test.js` | `etf.integration.test.jsx` | done | n/a |
| ETF-09 | `etf.feature` | — | `calculations.etf.test.js` | — | done | n/a |
| ETF-10 | `etf.feature` | `etf.json#ETF-10` | `calculations.etf.test.js` | — | done | n/a |
| ETF-11 | `etf.feature` | — | — | — | done | n/a |
| ETF-12 | `etf.feature` | — | — | — | done | n/a |
| ETF-13 | `etf.feature` | `etf.json#ETF-13` | `calculations.etf.test.js` | — | done | n/a |
| ETF-14 | `etf.feature` | `etf.json#ETF-14`, `ETF-22` | `calculations.etf.test.js` | `etf.integration.test.jsx` | done | false |
| ETF-15 | `etf.feature` | — | — | — | done | n/a |
| ETF-20 | `etf.feature` | `etf.json#ETF-22-*` | `calculations.etf.test.js` | `etf.integration.test.jsx` | done | n/a |
| ETF-21 | `etf.feature` | `etf.json#ETF-20-*`, `ETF-21` | `calculations.etf.test.js` | `etf.integration.test.jsx` | done | n/a |
| ETF-22 | `etf.feature` | `etf.json#ETF-23-EXPENSE*` | `calculations.etf.test.js` | `etf.integration.test.jsx` | done | n/a |
| ETF-23 | `etf.feature` | `etf.json#ETF-22` | `calculations.etf.test.js` | `etf.integration.test.jsx` | done | false |
| ETF-22-STCG | — | `etf.json#ETF-22-STCG` | `calculations.etf.test.js` | — | done | false |
| ETF-BD-TENURE-50 | — | `etf.json#ETF-BD-TENURE-50` | `calculations.etf.test.js` | — | done | n/a |

**T1 matrix notes (ETF):** Amount ₹500–₹1L SIP / ₹1Cr lumpsum; tenure 1–50 years; CAGR 0–30% (defaults by type: equity 12%, debt 7%, gold 8%, international 10%); expense ratio 0–2% (default 0.20%); net return = CAGR − expense ratio; tax: equity/international → equity rules (12.5% LTCG above ₹1.25L, 20% STCG); debt/gold → debtMutualFund rules (20% indexed LTCG after 3y, slab STCG).

**I1 notes (ETF):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `etf.json`; adversarial cases in `calculations.etf.test.js` (min ₹500, expense max 2%, tenure 50, null inputs). LTCG/STCG golden aligned with `tests/fixtures/regulatory/ltcg-exemptions.json` (12.5%/20%, ₹1.25L exemption). `@tax` rows (`ETF-03`, `ETF-14`, `ETF-22`, `ETF-23`, `ETF-22-STCG`): `caReviewed: false` pending CA sign-off. **Gap:** ETF-23-STCG `@wip` skipped in Gherkin — UI tenure min 1 year; STCG covered in unit layer.

**I3 notes (ETF):** `@smoke` + `@regression` Gherkin green (excl. `@wip`). Step defs in `etf.steps.js`. Mutation spot-check on `useETFCalculator` net-rate + expense deduction recommended (nightly).

## DMF — Debt Mutual Fund

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| DMF-01 | `tests/features/calculators/debt-mutual-fund.feature` | — | — | — | done | n/a |
| DMF-02 | `debt-mutual-fund.feature` | — | — | `debt-mutual-fund.integration.test.jsx` | done | n/a |
| DMF-03 | `debt-mutual-fund.feature` | `debt-mutual-fund.json#DMF-14` | — | `debt-mutual-fund.integration.test.jsx` | done | false |
| DMF-04 | `debt-mutual-fund.feature` | — | — | — | done | n/a |
| DMF-05 | `debt-mutual-fund.feature` | — | — | — | done | n/a |
| DMF-06 | `debt-mutual-fund.feature` | — | — | — | done | n/a |
| DMF-07 | `debt-mutual-fund.feature` | — | — | — | done | n/a |
| DMF-08 | `debt-mutual-fund.feature` | `debt-mutual-fund.json#DMF-08` | `calculations.debt-mutual-fund.test.js` | — | done | n/a |
| DMF-09 | `debt-mutual-fund.feature` | — | `calculations.debt-mutual-fund.test.js` | — | done | n/a |
| DMF-10 | `debt-mutual-fund.feature` | `debt-mutual-fund.json#DMF-10` | `calculations.debt-mutual-fund.test.js` | — | done | n/a |
| DMF-11 | `debt-mutual-fund.feature` | — | `calculations.debt-mutual-fund.test.js` | — | done | n/a |
| DMF-12 | `debt-mutual-fund.feature` | — | — | — | done | n/a |
| DMF-13 | `debt-mutual-fund.feature` | — | `calculations.debt-mutual-fund.test.js` | — | done | n/a |
| DMF-14 | `debt-mutual-fund.feature` | `debt-mutual-fund.json#DMF-14`, `DMF-20` | `calculations.debt-mutual-fund.test.js` | `debt-mutual-fund.integration.test.jsx` | done | false |
| DMF-15 | `debt-mutual-fund.feature` | — | — | — | done | n/a |
| DMF-20 | `debt-mutual-fund.feature` | `debt-mutual-fund.json#DMF-20` | `calculations.debt-mutual-fund.test.js` | `debt-mutual-fund.integration.test.jsx` | done | false |
| DMF-21 | `debt-mutual-fund.feature` | `debt-mutual-fund.json#DMF-21-STCG`, `DMF-21-LTCG` | `calculations.debt-mutual-fund.test.js` | `debt-mutual-fund.integration.test.jsx` | done | false |
| DMF-22 | `debt-mutual-fund.feature` | `debt-mutual-fund.json#DMF-22-SIP`, `DMF-22-LUMPSUM` | `calculations.debt-mutual-fund.test.js` | — | done | n/a |

**I1 notes (DMF):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented (`DMF-14` ±50, `DMF-20` ±50). 3-year LTCG boundary (`tenure >= 3` → indexed LTCG; `< 3` → income slab STCG) verified in unit + integration. Indexation uses simplified 6% factor in `taxCalculations.js` (not CII table in tax layer). `@tax` rows reference `ltcg-exemptions.json` — `caReviewed: false` pending CA sign-off.

**I3 notes (DMF):** `@smoke` + `@regression` Gherkin targeted green. Step defs in `debt-mutual-fund.steps.js`. Mutation spot-check on `calculateTaxOnWithdrawal` ltcg_indexed branch recommended (nightly). UI indexation display uses `ciiCalculations` (may differ from tax simplification).

## SGB — Sovereign Gold Bonds

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| SGB-01 | `tests/features/calculators/sgb.feature` | — | — | `sgb.integration.test.jsx` | done | n/a |
| SGB-02 | `sgb.feature` | — | — | `sgb.integration.test.jsx` | done | n/a |
| SGB-03 | `sgb.feature` | `sgb.json#SGB-14` | — | `sgb.integration.test.jsx` | done | false |
| SGB-04 | `sgb.feature` | `sgb.json#SGB-26` | — | — | done | false |
| SGB-05 | `sgb.feature` | `sgb.json#SGB-14` | — | — | done | n/a |
| SGB-06 | `sgb.feature` | — | `calculations.sgb.test.js` | — | done | n/a |
| SGB-07 | `sgb.feature` | — | — | — | done | n/a |
| SGB-08 | `sgb.feature` | — | `calculations.sgb.test.js` | — | done | n/a |
| SGB-09 | `sgb.feature` | — | `calculations.sgb.test.js` | — | done | n/a |
| SGB-10 | `sgb.feature` | — | `calculations.sgb.test.js` | — | done | n/a |
| SGB-11 | `sgb.feature` | — | `calculations.sgb.test.js` | — | done | n/a |
| SGB-12 | `sgb.feature` | — | — | — | done | n/a |
| SGB-13 | `sgb.feature` | — | — | — | done | n/a |
| SGB-14 | `sgb.feature` | `sgb.json#SGB-14`, `SGB-14-5y` | `calculations.sgb.test.js` | `sgb.integration.test.jsx` | done | false |
| SGB-15 | `sgb.feature` | — | — | — | done | n/a |
| SGB-20 | `sgb.feature` | `sgb.json#SGB-20` | `calculations.sgb.test.js` | `sgb.integration.test.jsx` | done | n/a |
| SGB-21 | `sgb.feature` | `sgb.json#SGB-21` | `calculations.sgb.test.js` | — | done | n/a |
| SGB-22 | `sgb.feature` | — | — | — | reviewed | n/a |
| SGB-23 | `sgb.feature` | `sgb.json#SGB-23` | `calculations.sgb.test.js` | `sgb.integration.test.jsx` | done | n/a |
| SGB-25 | `sgb.feature` | — | — | — | done | n/a |
| SGB-26 | `sgb.feature` | `sgb.json#SGB-26` | `calculations.sgb.test.js` | `sgb.integration.test.jsx` | done | false |

**I1 notes (SGB):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `sgb.json` (±100 standard, ±150 for SGB-20 large principal). Gold price deterministic via mocked `goldPriceService` at ₹6500/g (FALLBACK). `@tax` rows (`SGB-03`, `SGB-14`, `SGB-26`): capital gains exempt at maturity per `ltcg-exemptions.json` — `caReviewed: false` pending CA sign-off. **Gap:** SGB-24 rate-limit scenario deferred (localStorage-dependent); SGB interest annual tax simplified to zero at withdrawal.

**I3 notes (SGB):** `@smoke` + `@regression` Gherkin green (excl. deferred SGB-24, conditional skip SGB-22 without `VITE_GOLDAPI_KEY`). Step defs in `sgb.steps.js`. Gold API mocked via Playwright route intercept (SGB-22/23/25) and vitest module mock in integration. Mutation spot-check on `calculateSGB` recommended (nightly).

## REIT — Real Estate Investment Trusts

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| REIT-01 | `tests/features/calculators/reits.feature` | — | — | `reits.integration.test.jsx` | done | n/a |
| REIT-02 | `reits.feature` | — | — | `reits.integration.test.jsx` | done | n/a |
| REIT-03 | `reits.feature` | `reits.json#REIT-03` | `calculations.reits.test.js` | `reits.integration.test.jsx` | done | false |
| REIT-04 | `reits.feature` | `reits.json#REIT-03` | — | — | done | false |
| REIT-05 | `reits.feature` | `reits.json#REIT-14` | — | — | done | n/a |
| REIT-06 | `reits.feature` | — | — | `reits.integration.test.jsx` | done | n/a |
| REIT-07 | `reits.feature` | — | — | — | done | n/a |
| REIT-08 | `reits.feature` | `reits.json#REIT-08` | `calculations.reits.test.js` | — | done | n/a |
| REIT-09 | `reits.feature` | `reits.json#REIT-09` | `calculations.reits.test.js` | — | done | n/a |
| REIT-10 | `reits.feature` | — | `calculations.reits.test.js` | — | done | n/a |
| REIT-11 | `reits.feature` | — | — | — | done | n/a |
| REIT-12 | `reits.feature` | — | — | — | done | n/a |
| REIT-13 | `reits.feature` | `reits.json#REIT-13` | `calculations.reits.test.js` | — | done | n/a |
| REIT-14 | `reits.feature` | `reits.json#REIT-14`, `REIT-03` | `calculations.reits.test.js` | `reits.integration.test.jsx` | done | false |
| REIT-15 | `reits.feature` | — | — | — | done | n/a |
| REIT-20 | `reits.feature` | `reits.json#REIT-20` | `calculations.reits.test.js` | `reits.integration.test.jsx` | done | n/a |
| REIT-21 | `reits.feature` | `reits.json#REIT-21-LTCG` | `calculations.reits.test.js` | — | done | false |
| REIT-21-STCG | — | `reits.json#REIT-21-STCG` | `calculations.reits.test.js` | — | done | false |
| REIT-BD-MIN | — | `reits.json#REIT-BD-MIN` | `calculations.reits.test.js` | `reits.integration.test.jsx` | done | n/a |

**I1 notes (REIT):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `reits.json` (±50 standard, ±500 for large corpus, ±5000 for REIT-13). Dividend + appreciation model uses year-wise reinvestment in `useREITsCalculator`; `totalCapitalGain` tracks geometric appreciation on principal only. LTCG/STCG aligned with `tests/fixtures/regulatory/ltcg-exemptions.json` (12.5% / 20%, ₹1.25L exemption). `@tax` rows (`REIT-03`, `REIT-14`, `REIT-21-LTCG`, `REIT-21-STCG`): `caReviewed: false` pending CA sign-off. **Gap:** Annual dividend income tax not modeled at withdrawal (known limitation per `OPEN_ISSUES.md`); withdrawal tax applies to total returns only. **Gap:** REIT-21 STCG `@wip` in Gherkin — UI tenure min 1 year; STCG covered in unit layer.

**I3 notes (REIT):** `@smoke` + `@regression` Gherkin targeted green (excl. `@wip` REIT-21 STCG). Step defs in `reits.steps.js`. Vitest unit/integration green. Mutation spot-check on `useREITsCalculator` / `calculateTaxOnWithdrawal` reits branch recommended (nightly).

## NPS — National Pension System

| ID | Feature | Golden | Unit | Integration | Status | caReviewed |
|----|---------|--------|------|-------------|--------|------------|
| NPS-01 | `tests/features/calculators/nps.feature` | — | — | `nps.integration.test.jsx` | done | n/a |
| NPS-02 | `nps.feature` | — | — | `nps.integration.test.jsx` | done | n/a |
| NPS-03 | `nps.feature` | `nps.json#NPS-03` | `calculations.nps.test.js` | `nps.integration.test.jsx` | done | false |
| NPS-04 | `nps.feature` | `nps.json#NPS-03` | — | — | done | false |
| NPS-05 | `nps.feature` | `nps.json#NPS-14` | — | — | done | n/a |
| NPS-06 | `nps.feature` | — | `calculations.nps.test.js` | `nps.integration.test.jsx` | done | n/a |
| NPS-07 | `nps.feature` | — | — | `NPSCalculator.test.jsx` | done | n/a |
| NPS-08 | `nps.feature` | `nps.json#NPS-08` | `calculations.nps.test.js` | `NPSCalculator.test.jsx` | done | n/a |
| NPS-09 | `nps.feature` | — | — | `NPSCalculator.test.jsx` | done | n/a |
| NPS-10 | `nps.feature` | — | — | — | done | n/a |
| NPS-11 | `nps.feature` | — | `calculations.nps.test.js` | `NPSCalculator.test.jsx` | done | n/a |
| NPS-12 | `nps.feature` | — | — | — | done | n/a |
| NPS-13 | `nps.feature` | `nps.json#NPS-13` | `calculations.nps.test.js` | — | done | n/a |
| NPS-14 | `nps.feature` | `nps.json#NPS-14` | `calculations.nps.test.js` | `nps.integration.test.jsx` | done | false |
| NPS-15 | `nps.feature` | — | — | `NPSCalculator.test.jsx` | done | n/a |
| NPS-20 | `nps.feature` | `nps.json#NPS-20` | `calculations.nps.test.js` | `nps.integration.test.jsx` | done | n/a |
| NPS-21 | `nps.feature` | `nps.json#NPS-21` | `calculations.nps.test.js` | `nps.integration.test.jsx` | done | n/a |
| NPS-22 | `nps.feature` | `nps.json#NPS-22` | `calculations.nps.test.js` | `NPSCalculator.test.jsx` | done | false |
| NPS-23 | `nps.feature` | — | — | — | specified | n/a |
| NPS-24 | `nps.feature` | `nps.json#NPS-24` | `calculations.nps.test.js` | — | done | n/a |

**I1 notes (NPS):** §8.4 checklist passed — scenario IDs match golden JSON; tolerances documented in `nps.json`; adversarial cases in `calculations.nps.test.js` (min ₹500, allocation ≠100%, null/zero inputs, negative returns). `@tax` rows (`NPS-03`, `NPS-14`, `NPS-22`): 60% tax-free / 40% taxable per `taxCalculations.js` partial branch — aligned with `tests/fixtures/regulatory/tax-slabs-fy2025-26.json` defaultEffectiveRate 0.30; `caReviewed: false` pending CA sign-off. **Gap:** NPS-23 Tier 2 `@wip` skipped in runner. Weighted return not displayed in results panel — verified via hook/unit and corpus golden match in Gherkin.

**I3 notes (NPS):** `@smoke` + `@regression` Gherkin green (excl. `@wip` NPS-23). Step defs in `nps.steps.js`. Mutation spot-check on `calculateNPSWeightedReturn` / `calculateNPSFutureValue` / `calculateTaxOnWithdrawal` nps branch recommended (nightly).

