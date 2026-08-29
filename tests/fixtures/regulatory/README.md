# Regulatory fixtures (DS-3)

Authoritative tax and regulatory reference data for **test expected values**.  
Application code may simplify rules; golden outputs must align with this data unless tagged `@known-bug`.

## Files

| File | Purpose |
|------|---------|
| `tax-slabs-fy2024-25.json` | Income tax slabs (new/old regime), cess, app mapping |
| `ltcg-exemptions.json` | LTCG/STCG rates, ₹1L equity exemption, debt indexation |
| `tds-thresholds.json` | TDS limits for FD, SCSS, POMIS, NSC |

## Sources & review

| Field | Value |
|-------|-------|
| Financial year | 2024-25 (AY 2025-26) |
| Last reviewed | 2026-07-25 |
| Primary sources | Income Tax Act, Union Budget 2024, Section 112A / 194A |

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
