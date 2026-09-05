# Category rates and sources

**Vintage:** 29 Aug 2026. **Primary print:** CPI **July 2026 provisional** (released 12 Aug 2026).  
**Engine rule:** official-weighted `π_i` = **MoSPI default** in this file.  
**`naive_mean`:** arithmetic mean of the **numeric YoYs listed in that row**. Unlike series (CPI rent vs Residex vs listing; CPI 07.2 vs WPI mineral oils; tomato June vs July). **Show every source in the UI sources column.** Do not call the mean MoSPI.

Item-level State indices: [eSankhyiki CPI](https://esankhyiki.mospi.gov.in/) (thin samples — footnote).

---

## Master links (always cite)

| What | Link |
| --- | --- |
| CPI Jul 2026 P (headline, CFPI, housing, tomato, annexures I–III) | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298247 |
| Same, MoSPI PDF | https://www.mospi.gov.in/themes/product/9-consumer-price-index-cpi |
| CPI Jun 2026 P (tomato +31.92, 04.1, groups) | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2284125 |
| Jun 2026 PDF | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1783937698596_1013f1a1-3400-41aa-b4f4-5bbff10db7b7_Press_Release_of_CPI_for_June_2026.pdf |
| eSankhyiki (item / State) | https://esankhyiki.mospi.gov.in/ |
| CPI metadata (housing method, petrol as-of 15th) | https://www.mospi.gov.in/sites/default/files/CPI/National_Metadata_Structure_for_CPI.pdf |
| Expert Group (weights, Div 12 = 0) | https://www.mospi.gov.in/uploads/documents/documents/1769670534541-Export_report_CPI.pdf |
| HCES 2023-24 factsheet (shares, not π) | https://www.mospi.gov.in/sites/default/files/publication_reports/HCES%20FactSheet%202023-24.pdf |
| WPI Jul 2026 P | https://eaindustry.nic.in/press_release/press_release_202608.pdf |
| RBI HPI Q1 2026-27 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63436 |
| NHB Residex (sale prices) | https://residex.nhbonline.org.in/ |
| Labour Bureau CPI-IW | https://labourbureau.gov.in/CPI |
| RBI IESH (perception, 19 cities) | https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63114 |
| IRDAI health premium FY25 (~9% premium, not CPI 06) | IRDAI Annual Report 2024-25 (use irda.gov.in annual report page when linking in UI) |
| Aon medical trend India ~12% 2024 / ~13% 2025 (insured book) | Aon Global Medical Trend Rates (industry; not MoSPI) |

Machine copy of key rows: [data/category-rates.json](data/category-rates.json).

---

## How to read `naive_mean`

Example **tomato:** Jun **+31.92** and Jul **−4.59** → mean **+13.67**. That is **not** “tomato inflation.” It is the average of two official months. Engine uses **latest month (−4.59)** unless the PRD says 12-month average.

Example **petrol:** CPI 07.2 **7.36** and WPI mineral oils **32.4** → mean **19.88**. Wholesale ≠ pump. Engine uses **7.36**.

---

## Headline and food

| Category | MoSPI default (engine) | Other prints (all shown) | naive_mean |
| --- | --- | --- | --- |
| Headline Combined | **4.45** Jul P | Urban 3.96; Rural 4.84; Jun Combined 4.38; WPI 9.78 | (4.45+3.96+4.84+4.38+9.78)/5 = **5.48** |
| CFPI / Food group 01.1 | **5.52** Combined Jul (01.1 = CFPI) | Urban food 5.05; Rural 5.79; WPI food articles 5.44 | (5.52+5.05+5.79+5.44)/4 = **5.45** |
| **Tomato** (wt 0.4961) | **−4.59** Combined Jul | Jun **+31.92** (same PIB tables) | (31.92−4.59)/2 = **13.67** |
| Onion | **22.54** Combined Jul | Jun 4.73 (press comparison) | (22.54+4.73)/2 = **13.64** |
| Ginger | **83.62** Jul | Jun 50.41 | **67.02** |
| Garlic | **35.36** Jul | Jun 17.93 | **26.65** |
| Potato | **−16.56** Jul | — | **−16.56** |

Tomato / onion / ginger / garlic / potato: [PIB 2298247](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298247). June tomato: [PIB 2284125](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2284125).

---

## Rent / housing (the 2% vs 10% line)

| Category | MoSPI default (engine) | Other prints | naive_mean |
| --- | --- | --- | --- |
| **Actual rents 04.1** | Combined **2.11**; use **Urban 1.96** for urban personas | Jun Combined 1.99 / Urban 1.87 | CPI-only (Jul U+C, Jun U+C): (1.96+2.11+1.87+1.99)/4 = **1.98** |
| Housing division 04 | Combined **2.16** (Jul); Urban **1.98** | Housing headline 2.22 (press “Housing inflation”) | — |
| 04.3 maintenance / security | Combined **3.40** | Urban 3.18 | **3.29** |
| House **prices** (not rent) | *Do not use as 04.1* | RBI HPI **+3.6** YoY Q1 FY27; Residex city HPIs | — |
| Lived seed (slider default, not MoSPI) | — | Bengaluru 2BHK asking ~**8–15** YoY (portal) | midpoint **12** as *slider start* only |

Rent CPI: [PIB 2298247](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298247) Annexure II.  
RBI HPI: https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63436  
Residex: https://residex.nhbonline.org.in/  
Listing sample (lived, not official): https://www.nestriqo.com/blog/rental-price-trends-in-bangalore  

**Naive mean of 1.96 + 12 + 3.6 = 5.85.** That mixes rent CPI, sale prices, and asking rents. **Do not** put 5.85 in official-weighted. UI sources column lists all three.

---

## Petrol / transport

CPI does **not** put “petrol” in the Jul top-5 item table. Pump prices enter CPI as of the **15th** ([metadata](https://www.mospi.gov.in/sites/default/files/CPI/National_Metadata_Structure_for_CPI.pdf)). Closest published **retail** group: **07.2**.

| Category | MoSPI default (engine) | Other prints | naive_mean |
| --- | --- | --- | --- |
| **07.2 Operation of personal transport** (petrol, diesel, service, etc.) | Combined **7.36**; Urban **7.37** | same Jun 7.35 Combined | **7.36** |
| Transport division 07 | Combined **4.43** | Urban 4.37 | **4.40** |
| 07.1 Purchase of vehicles | Combined **−4.37** | — | **−4.37** |
| 07.3 Passenger transport | Combined **2.90** | Urban 3.01 | **2.96** |
| WPI mineral oils | *not engine* | **32.4** Jul P | — |
| WPI fuel & power | *not engine* | **20.05** | — |

CPI groups: [PIB 2298247](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298247).  
WPI: https://eaindustry.nic.in/press_release/press_release_202608.pdf  

Naive mean 7.36 and 32.4 = **19.88** (label: mixed retail/wholesale).

---

## Health, education, dining, help, gold

| Category | MoSPI default (engine) | Other prints | naive_mean |
| --- | --- | --- | --- |
| Health division 06 | Combined **1.34**; Urban **1.37** | 06.1 medicines Combined 1.26; 06.2 OPD Combined 1.58; 06.3 IPD Combined 1.57 | CPI groups ~**1.4** |
| Lived health | *slider* | IRDAI health **premium** FY25 ~**9**; Aon India medical trend **12–13** | (9+12.5)/2 = **10.8** as lived seed, not Div 06 |
| Education division 10 | Combined **3.64**; Urban **4.17** | 10.1 Combined 4.25; 10.2 Combined 4.33; 10.4 Combined 3.52 | **~4** |
| Restaurants 11.1 | Combined **7.75** | Urban 7.71 | **7.73** |
| Household maintenance 05.6 (help/sampled) | Combined **1.87**; Urban **1.77** | — | **1.82** |
| Gold/jewellery 13.2 | Combined **43.54** Jul (other personal effects) | Gold/diamond/platinum jewellery Jun **36.82** (item); Div 13 Combined Jul **14.77** | do not average 43 with 14.77 blindly — 13.2 is the jewellery shock |

Health/education/11.1/05.6/13: [PIB 2298247](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298247) Annexure I–II.

---

## State Urban headlines (city → this table)

July 2026 Combined / **Urban** YoY, [PIB 2298247](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298247) Annexure III.

| State/UT (example city) | Urban YoY | Combined YoY |
| --- | --- | --- |
| All-India | 3.96 | 4.45 |
| Assam (Guwahati) | **2.53** | 3.49 |
| Chandigarh | **4.30** | 4.30 |
| Gujarat (Vadodara) | **3.87** | 4.01 |
| Jammu & Kashmir | **4.22** | 3.87 |
| Karnataka (Bengaluru) | **4.37** | 4.89 |
| Kerala (Kochi) | **3.27** | 4.01 |
| Maharashtra (Mumbai) | **3.54** | 4.09 |
| Rajasthan (Kota) | **3.84** | 4.82 |
| Uttar Pradesh (Lucknow) | **3.62** | 4.74 |

Rajasthan Urban **3.84** Combined **4.82** (same annexure).

---

## HCES 2023-24 **shares** (weights, not inflation)

https://www.mospi.gov.in/sites/default/files/publication_reports/HCES%20FactSheet%202023-24.pdf Statement 4.

| Slice | Rural % of MPCE | Urban % of MPCE |
| --- | --- | --- |
| Food | 47.04 | 39.68 |
| Education | 3.24 | 5.97 |
| Medical | 6.83 | 5.85 |
| Conveyance | 7.59 | 8.46 |
| Rent | 0.56 | **6.58** |

CPI Combined **weights** (HCES 2023-24 → CPI 2024) food **36.75**, housing **17.66**, health **6.10**, education **3.33**, transport **8.80** — Expert Group Annexure 5.3a.

---

## UI sources column (spec)

For each line the user sees (tomato, rent, petrol, …):

1. **Official:** MoSPI default + URL + month.  
2. **Also published:** every other print + URL + one-line “this is not the same thing.”  
3. **naive_mean:** number + “average of listed prints; not MoSPI.”

JSON: [data/category-rates.json](data/category-rates.json) — extend per ingest month.
