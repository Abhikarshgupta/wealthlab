# Questionnaire PRD (V0)

**Status:** draft for engine handoff.  
**Job:** a corpus-style **interview** (radios, chips, selects only) that emits a **persona** `{ w` templates, lived flags, geo `}`. The engine turns that into official-weighted π and **your estimate**. This phase has **no sliders**.

**Vintage for numbers below:** CPI **July 2026 provisional** unless noted — [category-rates.md](../../research/category-rates.md). Engine must read **versioned JSON in repo**, not a live MoSPI fetch. When ingest updates the month, copy updates; ids and flags in this PRD stay.

**Audience:** listed metros / colloquial T1–3. Not rural. Not “CPI is fake.” [scope-urban-metros.md](../../research/audit/scope-urban-metros.md).

---

## 1. Layers (what the form is allowed to build)

| Layer | Formula | Questionnaire’s job |
| --- | --- | --- |
| Contrast | Published Combined + all-India Urban headlines | City → which **State Urban** to show beside them |
| **Official-weighted** | `Σ w_i × π_i^MoSPI` | Set **`w`** (mix). All `π_i` stay MoSPI / State Urban. **Never** listing, Aon, IRDAI, Residex, HPI. |
| **Your estimate** (apply to calculators) | Same `w`, **swap `π_i`** only on lines with a **jumped / reset** flag | Set **flags**. Engine applies **preset lived seeds** (labelled). |

`w` always sums to 100% (caps in engine). Rupees never enter. [inflation-vs-weights.md](../../research/inflation-vs-weights.md).

**Rule for every control:** finish the sentence *“we ask because you said ___.”* If you cannot, drop it.

---

## 2. Information architecture (like corpus)

Not five disconnected questions + optional extras. Not a census. Not one radio per full-page.

Corpus: Step 1 picks instruments → Step 2 is **only those** fields. Same here.

```
Ch 1  Place          always     city / state select
Ch 2  This household always     roof + who + how we live (mix)
Ch 3  What moved     always     beats **generated from Ch 2** (lived rates)
     → results                 two πs; apply your estimate
```

Chapter 3 is **not skippable**. A quiet household still answers a short health block; each unlocked beat includes **usual / no jump** as a real answer.

**Controls:** searchable select, radio, multi-select chips. **Zero sliders / steppers / ₹ fields** in these chapters.

**Data in source code (not live):**

- City list + `stateUt` + optional product `tier` (internal, never asked).
- State/UT fallback list.
- CPI tables: versioned JSON committed in repo (human ingest). [mospi-cpi.md](../../research/mospi-cpi.md).

---

## 3. Audit locks (do not reopen in engine)

[findings.md](../../research/audit/findings.md) §3, §6; [lived-vs-official.md](../../research/lived-vs-official.md).

| Topic | Lock |
| --- | --- |
| Tier | Never ask. City → State Urban. |
| ₹ bands / Q-LIFE | **Dropped.** Lifestyle (bigger fridge) is not π. Foreign **fees** = education chip + jumped, not a holiday question. |
| EMI | Tenure only. **Same cash housing `w` as own-no-EMI.** Not a Div 04 hike. |
| Owner housing | Default SIP = **cash COLI** (rent 0, keep 04.3 / utilities). Label it. Variant A (imputed / MoSPI-consistent) is results footnote, not the form default. Never silent-zero. |
| Div 12 | Weight **0**. Health/motor **premia** never enter official-weighted. |
| Jewellery 13.2 | **Cap/strip** in any π used for SIP (Jul Combined 13.2 **43.54**). No question that boosts misc because they “spend more.” |
| Kids | Share up, **not** stacked pp. Sandwich = multi-select. |
| Overlays | 8–14% medical/education/rent/maid are **not** MoSPI. Lived seeds only on **your estimate**, labelled. |
| NE | No dummy overlay. Guwahati = Assam Urban (Jul Urban **2.53** vs all-India Urban **3.96**). |

---

## 4. Hardcoded geography

**City record (code):** `{ id, name, stateUt, tier? }`. `tier` unused by the engine for π.

**Must ship** (expand today’s `CITIES` in `purchasingPowerExamples.js` — that file has no `stateUt` yet):

