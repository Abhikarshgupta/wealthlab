# Other data sources

Full **numbers + URLs per line** (tomato, rent, petrol, …): **[category-rates.md](category-rates.md)**.

| Source | Role | Link |
| --- | --- | --- |
| MoSPI CPI 2024 | Official **π** for official-weighted | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298247 (Jul 2026 P) |
| eSankhyiki | Item / State CPI | https://esankhyiki.mospi.gov.in/ |
| HCES 2023-24 | Default **shares** `w`, not π | https://www.mospi.gov.in/sites/default/files/publication_reports/HCES%20FactSheet%202023-24.pdf |
| DPIIT WPI | Wholesale; petrol **not** pump CPI | https://eaindustry.nic.in/press_release/press_release_202608.pdf |
| RBI HPI | House **sale** prices | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63436 |
| NHB Residex | House **sale** prices | https://residex.nhbonline.org.in/ |
| Labour Bureau CPI-IW | DA / centres; different index | https://labourbureau.gov.in/CPI |
| RBI IESH | Perceived inflation, 19 cities | https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63114 |
| Listing / Aon / IRDAI | Lived seeds only | See category-rates.md |

MoSPI is the source of truth for **“vs official CPI.”** `naive_mean` is the average of listed prints for the sources column — not the official line.
