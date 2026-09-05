# Findings — personal inflation research audit

**Auditor stance:** I am not reviewing UX copy. I am asking whether a CA could put this number on a SIP, corpus, or “real return” conversation without misleading the client.  
**Checked:** README + all seven research notes.  
**Method:** published MoSPI/RBI/Labour Bureau/CBDT/NSS/NHA/IRDAI and contemporaneous press annexures (June–July 2026 CPI). Full URLs: [source-register.md](source-register.md).

---

## 0. Overall grade

| Dimension | Grade | Why |
| --- | --- | --- |
| Honesty vs fake sector overlays | **Pass** | Dropping 8–14% “medical/education/rent/maid” as official rates is the correct call. June 2026 Combined: Health **1.42%**, Education **3.34%**, 04.1 rents **~2%**. |
| Representativeness of India | **N/A (out of scope)** | Product cut is metros / colloquial T1–3, not rural. See [scope-urban-metros.md](scope-urban-metros.md). |
| Representativeness of addressable users | **Pass if labelled** | Same slice the six questions always described. HCES all-urban ₹~24k is the *contrast*, not the design point. |
| Completeness of official metrics | **Fail** | State/UT Urban is **mandatory** for this scope and still not in the research notes. Also CFPI, gold/Div 13, IESH, etc. |
| Statistical hygiene | **Fail-borderline** | HCES year wrong (2022-23 vs **2023-24**). Owner housing weight → 0 **contradicts** CPI rental equivalence. EMI used as a consumption-weight driver. Div 12 unexplained. Gold shock unexplained. |
| Fitness to freeze research | **Do not freeze** | Lived band method is still “TBD”. Engine percents TBD. That is a concept memo, not closed research. |

What the notes get **right** and should keep: two labelled layers; no census; lifestyle ≠ SIP rate; Residex ≠ rent; IRDAI premium growth ≠ MoSPI health; weights sum to 100%; kids do not stack percentage points; CII stays out of this feature.

---

## 1. Does this represent a large share of the population?

**India: no. Addressable users (metros / T1–3): yes, if you stop pretending the HCES urban mean is the user’s budget.**

Product owner (29 Aug 2026): not Bhagalpur / Mawsynram / Anand-class non-users; yes Mumbai, Kochi, Chandigarh, Jammu, Guwahati, Lucknow, Kota, Vadodara, Bengaluru, etc. That cut is **legitimate**. Full rewrite of this section: [scope-urban-metros.md](scope-urban-metros.md).

**Keep:** Combined CPI is still the **national average basket**, including owners and small-town urban. Your job is to show **their mix vs that average**, not to declare MoSPI false.

**₹24k:** HCES all-India urban mean household consumption. It is **not** “what MoSPI thinks a Bangalore family spends.” Urban cash rent in that survey is **6.58% of MPCE**. A renter paying ₹24–50k rent has a **different weight**, which is exactly Gap A. Listing-site rent rising faster than 04.1 ~2% is Gap B (lived). Percentages are the product.

**North East:** not a single dummy. June 2026 Assam Urban **2.26%** vs all-India Urban **3.92%**. Use **State/UT Urban**. HCES urban MPCE: Assam 6,794 vs Chandigarh 13,425 vs UP 5,395.

### 1.1 Geography (why Combined ≠ your user)

Rural still dominates Combined weights (food rural contrib **23.3 pp**). That is **why** Combined is the contrast line, not the personal mix, now that rural is out of product scope.

Q1 is `metro | tier1 | tier2 | tier3` + city → State Urban. `rest` is dropped. RBI “Tier 1” (1 lakh+) is **not** this product’s tier. WealthLab `CITIES` still lacks Lucknow, Kochi, Chandigarh, Jammu, Kota, Vadodara and has no `tier3`.

### 1.2 Income / outflow (Q2)

HCES all-urban ~₹24k/HH remains the **average pie** (owners + cheap urban). For **this app**, Q2 is **cash outflow**. Then `<50k` is still a real Kota/Lucknow salaried rung; `50–100k` is normal for a Bengaluru renter; `1–2L` is upper but plausible. Recut for **outflow**, not HCES fractiles of all-urban India.

**Fix:** label Q2 as outflow (rent/EMI/fees). Do not mix with HCES consumption.

### 1.3 Tenure

NSS urban **own 63.8%** still true for *urban India*. App users may skew renter/EMI. Default UX for renters is fine; do not say that is “urban India.” HCES rent **6.58%** is the contrast share in the ledger. Lived lease jumps stay in the lived column.

