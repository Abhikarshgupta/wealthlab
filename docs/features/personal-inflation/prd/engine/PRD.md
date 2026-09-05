# Engine PRD (V0)

**Status:** draft for implementation + results-page handoff.  
**Job:** turn questionnaire **persona** `{ geo, roof, who, commute, dining, cam, care, prem*, lived }` into two labelled πs, a 100% ledger, and an optional **share overlay**.  
**Vintage:** CPI **July 2026 provisional** unless ingest bumps the month. Engine reads **versioned JSON in repo**, not a live MoSPI fetch.

**Does not:** run the interview, ask ₹ or %, call lived seeds MoSPI, feed CII/DA/Residex, splice 2012 CPI groups onto 2024 divisions.

Questionnaire contract: [../questionnaire/PRD.md](../questionnaire/PRD.md) §3, §10. Rates vs shares: [../../research/inflation-vs-weights.md](../../research/inflation-vs-weights.md). Audit locks: [../../research/audit/findings.md](../../research/audit/findings.md) §2.2, §3, §6.

---

## 1. What this machine is (CA view)

Two books, **one chart of accounts**. Identity: `Σ w = 100%`.

| Book | Symbol | Rate column | Mix `w` |
| --- | --- | --- | --- |
| Statutory | `pi_official_weighted` | MoSPI / State Urban group YoY | Persona (+ overlay) |
| Management | `pi_your_estimate` | Same, except jumped/reset lines → **labelled lived seeds** | **Same** `w` |

```
π = Σ_i w_i × π_i
```

`w_i` = **share of the consumption basket** (annualised), not rupees, not this month’s UPI, not EMI/SIP/gold. Two households with the same mix get the same π at ₹15k or ₹60k rent.

**Default housing book is cash COLI** (SIP): owners/EMI have `w` on 04.1 = **0**; renters have cash rent share. MoSPI imputes owner rent — that is **Variant A**, footnote only, never the applied default, never silent.

**Pipeline (strict order)**

1. Load vintage rates + urban base pie (JSON).  
2. Resolve `geo.stateUt` → contrast headlines; resolve `π_i` (V0 fallback in §5).  
3. Pick roof **template**.  
4. Apply Chapter 2 **modifiers** (pp).  
5. Strip jewellery.  
6. Clamp + renormalise → `w_engine`.  
7. Build official `π_i` vector.  
8. Build estimate `π_i` vector (lived + premia slices).  
9. `pi_official_weighted`, `pi_your_estimate`, per-line attribution.  
10. If user edited shares and/or flagged rates: overlay (§9) → recompute 7–9 (`lived` **flags** unchanged).

Chapters 1–3 never see sliders. Overlay is **after** first results.

---

## 2. Chart of accounts (ledger)

Every questionnaire control maps to **at least one** row (mix and/or rate). No row is “Division Pet.”

| `accountId` | MoSPI (official `π_i`) | In official pie? | Slider later? |
| --- | --- | --- | --- |
| `food` | 01.1 Urban (CFPI/food group) | yes | yes |
| `rent` | 04.1 Urban | yes; **0** if owner/EMI | yes if `roof = rent`; else **locked 0** |
| `dwelling` | 04.3 Urban | yes | yes (CAM / society / dwelling services) |
| `utilities` | 04 fuels / electricity / water as published (fold 04.4–04.5 if ingested; else urban 04 residual after 04.1+04.3) | yes | yes |
| `help` | 05.6 Urban | yes | yes |
| `health_care` | 06 Urban | yes | yes |
| `health_prem` | *none — Div 12 weight 0* | **always 0** on official | **no** (derived from flags) |
| `motor_run` | 07.2 Urban | yes | yes |
| `passenger` | 07.3 Urban | yes | yes |
| `vehicles` | 07.1 Combined −4.37 | **0** in cash COLI | **no** |
| `education` | 10 Urban | yes | yes |
| `restaurants` | 11.1 Urban | yes | yes |
| `pet` | *none — not a MoSPI pet index* | mix when `who.pet`; official π uses residual **3.96** | yes if pet |
| `residual` | Urban remainder **ex 13.2** (clothing, comms, recreation, other 05, personal care, …) | yes | yes (slack) |
| `jewellery` | 13.2 | **0** on both SIP πs | **no** |
| `motor_prem` | *none — Div 12* | **always 0** on official | **no** |

