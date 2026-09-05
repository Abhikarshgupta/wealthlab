# T1 — Personal inflation (test plan)

**Workstream:** Personal inflation  
**Prefix:** `PI`  
**Phase:** T2 Gherkin + T3 specs **complete** (see [TEST-SUITE-REVIEW.md](TEST-SUITE-REVIEW.md)). Engine/results remain RED until I2.  
**Skill:** calculator-test-suite  
**Vintage for goldens:** CPI July 2026 provisional Urban group YoYs + V0 freeze pies in [engine/PRD.md](engine/PRD.md) §4–5.

**Prod today:** Chapters 1–3 and persona store exist (`/personal-inflation`). Results is a stub. Engine (`Σ w × π`) is **not** implemented. T2–T3 may go green on interview/unlocking and **must stay red** on engine π until I2.

Do not treat this file as executable expected values for modifier pies until T3 freeze spreadsheet (clamp + renormalise). Unmodified freeze templates below **are** arithmetic from the PRD tables.

---

## 1. Surfaces (three contracts, one prefix)

| Surface | Owns | Golden | Layers |
| --- | --- | --- | --- |
| Questionnaire | Persona JSON, unlocks, no ₹/sliders | few (persona shapes) | Gherkin + integration |
| Engine | `w`, official vs estimate `π`, overlay, repair | `tests/fixtures/golden/personal-inflation.json` | Unit (primary) + Gherkin |
| Results | Hero, drawers, apply | reuse engine IDs + UI assertions | Integration + Gherkin |

Apply writes **`pi_your_estimate`** only → `generalInflationRate` / `InflationToggle`. Not official-weighted. Not Variant A. Not CII.

---

## 2. Matrix (not a calculator amount/tenure grid)

### 2.1 Questionnaire

| Dimension | Values | Path |
| --- | --- | --- |
| Place | listed city, unlisted → state/UT, empty continue | HP, EG |
| Roof | rent, own_no_emi, emi | HP |
| Who | none, school_1, school_2plus, exclusive 1 vs 2+, sandwich (school+elder), coaching, help, pet | HP, BD |
| Commute | car, ridehail_transit, mix | HP |
| Dining | home, regular_out, out_and_travel | HP |
| CAM | no, yes | HP |
| Care / prem | ESI, private; prem none vs retail; jump [] vs roles | HP |
| Lived | sitting/reset, usual/jumped, orphan flags | HP, EG |
| Controls | no sliders, no ₹, no tier | XF |

### 2.2 Engine

| Dimension | Values | Path |
| --- | --- | --- |
| Template | renter vs owner_cash | HP |
| EMI vs own | identical `w` and both πs | HP, XF |
| Modifiers | each §6 trigger, stacked sandwich, education cap 22 | HP, BD |
| Lived seeds | each §7 flag; school+coaching one rate | HP |
| Premia slices | premJump nonempty → 2 pp; motor jumped → 1.5 pp; premRetail empty jump → none | HP, XF |
| Geo | Bengaluru → Karnataka chip; Guwahati → Assam 2.53; V0 mix = all-India Urban groups | HP |
| Clamp | food/rent/edu max, owner rent locked 0, jewellery 0, residual min | BD |
| Overlay | mix re-sum 100; estimate rates 1–25; official π frozen; flags unchanged | HP, BD |
| Repair | orphan lived keys nulled | EG |
| Forbidden | Combined group YoY as mix; 13.2 in SIP π; WPI 07.2; rupees | XF |

### 2.3 Results / apply

| Dimension | Values | Path |
| --- | --- | --- |
| Hero | 1 decimal; why-not-12 sentence; sticky | HP |
| Raise drawer | 12 − 8 = +4; hike does not change hero | HP |
| SIP drawer | closed until open; demo 10k / 12% / 10y | HP |
| Bills | rent row iff renter; owners no rent; start over | HP |
| Apply | opt-in estimate; 6% default until apply | HP, XF |
| Copy | no MoSPI/floor/cap/π in UI | XF |