| `id` (example) | Name | `stateUt` (MoSPI table key) |
| --- | --- | --- |
| `new-delhi` | New Delhi | Delhi |
| `mumbai` | Mumbai | Maharashtra |
| `chennai` | Chennai | Tamil Nadu |
| `kolkata` | Kolkata | West Bengal |
| `bangalore` | Bengaluru | Karnataka |
| `pune` | Pune | Maharashtra |
| `hyderabad` | Hyderabad | Telangana |
| `ahmedabad` | Ahmedabad | Gujarat |
| `indore` | Indore | Madhya Pradesh |
| `guwahati` | Guwahati | Assam |
| `kochi` | Kochi | Kerala |
| `chandigarh` | Chandigarh | Chandigarh |
| `jammu` | Jammu | Jammu & Kashmir |
| `lucknow` | Lucknow | Uttar Pradesh |
| `kota` | Kota | Rajasthan |
| `vadodara` | Vadodara | Gujarat |

If city missing: State/UT select; still Urban. No `rest`.

**Copy after pick:** `We use {stateUt} urban CPI, not a {city} index.`

**Contrast (results, not a question):** Combined Jul **4.45**; all-India Urban **3.96**; **this** State Urban headline (Annexure III), e.g. Karnataka Urban **4.37**, UP Urban **3.62**, Assam Urban **2.53**. Personal mix `π_i` = **State/UT Urban division** YoYs when ingested; until item/division State series exist, use **all-India Urban group YoYs** + State Urban **headline** as the geography chip — engine PRD states the fallback explicitly.

---

## 5. Official `π_i` (engine defaults — Jul 2026 P)

Official-weighted uses **these** (Urban where given). Do not use Combined-contribution weights as the urban pie ([findings](../../research/audit/findings.md) §2.2).

| Line | MoSPI id | Urban YoY | Combined YoY |
| --- | --- | --- | --- |
| Headline | — | **3.96** | **4.45** |
| CFPI / food 01.1 | 01.1 | 5.05 (food) | **5.52** |
| Actual rents | **04.1** | **1.96** | 2.11 |
| Housing div | 04 | **1.98** | 2.16 |
| Maintenance / security | **04.3** | **3.18** | 3.40 |
| HH maintenance / help (sampled) | **05.6** | **1.77** | 1.87 |
| Health div | **06** | **1.37** | 1.34 |
| Transport div | 07 | **4.37** | 4.43 |
| Personal transport (fuel, service) | **07.2** | **7.37** | 7.36 |
| Purchase of vehicles | 07.1 | — | **−4.37** (not a COLI driver) |
| Passenger transport | **07.3** | **3.01** | 2.90 |
| Education div | **10** | **4.17** | 3.64 |
| Restaurants | **11.1** | **7.71** | 7.75 |
| Insurance / financial | **12** | **n/a — weight 0** | — |
| Jewellery / other personal effects | 13.2 | — | **43.54** (strip/cap for SIP) |

**HCES 2023-24 urban MPCE shares** (priors for `w`, not π): food **39.68%**, education **5.97%**, medical **5.85%**, conveyance **8.46%**, **rent 6.58%**. CPI Combined weights: food 36.75, housing 17.66, health 6.10, education 3.33, transport 8.80 — **rescale to urban-only** in engine; do not treat 11.15 housing contrib as 11% of the urban basket.

**Cash COLI housing (owners / EMI):** `w` on 04.1 **= 0**; keep 04.3 + fuel/utilities share from urban template. **Renters:** 04.1 share **up** vs 6.58% (often the largest cash line — engine cap so it cannot be 100%).

---

## 6. Lived seeds (your estimate only)

When a Chapter 3 answer is **`usual`**: that line’s `π_i` stays MoSPI (same as official-weighted).  
When **`jumped` / `reset`**: swap **that line only** to the seed below. Label: **not MoSPI**.