`health_prem` / `motor_prem` exist only on **your estimate**, and only when the matching jump flag is on. They are disclosed memorandum slices, not MoSPI 06 / 07.2.

**Do not** put 07.1 vehicle purchase, gold, EMI, or MF TER in `residual`.

---

## 3. Inputs (from questionnaire only)

Stable ids — [questionnaire PRD §10](../questionnaire/PRD.md). Engine does not invent fields.

```text
geo:        { cityId, stateUt }
roof:       rent | own_no_emi | emi
who:        { school: none | 1 | 2plus, coaching, elder, help, pet }
commute:    car | ridehail_transit | mix
dining:     home | regular_out | out_and_travel
cam:        no | yes
care:       public_esi | private
premRetail: bool
premJump:   [] | subset of { self, child, elder }

lived:
  rent:         sitting | reset | null
  cam:          usual | jumped | null
  schoolFees:   usual | jumped | null
  coachingFees: usual | jumped | null
  elderCare:    usual | jumped | null
  helpCosts:    usual | jumped | null
  petCosts:     usual | jumped | null
  motorPrem:    usual | jumped | null
```

**Invalid combos (engine must repair, not crash):** `lived.rent` non-null only if `roof = rent`; school flags only if `who.school ≠ none`; etc. Null the orphan lived key; do not apply the seed.

---

## 4. Base pie (urban, cash COLI)

### 4.1 Method (ingest must follow)

1. Take CPI 2024 **urban contribution** weights (Annexure 5.3a-style). Urban is **~44.58%** of Combined — **never** treat Combined urban *contribution* (e.g. housing 11.15) as percent of an urban basket.  
2. `w_urban_i = urban_contrib_i / Σ urban_contrib`.  
3. **HCES 2023-24** urban MPCE shares are **priors for tilts**, not a second π: food **39.68%**, education **5.97%**, medical **5.85%**, conveyance **8.46%**, cash rent **6.58%**. Cash rent 6.58% is **all urban including owners** — too low for a renter template.  
4. Cash COLI: owners/EMI → move **04.1 mass to `residual`**; keep `dwelling` + `utilities`. Label it.  
5. Jewellery mass → `residual` (strip). 07.1 mass → `residual` (not a COLI driver).

Until full urban 12-div JSON exists, use the **V0 freeze tables below**. Replace tables when ingest lands; **keep modifier pp, caps, and cash-COLI rules**.

### 4.2 V0 freeze — `owner_cash` (`own_no_emi` and `emi` — identical)

Jul-2026-shaped urban cash COLI prior. `rent` = 0.

| account | `w` % |
| --- | --- |
| `food` | 34 |
| `rent` | 0 |
| `dwelling` | 4 |
| `utilities` | 8 |
| `help` | 2 |
| `health_care` | 6 |
| `health_prem` | 0 |
| `motor_run` | 6 |
| `passenger` | 4 |
| `vehicles` | 0 |
| `education` | 5 |
| `restaurants` | 4 |
| `pet` | 0 |
| `residual` | 27 |
| `jewellery` | 0 |
| `motor_prem` | 0 |

Sum = 100. High `residual` is the **imputed-rent hole** plus other urban groups — intentional, labelled on results.

### 4.3 V0 freeze — `renter`

| account | `w` % |
| --- | --- |
| `food` | 30 |
| `rent` | 32 |
| `dwelling` | 4 |
| `utilities` | 7 |
| `help` | 2 |
| `health_care` | 5 |
| `health_prem` | 0 |
| `motor_run` | 3 |
| `passenger` | 6 |
| `vehicles` | 0 |
| `education` | 4 |
| `restaurants` | 4 |
| `pet` | 0 |
| `residual` | 3 |
| `jewellery` | 0 |
| `motor_prem` | 0 |

`rent` 32 sits in the questionnaire band **high-20s–40s**. HCES 6.58% is **not** this template.

### 4.4 Variant A (footnote, not default)

`pi_official_imputed`: same persona **except** owners/EMI keep urban-rescaled **04.1** (do not zero). Never write this to `generalInflationRate` unless the user explicitly picks it on results (UX PRD). Copy: *MoSPI imputes rent for owners; we do not use that for SIP by default.*

---

## 5. Official `π_i` (Jul 2026 P) and geography fallback

Defaults — questionnaire §5. Engine JSON overrides when ingest updates.