---

## 3. Golden plan

**File:** `tests/fixtures/golden/personal-inflation.json` (create in T3).  
**Tolerance:** π **0.06** (display is 1 decimal); `w` **0.05** pp after display rounding; identity `Σ w = 100` exact after 4-decimal internal.

`verifiedAgainst`: engine PRD freeze + §5 Urban YoY. `caReviewed`: false (not tax). Domain review = product/research, not CA.

### Freeze arithmetic (no Chapter 2 Δ, cash COLI)

Official Urban `π_i` (V0): food 5.05, rent 1.96, dwelling 3.18, utilities 1.98, help 1.77, health_care 1.37, motor_run 7.37, passenger 3.01, education 4.17, restaurants 7.71, residual 3.96.

| ID | Persona (sketch) | `pi_official_weighted` | `pi_your_estimate` | Notes |
| --- | --- | --- | --- | --- |
| PI-20 | Quiet owner: mix commute, home, cam no, ESI, prem none, who none | **4.2689** | same (rounding) | Engine §12 quiet path |
| PI-22 | Quiet renter, sitting lease | **3.3686** | same | Template renter |
| PI-23 | Same renter, `lived.rent = reset` | **3.3686** | **6.5814** | 32% × (12 − 1.96) |
| PI-24 | EMI clone of quiet owner | same as PI-20 | same | `w` identical to own_no_emi |
| PI-28 | Quiet owner + premRetail, `premJump: []` | PI-20 | same | No health_prem slice |
| PI-42 | Any SIP π | jewellery `w` = 0 | jewellery unused | 13.2 never in formula |

Modifier / overlay / premia rows (PI-26, PI-31, PI-33, PI-40, …): **do not hardcode π in T1**. Compute in T3 after implementing clamp+renorm in a spreadsheet (or red engine). Plan: ≥5 of the rows above plus ≥3 computed rows (school+reset Lucknow, overlay 32→40, motor prem slice).

**Results copy check (not a π golden):** Lucknow renter + lease 12% + school 8% lands **~6.6%** hero ([results PRD](results/PRD.md) §5) — pin after T3 once education +4 and renorm are applied.

---

## 4. Scenario cards

Tags: `@personal-inflation` plus `@smoke` / `@regression` / `@edge` / `@overlay`. No `@tax`.

### Questionnaire

## PI-01 — Route and stepper load

| Field | Value |
| Path type | HP |
| Tags | @smoke @personal-inflation |
| Why | Shell is reachable before engine exists |
| Inputs | `/personal-inflation` |
| Expected | Steps Place → Household → Bills → Your number; no crash |
| Layers | Gherkin / Integration |

## PI-02 — Home CTA

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Why | LAYOUT home entry |
| Expected | “What’s my inflation?” / My inflation → `/personal-inflation` |
| Layers | Gherkin |

## PI-03 — City maps stateUt

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Why | City is not a city CPI |
| Inputs | Bengaluru → Karnataka; Guwahati → Assam |
| Expected | Chip: State urban prices, not a city index. Contrast later: Assam Urban **2.53** vs all-India Urban **3.96** |
| Layers | Gherkin / Unit (geo constant) |

## PI-04 — Unlisted city → state/UT

| Field | Value |
| Path type | EG |
| Tags | @edge |
| Expected | Still Urban; no `rest`; no GPS/tier |
| Layers | Gherkin / Integration |

## PI-05 — Continue blocked until chapter valid

| Field | Value |
| Path type | EG |
| Tags | @edge |
| Expected | Primary disabled; first missing field helper, not a modal |
| Layers | Integration |

## PI-06 — No sliders or rupees in Ch 1–3

| Field | Value |
| Path type | XF |
| Tags | @regression |
| Why | Mix is radios/chips only |
| Expected | No range/₹/tier controls on pages 1–3 |
| Layers | Gherkin |