| Flag | Official line (unchanged in official-weighted) | Lived `π_i` seed | Source (labelled) |
| --- | --- | --- | --- |
| `rent` = `reset` | 04.1 Urban **1.96** | **12** | Listing/asking midpoint 8–15; **not** 04.1; **not** Residex/HPI +3.6 |
| `schoolFees` / `coachingFees` = `jumped` | 10 Urban **4.17** | **8** | Lived fee/coaching seed; **not** Div 10; old “8–10% education CPI” overlay is banned on official |
| `premJump` any role | 06 stays **1.37** in official-weighted | **10.8** on a **premium** slice, not Div 06 | (IRDAI FY25 ~9 + Aon ~12.5) / 2; Div **12 = 0** |
| `elderCare` = `jumped` | 06 Urban **1.37** | **10.8** on health **care** slice (OOPE / private) | Same lived health seed; still not MoSPI 06 |
| `helpCosts` = `jumped` | 05.6 Urban **1.77** | **8** | Lived help wages; **not** 05.6 |
| `cam` = `jumped` | 04.3 Urban **3.18** | **8** | Lived society/CAM; **not** 04.3 |
| `motorPrem` = `jumped` | 07.2 stays official in official-weighted | Engine: lived motor-premium seed (IRDAI motor; **not** in category-rates yet) | Div 12 hole, same pattern as health prem |

Premium slices: [engine PRD](../engine/PRD.md) §7. Questionnaire only emits flags + roles.

---

## 7. Chapter 1 — Place

**Q-PLACE**  
Label: **Which city do you live in?**  
Control: searchable select from hardcoded list; else **Which state or UT?**

**Maps:** `geo.cityId`, `geo.stateUt` → rate table key. **`w` unchanged.**

**Must not:** metro/T1/T2/T3 question; live geocode; All-India Urban as personal-mix default once State Urban divisions exist.

---

## 8. Chapter 2 — This household (mix)

One screen, two blocks. This is corpus “instrument select.”

### Q-ROOF

Label: **How do you occupy this home?**

| id | Label | `w` | Official `π_i` | Unlocks Ch 3 |
| --- | --- | --- | --- | --- |
| `rent` | I rent | Template **renter**: 04.1 share **up** vs HCES 6.58% (engine: high-20s–40s %, capped) | 04.1 Urban **1.96** (or State 04.1) | **Q-LEASE**, **Q-CAM** |
| `own_no_emi` | I own it, no home loan | Template **owner_cash**: 04.1 **0**; 04.3 + utilities from urban pie | 04.3 **3.18**, fuels as published | **Q-CAM** |
| `emi` | I have a home-loan EMI | **Identical `w` to `own_no_emi`** | Same | **Q-CAM** |

Helper on `emi`: EMI is loan repayment, not a price.  
Helper on own: Official CPI imputes rent; we start from cash housing for SIP.

**Findings:** §3.1 cash COLI vs imputed; §3.2 EMI ≠ housing π.

### Q-WHO

Label: **Who does this household’s spending cover?**  
Helper: **Select all that apply.** Residual = just me/us.

| id | Label | `w` (engine: +pp / cap; kids do not stack π) | Unlocks Ch 3 |
| --- | --- | --- | --- |
| `school_1` | One school-age child | Education **up** from HCES 5.97% | **Q-SCHOOL** |
| `school_2plus` | Two or more school-age children | Education **up more** than `school_1` | **Q-SCHOOL** |
| `coaching_or_college` | Coaching, college, or professional course | Education **up** (on top of school if both) | **Q-COACH** |
| `elder_in_care` | An elder we support or care for | Health **modest up** from 5.85% | **Q-ELDER**; premium chip **parent** if retail |
| `help_paid` | We pay for household help, nanny, or creche | 05.6 share **up** | **Q-HELP** |
| `pet` | We have a pet | Pet care **~10%** of living; estimate rise **~5%** | **Q-PET** |

`school_1` ⊕ `school_2plus` exclusive. Sandwich allowed.

**Premium roles later:** `self` always available if `prem_retail`; `child` iff school or coaching; `elder` iff `elder_in_care`.

### Q-COMMUTE (always)

Label: **How do you usually get around?**

| id | Label | `w` | Official `π_i` | Unlocks |
| --- | --- | --- | --- | --- |
| `car` | Mostly a car we run | 07.2 share **up** (HCES conveyance 8.46% as prior) | 07.2 Urban **7.37** | **Q-MOTOR** (premium jumped) |
| `ridehail_transit` | Mostly ride-hail, metro, or bus | 07.3 share **up**; 07.2 down vs `car` | 07.3 Urban **3.01** | none (mix; no Ola index) |
| `mix` | Mix | Urban transport template | 07 Urban **4.37** | **Q-MOTOR** only if we treat mix as “has a car” — **V0: Q-MOTOR only for `car`** |