| account | Official Urban YoY % | Combined (sources column only) |
| --- | --- | --- |
| Headline contrast | all-India Urban **3.96** | Combined **4.45** |
| `food` | 01.1 **5.05** | CFPI **5.52** |
| `rent` | 04.1 **1.96** | 2.11 |
| `dwelling` | 04.3 **3.18** | 3.40 |
| `utilities` | use Housing div **1.98** until 04.4/04.5 ingested | 2.16 |
| `help` | 05.6 **1.77** | 1.87 |
| `health_care` | 06 **1.37** | 1.34 |
| `motor_run` | 07.2 **7.37** | 7.36 |
| `passenger` | 07.3 **3.01** | 2.90 |
| `education` | 10 **4.17** | 3.64 |
| `restaurants` | 11.1 **7.71** | 7.75 |
| `residual` | Div 13 Urban if ingested **ex 13.2**; else all-India Urban **3.96** | — |
| `jewellery` | unused (`w` = 0) | 13.2 Combined **43.54** — never in SIP π |

**Geography**

- Contrast chip: Combined, all-India Urban, **this** `stateUt` Urban **headline** (Annexure III). No NE dummy. Guwahati = Assam Urban (Jul **2.53** vs Urban **3.96**).  
- Personal-mix `π_i`: **State/UT Urban division** YoY when JSON has it.  
- **V0 fallback:** all-India **Urban group** YoYs above + State Urban **headline** as geography only. Never use Combined group rates for the personal mix. Never invent a city CPI.

`naive_mean` and listing/Aon/WPI/HPI prints are **sources UI**, never unlabeled official `π_i`.

---

## 6. Chapter 2 modifiers (`w` only)

Apply **after** template, **before** clamp. Deltas are **percentage points**. Then §8.

Kids do **not** stack π. Two children = more education **share**. `school_1` and `school_2plus` are exclusive in the persona.

| Trigger | Account | Δ pp | Notes |
| --- | --- | --- | --- |
| `who.school = 1` | `education` | +4 | |
| `who.school = 2plus` | `education` | +8 | not +4 then +8 |
| `who.coaching` | `education` | +3 | on top of school if both |
| `who.elder` | `health_care` | +3 | |
| `who.help` | `help` | +4 | |
| `who.pet` | `pet` | +10 from food | visible row; estimate π **5**; not health CPI |
| `commute = car` | `motor_run` +6, `passenger` −3 | FASTag/PUC/petrol inside 07.2 |
| `commute = ridehail_transit` | `passenger` +8, `motor_run` −4 | no Ola index |
| `commute = mix` | none | urban transport as template |
| `dining = regular_out` | `restaurants` | +4 | no Swiggy index |
| `dining = out_and_travel` | `restaurants` +4, `passenger` +3 | |
| `dining = home` | none | |
| `cam = yes` | `dwelling` | +4 | jump is Chapter 3 |
| `care = private` | `health_care` | +2 | NSS: urban private is majority; modest tilt only |
| `premRetail` | none on official | estimate slice in §7 |

If a Δ would drive an account below 0, set 0 and continue (clamp will repair).

---

## 7. Lived seeds (`π_i` on your estimate only)

When Chapter 3 is **`usual` / `sitting`**: that line’s `π_i` = official on **both** books.  
When **`jumped` / `reset`**: swap **that account only** on **your estimate**. Official-weighted **unchanged**.

| Flag | Account | Official stays | Lived seed % | Label |
| --- | --- | --- | --- | --- |
| `lived.rent = reset` | `rent` | 1.96 | **12** | listing/asking midpoint; **not** 04.1; **not** Residex/HPI |
| `lived.cam = jumped` | `dwelling` | 3.18 | **8** | not 04.3 |
| `schoolFees` and/or `coachingFees` jumped | `education` | 4.17 | **8** | **one** rate if both jumped |
| `lived.elderCare = jumped` | `health_care` | 1.37 | **10.8** | OOPE/private care seed; not Div 06 |
| `lived.helpCosts = jumped` | `help` | 1.77 | **8** | not 05.6 |
| any `premJump` | `health_prem` | n/a (`w`=0 official) | **10.8** | (IRDAI FY25 ~9 + Aon ~12.5) / 2; **not** 06 |
| `lived.motorPrem = jumped` | `motor_prem` | n/a | **10** | pending IRDAI motor table in ingest; **not** 07.2; **not** WPI 32.4 |