## PI-07 — EMI helper + same mix as own

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Why | EMI is tenure, not housing π |
| Expected | Helper copy; persona `roof: emi`; engine PI-24 |
| Layers | Gherkin / Integration (persona) |

## PI-08 — School 1 vs 2+ exclusive; sandwich OK

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Expected | Cannot hold school_1 and 2plus; school + elder both persist |
| Layers | Integration |

## PI-09 — Quiet path Chapter 3 length

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Inputs | own, who none, mix, home, cam no |
| Expected | Only Q-CARE + Q-PREM (no lease/CAM/school/motor) |
| Layers | Unit `getUnlockedBeats` / Integration |

## PI-10 — Unlocks follow Ch 2

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | rent→lease; cam yes→CAM jump; school→school; coaching→coach; elder→elder; help→help; car→motor; mix commute → no motor |
| Layers | Unit / Gherkin |

## PI-11 — Premium roles from Ch 2

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | self always if retail; child iff school/coaching; elder iff elder; None jumped allowed |
| Layers | Unit `getPremWhoRoles` |

## PI-12 — Chapter 3 not skippable

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | usual/sitting is a required radio; cannot skip to results |
| Layers | Integration |

## PI-13 — Persona shape §10

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | Store emits engine ids only; orphan lived keys null when roof/who/cam/car change |
| Layers | Unit (store) / Integration |

## PI-14 — Device persist / reset

| Field | Value |
| Path type | DG |
| Tags | @edge |
| Expected | Last answers on device; start over clears; no PAN/income |
| Layers | Integration |

### Engine — happy path

## PI-20 — Quiet owner: estimate ≈ official

| Field | Value |
| Path type | HP |
| Tags | @smoke @regression |
| Inputs | golden#PI-20 |
| Expected | 4.2689 both books; rent w=0; jewellery 0; vintage 2026-07 |
| Layers | Gherkin / Unit |

## PI-21 — Contrast headlines

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Expected | Combined **4.45**, all-India Urban **3.96**, state Urban headline (Karnataka 4.37, UP 3.62, Assam 2.53). Mix `π_i` are Urban **group**, not Combined groups |
| Layers | Unit |

## PI-22 — Quiet renter sitting

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Inputs | golden#PI-22 |
| Expected | Both π **3.3686**; rent w=32, π_i 1.96 both books |
| Layers | Unit |

## PI-23 — Renter reset: official 04.1 frozen

| Field | Value |
| Path type | HP |
| Tags | @smoke @regression |
| Inputs | golden#PI-23 |
| Expected | Official still 3.3686; estimate **6.5814**; rent estimate π_i **12** labelled not MoSPI; flags_applied.rent = reset |
| Layers | Gherkin / Unit |

## PI-24 — EMI identical to own_no_emi

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | Same `w`, both πs, rent 0; Variant A not applied |
| Layers | Unit |

## PI-25 — Variant A owners only, footnote

| Field | Value |
| Path type | HP |
| Tags | @edge |
| Expected | `pi_official_imputed` non-null for owners/EMI; null for renters; never default apply |
| Layers | Unit |

## PI-26 — Chapter 2 modifiers (each trigger)

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Why | Share tilts, not stacked π per child |
| Inputs | One golden row per trigger (or outline): school_1 +4 edu, 2plus +8 not +12, coaching +3, elder +3 health, help +4, pet +2 residual, car +6/−3, ridehail +8/−4, mix 0, dining, cam +4 dwelling, private care +2 |
| Expected | After clamp+renorm Σw=100; 2plus education share > school_1; kids do not add to π_i |
| Layers | Unit |

## PI-27 — Education cap on sandwich

| Field | Value |
| Path type | BD |
| Tags | @edge |
| Inputs | school_2plus + coaching (+11 pp before clamp) |
| Expected | education ≤ 22; surplus not jewellery |
| Layers | Unit |