FASTag, PUC, parking, petrol: **inside `car`**, not extra questions.

### Q-DINING (always)

Label: **Eating out, ordering in, and trips?**

| id | Label | `w` | Official `π_i` | Unlocks |
| --- | --- | --- | --- | --- |
| `home` | Mostly home cooking | Restaurants at urban template | 11.1 **7.71** | none |
| `regular_out` | Regular dining / quick-commerce | 11.1 share **up** | 11.1 **7.71** | none |
| `out_and_travel` | Dining and travel are a big slice | 11.1 **and** passenger/recreation share **up** | 11.1 **7.71**; 07.3 as published | none |

No “Swiggy inflation.” No Q-LIFE. Foreign **tuition** is `coaching_or_college` + jumped, not this radio.

### Q-CAM-SHARE (always if roof answered)

Label: **Do you pay society / CAM / apartment extras** (parking, genset, tanker)?

| id | `w` | Unlocks |
| --- | --- | --- |
| `cam_no` | Urban 04.3 template | none |
| `cam_yes` | 04.3 (and dwelling services) share **up** | **Q-CAM-JUMP** |

**Not asked:** OTT/platforms (comms/recreation default pie); gold; fertility; rooms; HRA; income.

---

## 9. Chapter 3 — What moved (lived rates)

Show **only** unlocked beats. Each beat: radio **usual** vs **jumped** (lease: **sitting** vs **reset**). Health block **always**.

### Always

**Q-CARE** — **Where do you usually get treated?**  
`care_public_esi` | `care_private`  
`w`: private → health share **modest up**. NSS: urban private care is **majority**, not exotic.  
`π_i` official: 06 Urban **1.37**. No lived swap from this radio alone.

**Q-PREM** — **Do you pay for a health insurance policy yourself?**  
Helper: Office/ESI ≠ this. CPI does not include premia (Div 12 = 0).  
`prem_none` | `prem_retail`  
Official-weighted: **no change** to 06.  
If `prem_retail` → **Q-PREM-WHO**.

**Q-PREM-WHO** (required if retail) — **Whose premium jumped this year?**  
Chips from Ch 2 only: `self`; `child` if school/coaching; `elder` if elder chip. Plus **None jumped** (`prem_jump: []`).  
`π_i` your estimate: if any role selected, premium slice **10.8**. Official-weighted unchanged.

### If `rent`

**Q-LEASE** — **Your rent this year?**  
`sitting` → 04.1 **1.96** on both layers.  
`reset` → official-weighted still **1.96**; your estimate 04.1 line **12**.

### If `cam_yes`

**Q-CAM-JUMP** — **Society / CAM this year?**  
`usual` → 04.3 **3.18**.  
`jumped` → your estimate **8** on 04.3 line.

### If `school_1` or `school_2plus`

**Q-SCHOOL** — **School fees this year?**  
`usual` → 10 **4.17**.  
`jumped` → your estimate **8** on education line (same line as coaching if both jumped: engine uses **one** lived edu rate, not double).

### If `coaching_or_college`

**Q-COACH** — **Coaching / college fees this year?**  
Same mapping as Q-SCHOOL (flag `coachingFees`). If both jumped, still one Div 10 lived rate.

### If `elder_in_care`

**Q-ELDER** — **Elder-care bills this year** (not the premium; that’s Q-PREM-WHO)?  
`usual` → 06 **1.37**.  
`jumped` → your estimate health **care** slice **10.8**.

### If `help_paid`

**Q-HELP** — **Help / nanny / creche costs this year?**  
`usual` → 05.6 **1.77**.  
`jumped` → your estimate **8**.

### If commute `car`

**Q-MOTOR** — **Car insurance premium this year?**  
`usual` → 07.2 stays **7.37** on both (fuel is in CPI).  
`jumped` → official-weighted unchanged; your estimate **motor-premium** slice (seed in engine; Div 12).  
Do not swap 07.2 to WPI mineral oils **32.4**.