**Premium slices in the 100% pie (estimate only)**

After `w_engine` is frozen (or after overlay):

- If `premJump.length > 0`: set `health_prem` = **2** pp, subtract from `residual` then `food` if residual < 2. Official book keeps `health_prem` = 0 (those 2 pp stay in residual/food).  
- If `motorPrem = jumped`: set `motor_prem` = **1.5** pp, subtract from `motor_run` (floor 1). Official: `motor_prem` = 0, mass stays in `motor_run`.  
- `premRetail` with empty `premJump`: **no** slice, official-weighted unchanged (questionnaire accept).

Do not swap `motor_run` to WPI mineral oils. Do not put premia into Div 06 official.

---

## 8. Caps, clamp, renormalise

### 8.1 Caps (after modifiers, before overlay)

| account | min % | max % |
| --- | --- | --- |
| `food` | 6 | 55 |
| `rent` (renter) | 12 | **45** |
| `rent` (owner/EMI) | 0 | **0** |
| `dwelling` | 1 | 12 |
| `utilities` | 3 | 18 |
| `help` | 0 | 10 |
| `health_care` | 2 | 14 |
| `motor_run` | 0 | 18 |
| `passenger` | 0 | 22 |
| `education` | 2 | **22** |
| `restaurants` | 1 | 14 |
| `pet` | 0 | 25 |
| `residual` | 2 | 45 |
| `jewellery` | 0 | 0 |
| `health_prem` / `motor_prem` | 0 | 4 / 3 |

If clamp hits max, **do not** leak into `jewellery`. Surplus goes to `residual` (then food if residual at max).

### 8.2 Renormalise

1. Zero `jewellery`, `vehicles`.  
2. Clamp each account.  
3. If `roof ≠ rent`, force `rent` = 0.  
4. Scale all **unlocked** accounts so sum = 100. Locked zeros stay 0.  
5. Weights are **whole %** that **re-sum to 100** (largest remainder to `residual`). Never negative.  
6. Overflow dumps in order: restaurants → passenger → motor_run → utilities → dwelling → help → food → education → health → premia → rent → residual → **pet last**. Residual never goes below 0 (floor 2 when possible). If still short, `warnings[]`.

---

## 9. Post-result overlay

**Not in Chapters 1–3.** First paint uses `w_engine` and seed `π_i`. Results is number boxes ([results PRD](../results/PRD.md)).

| Rule | Spec |
| --- | --- |
| Mix | `w` on visible bills. Slack = residual. Silent floors (never labelled). |
| Went up | `pi_i_estimate` on **any** visible account, 1–25 silent. Prefill: jumped → seed, else official. Official `π_i` **frozen**. |
| Recompute | Your inflation from current `w` × estimate rates. Comparison book stays published rates. |
| Reset | One “start over from your answers.” |

Layout: sticky number + one bill list. No two workbenches.

---

## 10. Outputs (results + apply contract)

```text
vintage:              { month: "2026-07", status: "provisional" }
geo:                  { cityId, stateUt }
w:                    { [accountId]: number }   // 100%
w_source:             engine | user_overlay
pi_source:            seeds | user_rate_overlay
pi_i_official:        { [accountId]: number }
pi_i_estimate:        { [accountId]: number }
contribution_official:{ [accountId]: w * π }    // pp of headline
contribution_estimate:{ [accountId]: w * π }
pi_official_weighted: number
pi_your_estimate:     number
pi_official_imputed:  number | null            // Variant A; owners only
contrast:             { combined, allIndiaUrban, stateUrbanHeadline }
warnings:             string[]                 // clamp, fallback geo, overlay cap
flags_applied:        { ...lived, premJump }   // echo for copy
```

**Apply (opt-in):** write **`pi_your_estimate`** to `generalInflationRate` / `InflationToggle`. Do not silently write official-weighted. Do not write Variant A. 6% WealthLab default remains a **planning convention**, not this engine ([findings](../../research/audit/findings.md) §3.4).

Display π at **1 decimal** (e.g. 4.5). Attribution at 1 decimal pp.

---

## 11. Guardrails

### 11.1 Must