## PI-28 — premRetail without jump

| Field | Value |
| Path type | XF |
| Tags | @regression |
| Expected | Official-weighted unchanged; no health_prem slice |
| Layers | Unit |

## PI-29 — premJump slice 10.8

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | Estimate health_prem w=2 (from residual then food); π_i 10.8; official health_prem 0; Div 06 official still 1.37 |
| Layers | Unit |

## PI-30 — Motor prem slice, not WPI

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | motor_prem 1.5 pp from motor_run (floor 1); seed 10; motor_run official 7.37 both books |
| Layers | Unit |

## PI-31 — School + coaching jumped → one education rate

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | education estimate π_i **8** once; not 16 |
| Layers | Unit |

## PI-32 — Lived usual = official on both books

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Expected | sitting/usual does not swap π_i |
| Layers | Unit |

## PI-33 — Each lived seed (outline)

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | CAM 8, help 8, elder care 10.8, rent 12; official line unchanged |
| Layers | Unit |

## PI-34 — Pet is residual, not health π

| Field | Value |
| Path type | XF |
| Tags | @edge |
| Expected | +2 residual; health π_i stays official unless elder jumped |
| Layers | Unit |

## PI-35 — Ride-hail is mix only

| Field | Value |
| Path type | HP |
| Tags | @edge |
| Expected | No Ola π; passenger w up vs owner-car template |
| Layers | Unit |

### Engine — clamp, overlay, repair

## PI-40 — Overlay mix 32 → 40 rent

| Field | Value |
| Path type | HP |
| Tags | @overlay @regression |
| Expected | Residual absorbs; Σw=100; both πs move; lived flags unchanged; official π_i frozen |
| Layers | Unit |

## PI-41 — Overlay went-up on visible bills

| Field | Value |
| Path type | HP |
| Tags | @overlay |
| Expected | Estimate π_i 1–25 silent; prefill jumped→seed else official; usual line not stuck at seed if they type; official book published rates |
| Layers | Unit / Integration |

## PI-42 — Jewellery and 07.1 never in SIP π

| Field | Value |
| Path type | XF |
| Tags | @regression |
| Expected | w jewellery=0, vehicles=0; 43.54 never in Σ |
| Layers | Unit |

## PI-43 — Owner cannot raise rent share

| Field | Value |
| Path type | XF |
| Tags | @overlay @edge |
| Expected | rent locked 0; no rent bill row |
| Layers | Unit / Integration |

## PI-44 — Clamp surplus → residual not jewellery

| Field | Value |
| Path type | BD |
| Tags | @edge |
| Expected | Engine §8.1 |
| Layers | Unit |

## PI-45 — Residual floor steal restaurants then food

| Field | Value |
| Path type | BD |
| Tags | @edge |
| Expected | warnings[] if fail-closed |
| Layers | Unit |

## PI-46 — Orphan lived keys ignored

| Field | Value |
| Path type | EG |
| Tags | @edge |
| Inputs | lived.rent set but roof own; schoolFees but school none |
| Expected | Null; no seed |
| Layers | Unit |

## PI-47 — Sanity warnings, do not clamp π to 6

| Field | Value |
| Path type | EG |
| Tags | @edge |
| Expected | estimate >18 or official >10 → warnings chip; still show number |
| Layers | Unit |

## PI-48 — JSON vintage bump without id change

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | output.vintage.month from JSON; account ids stable |
| Layers | Unit |

## PI-49 — Σ w = 100 after every mix step

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Expected | After template, modifiers, clamp, overlay, premia slices |
| Layers | Unit |

## PI-50 — Classification refuse (EMI, gold, SIP, ₹)

| Field | Value |
| Path type | XF |
| Tags | @edge |
| Expected | Not in `w`; engine 11.4 |
| Layers | Unit (no field) / Gherkin (UI) |

