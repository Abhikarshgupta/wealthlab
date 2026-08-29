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