### 1.4 Health channel (Q5)

Research implies private care / retail health insurance is the “lived” minority vs “mostly government / ESI”.

NSS 75th Health (2017–18), still the last full social-consumption health round:

- Hospitalisation: **private 55.3%**, public **42.0%** (urban private **61.4%**).
- Treated ailments (OPD mix): private doctor/clinic **42.5%**, private hospital **23.3%**, public **30.1%**.

Private *care* is **not** a niche. What *is* a minority is **retail health insurance** (IRDAI: tens of crores of lives, heavily group/government schemes; individual retail is smaller). Q5 conflates **where you get treated** with **how you finance it**. Those have different inflation mechanics.

NHA 2021-22: OOPE **39.4%** of total health expenditure — still large, but the *direction* is more public money, not less. Research never cites NHA.

**Fix:** Split or relabel Q5: site of care vs insurance. Do not treat “private hospital” as exotic.

### 1.5 Children / coaching (Q3)

No official “JEE inflation”. AISHE counts students; it does not price coaching. The lived coaching flag is fair as **qualitative**. It is **not** a large population share (urban higher-secondary + coaching is a slice of a slice). Sandwich generation (school child **and** elder) is common in the 35–50 saver cohort — **single-choice Q3 is a miss for the actual user**, even if it is a miss you accept for V0.

### 1.6 Employment (who uses SIP calculators)

PLFS 2023-24: **regular wage/salaried ≈ 21.7%** of workers all-India; **self-employed 58.4%**. Urban regular wage is ~**47%** of urban workers. The product’s mental model is salaried + EMI + private school. That is a **large share of *your likely users***, a **small share of India**.

**Advisor conclusion:** If marketing says “your inflation vs India’s”, you owe a footnote: **this is your mix vs Combined CPI, not a claim that we modelled India.**

---

## 2. Does it accurately look at all government / credible metrics?

**No.** Below is what is published and what the folder actually used.

### 2.1 MoSPI CPI 2024 — what they got right

- Base **2024=100**; COICOP-aligned; Rural / Urban / Combined; ~12th 16:00 IST; provisional then final.
- **12 published divisions numbered 01–11 and 13.** Confirmed in June 2026 PIB Annexure I **and** Expert Group minutes: COICOP Div **12 (Insurance and financial services) has zero weight**, so it is not published. The note is correct; it does **not** explain **why**, which matters for Q5 (insurance premia).
- Do not splice 2012 six groups onto 2024 divisions. Correct.
- Headline back series exists on eSankhyiki; **category YoY under the new basket is young** (2026 prints). Correct caution.

### 2.2 MoSPI CPI — errors and holes

**HCES year.** `sources.md` / README talk HCES as if it were a generic “2022-23 style” weight source. CPI 2024 weights are **HCES 2023-24** (Expert Group §3.1; PIB on new series). Using 2022-23 templates would be the **wrong pie**.

**Weight table vs Urban rates.** Annexure 5.3a Combined weights (percentage points of **all-India Combined = 100**):

| Div | Name | Rural contrib | Urban contrib | Combined |
| --- | --- | --- | --- | --- |
| 01 | Food and beverages | 23.27 | 13.49 | **36.75** |
| 04 | Housing, water, electricity, gas, other fuels | 6.52 | 11.15 | **17.66** |
| 06 | Health | 3.75 | 2.35 | **6.10** |
| 07 | Transport | 4.79 | 4.01 | **8.80** |
| 10 | Education services | 1.32 | 2.01 | **3.33** |
| 11 | Restaurants and accommodation | 1.57 | 1.77 | **3.35** |
| 13 | Personal care, social protection, misc. | 2.85 | 2.18 | **5.04** |

Urban column **does not sum to 100**. Urban is **44.58%** of Combined; rural **55.42%**. If the engine treats “Urban 04 = 11.15%” as the urban basket share, the pie is **wrong by more than 2×**. Urban-only housing share ≈ 11.15 / 44.58 ≈ **25%**. That is a **blocking** implementation bug if anyone copies the annexure naively.

**04.1 actual rents:** Combined weight **10.88**; urban contribution **8.43**. Urban-only 04.1 ≈ **19%** of the urban index. HCES urban *cash* rent is **6.58%**. The gap is largely **imputed rent for owners**. See §3.