### Results

## PI-60 — Hero is your inflation, 1 decimal, sticky

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Expected | Sticky = number + why sentence + apply only |
| Layers | Gherkin / Integration |

## PI-61 — Why-not-12 sentence beside hero

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Why | Renter first number looks “too low” |
| Expected | Loud bill ≠ headline; no footnote-only |
| Layers | Gherkin |

## PI-62 — Raise drawer default open: hike − inflation

| Field | Value |
| Path type | HP |
| Tags | @smoke |
| Inputs | hike 12, inflation 8 |
| Expected | +4.0; hike does not change hero |
| Layers | Integration |

## PI-63 — Nested after-tax from this year’s slab

| Field | Value |
| Path type | HP |
| Tags | @edge |
| Expected | In-hand hike = CTC hike × (1 − slab); real raise = in-hand − inflation. Not a full tax return. |
| Layers | Integration |

## PI-64 — SIP drawer closed; graph only inside

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | Graph not in first paint; demo 10k/12%/10y vs Combined |
| Layers | Gherkin |

## PI-65 — Bills last; rent row iff renter

| Field | Value |
| Path type | HP |
| Tags | @regression |
| Expected | Order in results PRD §6; Everything else not editable share |
| Layers | Gherkin |

## PI-66 — Start over from answers

| Field | Value |
| Path type | HP |
| Tags | @edge |
| Expected | Overlay cleared; engine first paint restored |
| Layers | Integration |

## PI-67 — Copy bans

| Field | Value |
| Path type | XF |
| Tags | @regression |
| Expected | UI has no MoSPI, 04.1, π, floor, cap, “pay next year”, “ask HR for X%” |
| Layers | Gherkin |

## PI-68 — One column ~640px; drawers independent

| Field | Value |
| Path type | HP |
| Tags | @edge |
| Expected | LAYOUT + results PRD; not layout A |
| Layers | Gherkin (viewport) |

### Apply / shell

## PI-80 — Apply writes estimate only

| Field | Value |
| Path type | HP |
| Tags | @smoke @regression |
| Expected | `generalInflationRate` = `pi_your_estimate`; InflationToggle on; calculators use it |
| Layers | Integration |

## PI-81 — No silent apply

| Field | Value |
| Path type | XF |
| Tags | @regression |
| Expected | Completing interview does not overwrite 6% until CTA |
| Layers | Integration |

## PI-82 — Does not write CII / DA / Residex

| Field | Value |
| Path type | XF |
| Tags | @edge |
| Expected | No other stores |
| Layers | Integration |

## PI-83 — Last 10 on device

| Field | Value |
| Path type | DG |
| Tags | @edge |
| Expected | product-shell; no account |
| Layers | Integration |

---

## 5. Adversarial (T3 unit)

From `tests/fixtures/adversarial/` pattern: null persona, NaN overlay, w vector not summing to 100, π_i missing account, premJump `child` without school (repair), overlay rent 0 and 100, went-up 0 and 26 (clamp silent to 1–25).

---

## 6. File layout (T2–T3)

```
tests/features/personal-inflation/questionnaire.feature
tests/features/personal-inflation/engine.feature
tests/features/personal-inflation/results.feature
tests/fixtures/golden/personal-inflation.json
src/__unit__/personalInflation.engine.test.js
src/__unit__/personalInflation.beats.test.js
src/__integration__/personal-inflation.integration.test.jsx
tests/TRACEABILITY.md  # PI section
```

Minimum pack: 7 Gherkin (we have far more IDs), 7+ unit, 3 integration, 5 golden.

**T2 smoke slice:** PI-01, PI-09, PI-20, PI-23, PI-60, PI-62, PI-80.

---

## 7. Stop

T1–T3 spec complete. See [TEST-SUITE-REVIEW.md](TEST-SUITE-REVIEW.md). No engine/results implementation in this phase — I2 makes RED tests green.
