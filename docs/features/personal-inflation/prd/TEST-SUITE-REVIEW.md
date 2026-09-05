# Personal inflation — test suite review (T2/T3 completion)

**Status:** Complete (29 Aug 2026). All audit items addressed in spec. I2 implementation not started.

**Sources:** [T1-TEST-PLAN.md](T1-TEST-PLAN.md), engine/questionnaire/results PRDs, audit from session `7e540982`.

---

## Completion checklist

| # | Audit finding | Resolution | Layer |
| --- | --- | --- | --- |
| 1 | PI-26 mix tilts not asserted (cartesian only checks invariants) | `modifierExpectations.js` + `PI-26` per-trigger unit tests + `2plus > school_1` | Unit |
| 2 | PI-27 education cap | Unit: sandwich + overlay forces education ≤ 22, jewellery 0 | Unit |
| 3 | PI-32 usual/sitting frozen π | Unit: sitting vs reset on rent; usual CAM unchanged | Unit |
| 4 | PI-34 pet → residual not health | Unit via `CHAPTER2_TRIGGERS` pet row | Unit |
| 5 | PI-35 ride-hail mix only | Unit via ridehail trigger + no motor beat unless car | Unit + beats |
| 6 | PI-44 clamp surplus → residual | Unit adversarial stack modifiers | Unit |
| 7 | PI-45 residual floor steal + warnings | Unit overlay extreme shares | Unit |
| 8 | PI-48 vintage JSON bump | Unit `ratesVintage` option + stable account ids | Unit |
| 9 | PI-50 classification refuse | Unit overlay jewellery/invalid keys rejected | Unit |
| 10 | PI-61 why-not-12 beside hero | Gherkin + integration | Gherkin / Integration |
| 11 | PI-63 nested after-tax slab | Gherkin + integration | Gherkin / Integration |
| 12 | PI-66 start over clears overlay | Gherkin + integration (store contract) | Gherkin / Integration |
| 13 | PI-68 one column ~640px | Integration `max-w-2xl` + independent drawers | Integration |
| 14 | PI-82 no CII/DA/Residex write | Unit `applyYourEstimate` + integration localStorage keys | Unit / Integration |
| 15 | PI-07 EMI helper Gherkin | `questionnaire.feature` PI-07 | Gherkin |
| 16 | PI-03 geo unit | `personalInflationGeo.test.js` | Unit |
| 17 | PI-04 / PI-08 / PI-09 integration | `personal-inflation.integration.test.jsx` | Integration |
| 18 | PI-10 Gherkin unlocks | `questionnaire.feature` PI-10 | Gherkin |
| 19 | PI-14 persist / start over | `system.feature` PI-14 + PI-SYS-04 | Gherkin / Unit |
| 20 | PI-65 owner no rent row | `results.feature` outline renter vs owner | Gherkin |
| 21 | PI-80 apply without cheating | Integration: button only, no manual `applyYourEstimate` in test body | Integration |
| 22 | PI-83 history from UI path | Integration seeds completion + `saveInflationRun` contract | Integration |
| 23 | PI-62 arithmetic bug | Fixed: hero 6.6 − hike 12 = **+5.4** (not +4) | Gherkin / Integration |
| 24 | Adversarial JSON unused | All `PI-ADV-*` wired in `personalInflation.engine.test.js` | Unit |
| 25 | Missing goldens (school sandwich, overlay 32→40) | `PI-69`, `PI-40` rows in golden JSON | Golden |
| 26 | TRACEABILITY drift | Full PI table updated in `tests/TRACEABILITY.md` | Doc |
| 27 | PI-06 only chapter 1 | Integration walks Ch 1–3 | Integration |
| 28 | PI-SYS-07 no navigation | Integration navigates away and back | Integration |
| 29 | PI-SYS-08 in TRACEABILITY | Added | Doc |
| 30 | Contribution / geo-fallback warnings | Unit PI-47 extended + overlay >15pp warning | Unit |

---

## RED until I2 (expected)

- `computePersonalInflation`, `applyYourEstimate`, `saveInflationRun`, `listInflationHistory` throw `PI-ENGINE-UNIMPLEMENTED`
- `usePersonalInflationStore.setOverlay` — contract test **PI-SYS-03** (store API not implemented)
- Page 4 hero, raise math UI, bills drawer, apply button wiring — integration/Gherkin **PI-60+** fail on stub

---

## Minimum pack (skill)

| Layer | Required | Actual |
| --- | --- | --- |
| Gherkin scenarios | ≥7 | 4 features, 30+ scenarios |
| Unit tests | ≥7 | 4 files, 60+ cases |
| Integration | ≥3 | 25+ cases |
| Golden rows | ≥5 | 9 rows |

---

## Smoke slice (T1)

PI-01, PI-09, PI-20, PI-23, PI-60, PI-62, PI-80 — all specified; engine/results smoke **RED** until I2.