**State/UT CPI.** MoSPI publishes **State/UT Rural, Urban, Combined** every month, including division/item caution on thin samples. Research: “optional city pick is UX, not a city CPI.” Half-true. There is **no Bengaluru CPI**. There **is** Karnataka Urban vs Bihar Urban. For a CA, using All-India Urban for a Chennai client when State Urban exists is **lazy**, not privacy.

**CFPI.** Food inflation is a separate official series (July 2026 Combined CFPI **5.52%** vs headline **4.45%**). A food-heavy rural or lower-MPCE household should be compared to **CFPI or Div 01**, not only Combined. Not in the research.

**Group/item, not only 12 divisions.** Annexure II has 04.1, 04.5 electricity/gas, 07.2 operation of personal transport, 13.2 jewellery, etc. “12 Urban YoYs” is a **coarse** personalisation. Health *medicines vs hospital services* will not move together.

**Gold/silver jewellery (Div 13).** Combined jewellery weights on the order of **0.62% + 0.31%**. Small weight, **huge** recent YoY (Div 13 Combined **16.72%** in June 2026). RBI already talks **core excluding precious metals**. Research never mentions this. A personaliser that boosts “misc” because Q2 is high will **import bullion** into “cost of living”. That is **not** what a SIP should track.

**PDS / free items.** Expert Group Annexure 5.4. HCES does not impute free health/education. CPI treatment of free PDS is a **first-order** issue for lower-income baskets. Silent in the folder.

**Housing methodology change.** CPI 2024: **rural housing included**; rental equivalence for owner-occupiers; exclude employer/government concessional quarters; chain Jevons by room-count. `questionnaire.md` “own+no EMI → housing ~0” is **anti-MoSPI**. See §3.

**Ingest.** Research: human copy JSON; data.gov.in not a live 2024 feed. Metadata: **eSankhyiki** is the warehouse for item/State series. Ignoring it is a process gap, not a legal one.

### 2.3 Other official **price** indices (almost unused)

| Series | Agency | Why a CA cares | In folder? |
| --- | --- | --- | --- |
| CPI-IW (2016=100), centre-wise | Labour Bureau | **DA** for govt/PSU/many wage contracts. 88-centre retail prices. Closest thing to “city inflation” for a salaried client with DA. | Named, “don’t mix”. No plan to **show** it as a comparator. |
| CPI-AL / CPI-RL (2019=100) | Labour Bureau | Rural labour cost of living. | **Absent** |
| WPI | DPIIT | Input/producer; not household. July 2026 WPI was in a **different** regime than CPI (wholesale vs retail). | One line “not household” — enough for exclusion, not for explaining **why** food CPI ≠ WPI food |
| RBI House Price Index | RBI | Registered residential prices, 18 cities, Q1 2026-27 **+3.6% YoY** | Residex mentioned; **RBI HPI omitted** |
| NHB Residex | NHB | Assessment / listed / under-construction **sale** prices, 50 cities | Correctly “not CPI rent” |
| RBI IESH | RBI | What urban households *think* inflation is (19 cities). Systematically **above** CPI. | **Absent** — this is the psychological competitor to your product |

### 2.4 Official **expenditure / use** surveys (weights and lived flags)

| Source | Role | In folder? |
| --- | --- | --- |
| HCES 2023-24 item groups | Education 5.97% urban MPCE, medical 5.85%, conveyance 8.46%, rent 6.58% | Named generically; **no numbers** |
| NSS 75th Health | Private vs public utilisation and **level of expenditure** (private IPD ~₹32k vs public ~₹4.5k) | **Absent** |
| NSS 75th Education | Household education spending | **Absent** |
| NSS 76th housing | Tenure | **Absent** |
| NHA | OOPE vs GHE | **Absent** |
| PLFS | Who has ESI-like cover (organised regular wage) | **Absent** |
| NAS PFCE | National Accounts consumption — different from HCES/CPI | **Absent** |

### 2.5 Tax and “inflation” the client will confuse with this feature

README: “Tax slab and CII stay in other features.” Correct **product split**. Insufficient **research**.

- **CII** (CBDT): FY 2024-25 **363**, FY 2025-26 **376**. Statute: historically linked to **75% of the rise** in an older urban CPI (CPI-UNME era language in s.48 explanation). It is a **capital-gains deflator**, not a household COLI. After Finance Act 2024, indexation is **narrowed** (property rules changed 23 Jul 2024). A client who applies “personal CPI 7%” to **indexed cost** is doing **illegal maths**.
- **DA** is CPI-IW, not Combined CPI.
- **GST rate changes** are tax, not CPI methodology, but they **hit the same bill**.
- Real return on FD/SIP = nominal − **consumption** inflation, not CII, not Residex, not gold.