**Quiet path example:** own, no kids, `home`, `mix` commute, ESI, `prem_none`, `cam_no` → Chapter 3 is Q-CARE + Q-PREM only. Your estimate ≈ official-weighted.

---

## 10. Persona object (engine input)

Stable ids. Numeric `w` tables, caps, premia slices, overlay: **[engine PRD](../engine/PRD.md)**.

```text
geo:        { cityId, stateUt }
roof:       rent | own_no_emi | emi
who:        { school: none | 1 | 2plus, coaching, elder, help, pet }  // bools except school
commute:    car | ridehail_transit | mix
dining:     home | regular_out | out_and_travel
cam:        no | yes
care:       public_esi | private
premRetail: bool
premJump:   [] | subset of { self, child, elder }

lived:
  rent:        sitting | reset | null
  cam:         usual | jumped | null
  schoolFees:  usual | jumped | null
  coachingFees:usual | jumped | null
  elderCare:   usual | jumped | null
  helpCosts:   usual | jumped | null
  motorPrem:   usual | jumped | null
```

**Outputs engine must produce:**

1. `pi_official_weighted` — all MoSPI / State Urban `π_i`, persona `w`, jewellery capped, cash COLI default.  
2. `pi_your_estimate` — same `w`, lived seeds on flagged lines, premia **not** labelled MoSPI.  
3. Contrast headlines (Combined, all-India Urban, State Urban).  
4. Write `pi_your_estimate` to `generalInflationRate` on opt-in.

---

## 11. Lived-vs-official register (where each row goes)

| Lived item | Chapter | Mechanism |
| --- | --- | --- |
| New lease vs sitting rent | 3 Q-LEASE | Rate seed **12** vs 04.1 **1.96** |
| Society CAM | 2 share + 3 jump | `w` 04.3; jumped **8** vs **3.18** |
| Coaching / international school | 2 chip + 3 | `w` edu; jumped **8** vs 10 **4.17** |
| School fees | 2 + 3 | same education line |
| Health insurance age-band | 2 roles + 3 whose jumped | Premia **10.8**; Div 12; not 06 **1.37** |
| Diagnostics / private hospital | 2 Q-CARE + elder jump | `w` health; elder jumped **10.8** on care |
| Nanny / creche | 2 `help_paid` + 3 | `w` 05.6; jumped **8** vs **1.77** |
| Ride-hail / metro | 2 Q-COMMUTE | `w` 07.3 only |
| Eating out / q-commerce / trips | 2 Q-DINING | `w` 11.1 (+ travel mix) |
| Vehicle running | 2 `car` | `w` 07.2 **7.37** |
| Motor insurance | 3 Q-MOTOR | Lived premia; not 07.2 / not WPI |
| Platforms / OTT | **No question** | Default comms/recreation pie |
| Pets | 2 chip | Small `w` only |
| Fertility / special-needs | **Out** | — |
| Gold / MF / EMI interest | **Out** | EMI = roof; jewellery capped in engine |
| Bigger fridge / holiday flex | **Out** (was Q-LIFE) | — |

---

## 12. Copy, privacy, acceptance

- No advice; no “CPI is fake.” Your estimate ≠ MoSPI. Not tax / CII / DA / Residex.  
- Device-only; last 10 runs (product-shell). No income, PAN, rent ₹, ages.  
- 6% WealthLab default is a **planning convention**, not this form ([findings](../../research/audit/findings.md) §3.4).

**Accept:** no sliders/₹/tier in Ch 1–3; sandwich persists; `emi` `w` = `own_no_emi`; `prem_retail` without jump does not change official-weighted; `reset` changes **your estimate** only; Ch 3 has no skip; city chip names State Urban; commute/dining have no lived rate unless `car` + motor jumped; platforms unasked.

---

## Changelog

| Date | Change |
| --- | --- |
| 29 Aug 2026 | First draft (old 6-Q + sliders). |
| 29 Aug 2026 | Corpus-style 3 chapters; no sliders; hardcoded geo; drop Q-LIFE / skippable extras; lived follow-ups; map to Jul 2026 P + HCES + Div 12; persona JSON for engine. |