- `Σ w = 100%` after every step that changes mix.  
- `emi` mix **identical** to `own_no_emi`.  
- Official-weighted: **only** MoSPI/State Urban (or V0 Urban-group fallback).  
- Your estimate: lived seeds **only** on flagged accounts; every such number labelled **not MoSPI**.  
- Jewellery **stripped** from both SIP πs.  
- Div 12: premia **never** in official-weighted.  
- Cash COLI default labelled vs imputed.  
- Persona without overlay still produces a full breakdown (`w_i`, `π_i`, contribution).  
- Versioned JSON; month in output.  
- Orphan lived keys ignored.  
- School + coaching jumped → **one** education lived rate.

### 11.2 Must not

- Rupees, income, PAN, ages, Q-LIFE, tier question, live geocode, live CPI scrape.  
- Combined-contribution weights as urban pie.  
- All-India Combined group YoY as personal-mix `π_i`.  
- Listing 12 / Aon / IRDAI / Residex / HPI / WPI / IESH as official lines.  
- EMI, SIP, gold, term, stamp, brokerage as `w`.  
- Boost `residual` into 13.2.  
- Stack per-child π.  
- Double-count school and coaching as two education rates.  
- Swap 07.2 to WPI 32.4.  
- `reset` changing official 04.1.  
- `prem_retail` without jump changing official-weighted.  
- Overlay changing **flags**, or estimate `π_i` on a **usual** line, or any official `π_i`.  
- Overlay estimate rates **outside** the results band (e.g. rent 2% after `reset`).  
- Owner slider raising `rent`.  
- Apply personal π to **CII**, capital gains, DA, or Residex.  
- Copy that CPI is fake.  
- Ship overlay that does not re-sum to 100.

### 11.3 Sanity (warn, still show)

| Check | Warn if |
| --- | --- |
| `pi_your_estimate` | &lt; 0 or &gt; 18 |
| `pi_official_weighted` | &lt; 0 or &gt; 10 (Jul 2026-like vintage) |
| Overlay vs engine | any account moved &gt; 15 pp |
| Geo | using Urban-group fallback (not State division) |

Warnings are UI chips, not silent clamps of π to 6.

### 11.4 Classification (reject into `w`)

| User might mean | Engine |
| --- | --- |
| Home-loan EMI | tenure only; already in roof |
| MF/SIP, gold coins | out |
| Sitting vs new lease | `π` on `rent`, not extra `w` |
| Motor/health **premium** jump | premia slice on estimate |
| Pet food / vet | `pet` account (~10% mix, 5% on your estimate), not health 06 |
| “Misc” | `residual` ex jewellery |

### 11.5 Questionnaire mapping (nothing orphaned)

| Persona | Mix | Rate (estimate) |
| --- | --- | --- |
| geo | — | table key / contrast |
| roof rent / own / emi | template | — |
| CAM yes | `dwelling` ↑ | jumped → 8 |
| school / coaching / elder / help / pet | §6 | Chapter 3 as unlocked |
| commute / dining / care | §6 | motor prem only if `car` + jumped |
| premJump | 2 pp slice estimate | 10.8 |
| Q-CARE alone | modest health `w` | no π swap |

If a future control cannot fill this table, it does not ship.

---

## 12. Acceptance

- Quiet path (own, no kids, home, mix, ESI, prem none, cam no): Chapter 3 = care + prem only; `pi_your_estimate` ≈ `pi_official_weighted` (rounding).  
- Renter + `reset`: official 04.1 stays ~1.96; estimate rent line 12; headline gap visible in attribution.  
- `emi` vs `own_no_emi`: identical `w` and both πs.  
- Sandwich school + elder: both tilts; education cap holds.  
- Pet + ride-hail renter: `residual` and `passenger` up vs owner-car template; jewellery still 0.  
- Overlay: change rent 32 → 40, residual absorbs; both πs move; flags unchanged.  
- JSON month bump without code change to ids.

---

## 13. Out of this PRD

Results layout, apply CTA, history of last 10, header chip, choice floors — **[results PRD](../results/PRD.md)**. Ingest/legal for GODL vs website, eSankhyiki process — **ingest PRD**. This file owns the **output JSON** those PRDs consume.

---

## Changelog

| Date | Change |
| --- | --- |
| 29 Aug 2026 | First engine PRD: ledger, V0 pies, modifiers, lived resolver, premia slices, overlay, guardrails, output contract. |
| 29 Aug 2026 | Overlay: mix `w` plus estimate-rate bands on jumped lines (results PRD). Official π frozen. |