**Fix:** one research page: *four inflations* (CPI Combined, personal official-weighted, lived band, CII) and **never** cross-apply.

---

## 3. Conceptual errors a CA would refuse to sign

### 3.1 Zero housing weight for owners

Official CPI **imputes rent** for owner-occupiers (rental equivalence). That is why housing is **17.66%** of Combined after the 2024 revision (was ~10% in 2012 when rural housing was largely out).

Your rule: own + no EMI → housing ~0.

That is a **cash-cost index**, not “official-weighted CPI”. It is a **defensible household-finance concept** (you do not write a cheque for imputed rent). It is **indefensible** if the screen says “vs official CPI” without stating you **stripped imputed rent**.

**Fix:** Two official-weighted variants, labelled: (A) MoSPI-consistent (keep imputed housing); (B) cash COLI (housing = rent + maintenance + utilities only). Default for SIP: **B**, with a one-line why. Never call B “MoSPI”.

### 3.2 EMI as biggest outflow → boost housing CPI

EMI is **debt service**. Principal is **saving into an asset**. Interest is **cost of leverage**, not a COICOP consumption price. Boosting Div 04 because EMI is the largest line **double-counts** (asset inflation + consumption) and **mis-labels**.

**Fix:** Q4 `emi` → cash-flow stress / tenure flag, **not** a housing **price** weight hike. If they have a home loan they still consume utilities and maintenance — use those shares from HCES owner templates, not the EMI rupee.

### 3.3 “Lived” medical 12% vs Health CPI 1.4%

Keep them unmixed. Also be precise: Aon/WTW **medical trend** is **insured book cost** (utilisation + mix + unit price). IRDAI **premium** growth FY25 ~**9%**. Neither is Div 06. Age-band premium jumps are **underwriting**, not a price index. For a 51-year-old, the **lived** story is real; the **method** is still TBD — which means you **cannot** ship a numeric lived band yet.

### 3.4 Default 6% already in WealthLab

Product shell: feed `InflationToggle` default 6%. RBI target is **4% ± 2%**. July 2026 Combined **4.45%**. Long-run CPI has been nearer 5–6% in some decades; **6% is a planning convention**, not MoSPI. If personal-official-weighted prints **4.2%** and you still push 6%, you need a **conservatism** rationale (fees, tax drag, underestimation of lived costs) — as **assumption**, not as inflation.

---

## 4. File-by-file

### `README.md`

- One-sentence goal is clear.
- Six questions “each must change a weight or flag” is a good constraint; Q6 does not change the calculator rate — say that in the table header, not only later.
- “Guess how fast this person’s same life is getting more expensive” **overclaims** vs a 6-enum form.
- Success: 30 seconds — then you **cannot** also claim HCES-faithful weights. Pick.

### `mospi-cpi.md`

- Thin but mostly accurate. Add: HCES **2023-24** weights; eSankhyiki; State/UT; CFPI; Div 12 = insurance **excluded**; jewellery in 13; rural housing **in**; linking/back-series rules; **do not use Combined-contribution weights as urban pie**.

### `sources.md`

- Table is a **name-drop**, not a source. No vintage, no URL, no numbers.
- RBI is more than “same CPI + MPR narrative”. **IESH + HPI + Monetary Policy Report inflation projections + core**.
- Missing: NHA, NSS 75/76, PLFS, CBDT CII, CPI-AL/RL, DPIIT WPI (already one line), NAS.

### `overlays.md`

- Best page in the pack. Keep. Add a dated **citation** for the month you pulled (June 2026 education 3.34% Combined, health 1.42%, 04.1 ~2%). Update when the series moves.
- Residex/listing/Aon: correct. Add RBI HPI as the **other** official house-**price** series.

### `lived-vs-official.md`

- The two-column idea is the only way to stay honest.
- List is **urban formal-sector**. Missing **large-population** lived items: PDS quality/availability, LPG refill timing, MNREGA wage vs food, agricultural seasonality, informal rent without contract (NSS: majority of rentals **unwritten**), gold as **forced saving** in Div 13.
- Stamp duty / brokerage as “level not π”: true for one-shot; **recurring** society deposits are not.
- Band method **unspecified** → research not closed.

### `weights-kids-wealth.md`

