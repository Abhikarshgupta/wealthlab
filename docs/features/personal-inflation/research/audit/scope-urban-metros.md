# Addendum — urban metros / tier 1–3 only (29 Aug 2026)

Product owner constraint (same day as the first audit): **do not design for rural India or small-town urban that will not use WealthLab.** Target: metros and tier-1/2/3 cities in the *colloquial* sense (Mumbai, Kochi, Chandigarh, Jammu, Guwahati, Lucknow, Kota, Vadodara, Bengaluru, …). Explicit non-targets: places like Bhagalpur, Mawsynram, Anand.

This note **revises** [findings.md](findings.md) §1 on population. It does **not** weaken §3 (owner housing, EMI, jewellery) or the ban on fake sector overlays.

---

## 1. Is narrowing the scope legitimate?

**Yes.** A SIP app is allowed to serve people who save. Census-completeness is not a fiduciary duty.

Say it in the README: *This tool is for urban households in million-plus / HRA-class / wealth-app cities. It is not a national COLI.*

Then “does it represent a large share of *population*?” becomes the wrong KPI. The right KPI is: **does it represent a large share of people who will actually open `/personal-inflation`?** That can be **yes** without covering Bihar rural.

**Do not** use the words “tier 1/2/3” without a definition. They collide:

| Label | What it actually is |
| --- | --- |
| RBI centre tiers | Population: “Tier 1” = **1 lakh+**. Anand and many “small” towns are RBI Tier 1. Useless for this product. |
| MoF HRA X / Y / Z | Allowance class (Delhi-Mumbai-… vs Y vs Z). Closer to “metro vs other city”. |
| Real-estate “Tier 2” | Lucknow, Kochi, etc. Informal. |
| WealthLab `CITIES` today | Only metro / tier1 / tier2; **no tier3**; missing Lucknow, Kochi, Chandigarh, Jammu, Kota, Vadodara. Guwahati is already `tier2`. |

**Fix:** Map city → `{ metro | tier1 | tier2 | tier3 }` as **product enums**, document the list, map each city to **State/UT Urban CPI**. Drop Q1 `rest` / “not city” from V0. If someone in Anand uses the app, they still get **Gujarat Urban** rates — do not build a third India.

Anand as “won’t use the app” is a **go-to-market** claim, not a statistical one (it is an urban municipal corporation). Fine as a cut. Don’t pretend MoSPI agrees.

---

## 2. Does the 24k argument make sense?

**The instinct is right. The slogan is wrong. Percentages are the product. Rupee means are a teaching prop, not the enemy.**

### 2.1 What the ₹24k figure actually is

HCES 2023-24 **all-India urban** mean MPCE **₹6,996** × ~3.5 persons ≈ **₹24k household consumption**. That average **includes**:

- Owner-occupiers whose **cash rent is near zero** (HCES urban rent share **6.58%**, ₹460 **per person** — about **₹1.4–1.6k household rent** at the mean).
- Every statutory town, not only Bengaluru IT corridors.
- Poor urban households (bottom 5% urban MPCE **₹2,376**/person).

So “₹24k for a family of 3 cannot buy Bangalore rent + food” is **true as lived experience** and **does not prove MoSPI cooked the books**. It proves you are **not the mean urban household**. That is the entire point of reweighting.

MoSPI’s inflation print is **not** “5% of ₹24k”. CPI is a **price index on a fixed basket**. HCES levels and CPI rates are **two different official objects**. Do not put them in one sentence as if the government said “your grocery bill is 24k and it rose 5%.”

### 2.2 What you should showcase (this *is* good)

Two gaps, keep them separate:

| Gap | Official | Your user | Tool |
| --- | --- | --- | --- |
| **A. Mix (weights)** | Urban rent **6.58%** of MPCE; Combined housing **17.66%** (much of it **imputed**). | Bengaluru 2BHK listing midpoints often **₹28–60k** (portal samples, 2026 — not MoSPI). Rent can be **30–50% of cash outflow**. | Official-weighted π: same published 04.1 YoY, **your** share. |
| **B. Rate (prices)** | Urban 04.1 actual rents ~**2%** YoY (June 2026). All-India Urban headline ~**3.9%**. | New lease / listing sites often **high single / low double digit** in tight corridors. | **Lived** rent band. Not “MoSPI is 2% so we will publish 10% as official.” |

Worked sketch (illustrative, not a golden):

- Official-ish urban mix: rent 7%, rest 93%, rent π 2%, rest π 4% → personal π ≈ **3.9%**.
- Your mix: rent 40%, rest 60%, **same** official rates → π ≈ **0.4×2 + 0.6×4 = 3.2%**.  
  Wait: if rent inflation is *lower* than the rest, **raising the rent weight can *cut* headline π.** Reweighting is not a one-way “you inflate more.” It is “you differ.” Show that honestly or the tool is a scare product.
- If lived lease is 10% on 40% share and official rest 4%: cash π ≈ **6.4%**. That **6.4 vs 3.9** is the disparity. Label 10% as **lived**, 2% as **MoSPI rents**.

**₹24k is irrelevant as a budget target.** It is relevant as: *this is why the official pie looks nothing like your ledger.* Lead with **shares**, put rupees in the ledger as illustration.

### 2.3 Copy you must not ship

