# Regulatory fixtures (DS-3)

Authoritative tax and regulatory reference data for **test expected values**.  
Application code may simplify rules; golden outputs must align with this data unless tagged `@known-bug`.

## Files

| File | Purpose |
|------|---------|
| `tax-slabs-fy2024-25.json` | Income tax slabs FY 2024-25 (historical; AY 2025-26) |
| `tax-slabs-fy2025-26.json` | Income tax slabs FY 2025-26 (current; AY 2026-27) |
| `ltcg-exemptions.json` | LTCG/STCG rates, ₹1.25L equity exemption, debt indexation |
| `tds-thresholds.json` | TDS limits for FD, SCSS, POMIS, NSC |

## Sources & review

| Field | Value |
|-------|-------|
| Current financial year | 2025-26 (AY 2026-27) |
| Last reviewed | 2026-08-29 |
| Primary sources | Union Budget 2024 (112A LTCG), Budget 2025 (194A TDS, slabs), MoF small savings notifications |

## CA sign-off process (P7)

1. **QA** proposes expected tax outputs using DS-3 + external calculator/spreadsheet.
2. **CA / domain expert** reviews `@tax` golden rows and signs off in `tests/TRACEABILITY.md` (`caReviewed` column).
3. **Engineering** does not change golden `expected` values without QA + CA approval.
4. **Budget updates:** bump `lastReviewed`, open a regulatory PR, re-run `@tax` suite.

Sign-off record template in TRACEABILITY:

```
| Scenario ID | caReviewed | reviewer | date |
| FD-14       | pending    | —        | —    |
```

## Usage in tests

```js
import taxSlabs from '../../fixtures/regulatory/tax-slabs-fy2024-25.json'
import tds from '../../fixtures/regulatory/tds-thresholds.json'

const fdLimit = tds.thresholds.fd_interest.annualInterestLimit // 40000
```

Gherkin `@tax` Examples must be validated against these files — not hand-typed in isolation.