- Arithmetic of reweighting is correct. Toy example is the right pedagogy.
- Caps “TBD” is not research.
- Need **HCES fractile templates** (rural/urban × MPCE class) as the actual prior, not “urban middle” vibes.

### `questionnaire.md`

- Privacy stance is sound.
- Q2 bands: **reject** as written (§1.2).
- Q3 single choice: fail for sandwich households (your users).
- Q4 EMI: conceptual fail (§3.2).
- Mapping “housing ~0” for owners: fail (§3.1).
- “Not a government CPI” copy: keep.

### `product-shell.md`

- Feeding one global rate is operationally right.
- Legal: “not tax” is necessary but incomplete — add **not CII, not DA, not Residex**.
- Out: CII as later feature is fine; **cross-links** so users do not paste personal π into a capital-gains worksheet.

---

## 5. Other sources you should look at (priority)

**Must ingest or at least read before any engine PRD**

1. Expert Group report + Annexure 5.3 **item weights** (not just 12 divisions).  
2. HCES 2023-24 **detailed report** (fractile × item), not the factsheet only.  
3. Monthly CPI Excel: groups 04.1, 04.5, 06.*, 10.*, 13.2 jewellery.  
4. State/UT Urban general + Div 01/04/06/10.  
5. eSankhyiki extract process (replace “intern pastes Excel”).  
6. RBI IESH (expectation gap — UX copy).  
7. NHA + NSS 75th Health (Q5).  
8. NSS 76th tenure (Q1).  

**Should sit in “lived / do not mix” appendix**

9. IRDAI handbook tables (premium, claims ratio) — **premia**, not π.  
10. Aon/WTW medical trend — labelled industry.  
11. RBI HPI + NHB Residex — **assets**.  
12. CBDT CII notifications — **tax**.  
13. CPI-IW centre index if the user is in a mapped city **and** DA-linked — comparator only.  
14. CPI-AL/RL — **out of V0** if rural is out of scope.  
15. PLFS (ESI/organised vs informal).  
16. **State/UT Urban CPI** for every listed city (Assam, J&K, Chandigarh, Kerala, …) — mandatory under urban-only scope.  

**Nice, not V1**

- CMIE CPHS (private; licensing).  
- World Bank ICP (PPP, not monthly).  
- UDISE+/AISHE (volumes, not fees).  
- State education fee regulation orders (cannot nationalise).

---

## 6. Required fixes (blunt)

1. **Rewrite the README one-liner:** *For urban households in listed metros/T1–3 cities, reweight published **State Urban** category inflation to a coarse mix; show Combined (and all-India Urban) as the average basket; lived costs in a separate labelled band.*  
2. **Scope:** metros / colloquial T1–3 only. Drop Q1 `rest`. Define tiers; expand `CITIES`. Not “CPI is fake.”  
3. **Q2 bands** for *this* cash-outflow population (keep a &lt;50k rung for T2/T3). Do not design to the HCES ₹24k mean. Still say consumption vs outflow.  
4. **Fix owner housing:** cash COLI vs imputed; never silent zero.  
5. **Stop using EMI as a CPI weight.**  
6. **Cite HCES 2023-24**, not 2022-23, as the CPI weighting survey.  
7. **Document Div 12 = 0** (insurance out of CPI) — this is why health **insurance** is lived, not “we forgot MoSPI”.  
8. **Strip or cap jewellery** in any personal official-weighted number used for SIP.  
9. **State Urban is the personal mix default** (not optional UX). Combined = contrast. No NE overlay.  
10. **Specify lived-band math** (e.g. qualitative only in V1: no second %) or do not show a second %.  
11. **Source register** in research (this folder) — keep dates. `overlays.md` without a month is already stale.  
12. **Do not freeze.** Engine percents, caps, and band method are still empty.

---

## 7. What I would tell a client tomorrow

If you only have Combined CPI, use **~4–5%** as the current *average* consumption inflation (July 2026 Combined **4.45%**, Urban **~4%**), not 6%, unless you want a **planning buffer**. For Guwahati, start from **Assam Urban**, which was **lower** than all-India Urban in June 2026.

If you are a metro/T2 renter, the HCES ₹24k urban mean is **not your budget**. Official rent **share** is ~7% of urban MPCE; your rent may be a third of outflow. Reweighting official rates by **your** shares is the honest “gov vs me” story. Calling CPI fake is not.

If you then add 12% “medical inflation” into the SIP rate, you are **no longer doing CPI**. You are doing **scenario stress**. Call it that.

This folder is **not** yet a basis for a number I would put in a signed plan.