- “Government inflation is nowhere close to real life” as a **claim that CPI is false**. CPI is real for the **average basket**. Your job is **your basket ≠ average basket**.
- Using listing-site rent YoY as the **calculator** rate (that is Gap B). Fine in the lived column.

Legal/CA: *illustrative reweight of published category inflation; not a finding that MoSPI undercounts India.*

---

## 3. Will the North East have different numbers?

**Yes on levels and food mix. Official *headline Urban CPI* in NE has recently been *lower*, not higher. Do not invent a “NE +2 pp” overlay.**

### 3.1 Official *price* inflation (June 2026, PIB Annexure III)

All-India Urban **3.92%**.

| State/UT | Urban YoY | Combined YoY |
| --- | --- | --- |
| Assam (Guwahati) | **2.26%** | 3.59% |
| Meghalaya | 2.46% | 2.64% |
| Manipur | 2.33% | 2.94% |
| Jammu & Kashmir | 3.38% | 3.47% |
| Chandigarh (urban only) | **4.26%** | 4.26% |
| Karnataka | 4.34% | 4.80% |
| Kerala | 3.74% | 4.34% |
| Maharashtra | 3.18% | 3.81% |

NE hill states were among the **lowest** Combined prints nationally that month (Mizoram/Tripura/Meghalaya also cold in July 2026 broker notes). **Guwahati vs Mumbai is not “NE inflates more.”** If you only use All-India Urban, you may **overstate** official inflation for Assam.

**Fix:** city → **State/UT Urban** category rates. Guwahati → Assam Urban. Kochi → Kerala Urban. Jammu → J&K Urban. Chandigarh → Chandigarh. That is the NE (and every other region) answer. MoSPI already warns State **item** samples can be thin — use **division** State Urban, not item-level.

### 3.2 Official *levels* (HCES 2023-24 urban MPCE, ₹/person/month)

All-India urban **6,996**.

| Place (proxy) | Urban MPCE |
| --- | --- |
| Chandigarh | **13,425** |
| Sikkim | 13,927 |
| Karnataka | 8,076 |
| Meghalaya | 7,839 |
| Kerala | 7,783 |
| Maharashtra | 7,363 |
| Gujarat | 7,175 |
| Assam | **6,794** |
| Rajasthan (Kota) | 6,574 |
| J&K | 6,327 |
| Uttar Pradesh (Lucknow) | **5,395** |
| Manipur | 5,945 |
| Bihar (out of scope) | 5,080 |

NE is **not one number**. Sikkim/Chandigarh-class vs Manipur vs Assam differ as much as Lucknow vs Bengaluru. Food composition (rice, fish, fermented items, fuel logistics) can differ even when headline π is lower.

Lived NE specifics (qualitative, not a fake CPI): fuel/transport to the rest of India, fewer private hospital chains outside Guwahati, different vegetable seasonality, security/logistics premia. Put in lived flags if Q1 city is NE — **do not** hardcode +3% education.

IESH already includes **Guwahati** among 19 cities. Use it as perception, not as π.

---

## 4. Implications for the questionnaire (urban-only)

| Item | Change |
| --- | --- |
| Q1 place | `metro \| tier1 \| tier2 \| tier3` **or** city pick from an expanded `CITIES` list. **Delete `rest`.** Roof still `own_no_emi \| rent \| emi`. |
| Q1 rates | **State Urban** for the city’s state, not All-India Combined as the personal mix. Contrast Combined *and* All-India Urban vs **your State Urban**. |
| Q2 bands | Recut for **this** population, not HCES all-urban mean. `<50k` still needed (Kota/Lucknow salaried). `5L+` still a tiny tail. State whether band is **cash outflow** (rent/EMI/school) — that is the right proxy for *your* users. |
| Owners in metros | Still common. Zeroing housing remains a **cash COLI** choice, not MoSPI. Metro renters are over-represented among *app* users — default UX can assume renter **without** claiming that is “urban India”. |
| City list | Expand beyond current 10 cities; add at least the named set. Tier3 = product class, not RBI. |

---

## 5. Revised grades (this scope)

| Dimension | Grade now | Why |
| --- | --- | --- |
| Fit to **addressable users** (metro–T3) | **Pass, if labelled** | Same six questions were always this slice. |
| Fit to **India** | **N/A** | Out of scope by decision. |
| “Gov is wrong, 24k is fake” | **Fail as copy** | Gap A+B are real; MoSPI is the average, not a lie. |
| NE | **Pass with State Urban** | Different **levels**; recent official **rates** often *lower*. |
| Completeness of metrics | **Still fail** | State Urban is now **in-scope mandatory**, not a nice-to-have. |
| Freeze | **Still no** | Lived band + owner/EMI hygiene unchanged. |

---

## 6. Required fixes (additional)

1. README: urban million-plus / HRA / listed cities only; not rural; not “India’s inflation is fake”.  
2. Engine: **State/UT Urban** division YoYs keyed by city. All-India Combined = comparison line only.  
3. Ledger: show **your rent share vs HCES urban 6.58%** (and vs urban 04.1 weight). That is the 24k lesson without quoting 24k as a budget.  
4. If official rent π < rest, **do not** imply more rent share always means higher π.  
5. No NE dummy. Guwahati = Assam Urban.  
6. Define tier list in one table; align `CITIES` + `CITY_TIERS` (add `tier3`).  
7. Listing-site rents: **lived / illustration**, never ingested as MoSPI.
