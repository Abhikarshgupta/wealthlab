# MoSPI CPI — what we can actually put in a file

All-India **CPI Rural / Urban / Combined**, base **2024=100**. Monthly press note + Excel annexure. ~12th of next month, 4pm IST. Provisional then final.

- **Dashboard “official” contrast:** Combined **and** All-India Urban general YoY.  
- **Personal mix rates:** **State/UT Urban** division YoY for the user’s city (not Combined; not a city CPI).  
- **Category rates:** Urban YoY for 12 divisions (**01–11 and 13**). Groups e.g. **04.1** rents, **07.2** vehicle running (petrol proxy). Item e.g. tomato. Ingest: [category-rates.md](category-rates.md).  
- **Latest Combined used in research:** Jul 2026 P **4.45%** headline; CFPI **5.52%**; 04.1 Combined **2.11%**.  
- **Not:** Bangalore CPI, household CPI, years of 12-division history (new basket YoY from ~Jan 2026). Headline back series exists; **do not splice** 2012 six groups onto 2024 divisions.  
- **Ingest:** human copy into versioned JSON. data.gov.in was **not** a live 2024 feed (checked Aug 2026). API manual is **2012-series** — not V1 production.  
- **License:** attributed extract; no logo; legal picks GODL vs website copyright.  
- **Markers:** MoSPI = food/groups/items. RBI MPR may mention geopolitics — **separate byline**.

Label honestly: personal mix uses **Urban** category rates; the headline we contrast is **Combined**.
