# Questionnaire

**Superseded for product wording:** [../prd/questionnaire/PRD.md](../prd/questionnaire/PRD.md). This file is the research ancestor.

Persona bucket → default `w` and lived flags. **Not** a budget. See [decision.md](decision.md) and the PRD.

## Geography

**City** (list) → State/UT Urban rates. Else **state**.  
Do **not** ask tier. Copy after: “Karnataka urban rates, not a Bengaluru index.”

## Persona (low friction)

**Roof:** `own_no_emi | rent | emi`  
**Who it covers:** `self_or_couple | one_school_child | twoplus_school_children | senior_or_coaching_or_college | elder_in_care`  
**Health:** `mostly_public_or_esi | private_care_or_retail_health_insurance`  
**Upgrades / foreign:** `rarely | yearly | often` → `L` only (not in applied π).

Optional seed: **largest cost in the mix** as a *category* (rent / education / health / help / dining_travel / other) — sets a share slider, not rupees.

## After answers: sliders (the actuals)

- **Share sliders** (`w`), sum 100%, caps so one line cannot be everything.  
- **Rate sliders** on flagged lines (e.g. my rent YoY, default = MoSPI 04.1). User can set **10%**. That updates **your estimate** only.

Do **not** ask monthly outflow ₹ bands.

## Mapping

| Answer | Official `π_i` | Default `w` | Rate slider offered |
| --- | --- | --- | --- |
| City / state | State Urban table | Published urban pie | — |
| Rent | MoSPI 04.1 until override | Housing share up | Rent YoY |
| Own, no EMI | Same table | Cash housing share down | — |
| Kids / coaching | Unchanged | Education share up | Education YoY if coaching |
| Private health | Unchanged | Health share modest up | Health / premium lived |
| Q6 often | Unchanged | — | Not in applied π |

Exact percents in engine PRD.
