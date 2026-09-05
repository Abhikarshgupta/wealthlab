# Personal inflation — what we want

**Status:** Research + questionnaire + engine + **results** PRDs. Product shape **locked** in [research/decision.md](research/decision.md). Interview: **[prd/questionnaire/PRD.md](prd/questionnaire/PRD.md)**. Mix and π: **[prd/engine/PRD.md](prd/engine/PRD.md)**. Page: **[prd/results/PRD.md](prd/results/PRD.md)**. Ingest still later.

**One sentence:** City → State Urban rates; a short **interview** (no sliders) sets mix `w` and lived flags; the engine combines official `π_i` vs labelled lived seeds into **your estimate** vs Combined — then they can apply it to calculators.

**Not:** a state-CPI dashboard with no personal number. **Not:** self-picked tiers. **Not:** rupee spend as inflation. **Not:** calling lease/premium jumps MoSPI.

## The gap

Official CPI is an **average mix** and **sampled prices**. Your rent share and your lease jump are different. Real return on 12% is very different at 2% vs 10% inflation. The tool exists to get **one honest personal π** without a census.

- **Rates** `π_i`: State Urban / MoSPI by default; **jumped** answers swap that line to a labelled lived seed.  
- **Shares** `w_i`: Chapter 2 persona. Not rupees.  
- **City → state:** hardcoded list + `stateUt` in source. No Bengaluru CPI. No live CPI fetch.

## Flow

1. Chapter 1: city / state (hardcoded).  
2. Chapter 2: household mix (roof, who, commute, dining, CAM, help, pet).  
3. Chapter 3: what moved (only beats Chapter 2 unlocked; usual vs jumped).  
4. Results: **your estimate** as hero; why it moved; mix sliders (real bills only) re-run the engine.  
5. Opt-in: push **your estimate** into `InflationToggle` / corpus.

Copy: official-weighted uses MoSPI rates. Your estimate includes lived seeds on flagged lines. Device-only. Interview: [prd/questionnaire/PRD.md](prd/questionnaire/PRD.md). Numbers: [prd/engine/PRD.md](prd/engine/PRD.md).

## Layers (label them)

| Layer | What | Calculator |
| --- | --- | --- |
| Combined / State Urban headline | Published | Comparison only |
| Official-weighted | Persona `w` × MoSPI `π_i` | Optional “use official mix” |
| **Your estimate** | Same `w`, lived seeds on flagged lines | **Default apply** — this is the feature |

## Doc map

| File | Depth |
| --- | --- |
| [research/decision.md](research/decision.md) | Locked shape |
| [research/inflation-vs-weights.md](research/inflation-vs-weights.md) | Rate vs rupees vs shares |
| [prd/questionnaire/PRD.md](prd/questionnaire/PRD.md) | **Questionnaire PRD** (copy, controls, mapping) |
| [prd/engine/PRD.md](prd/engine/PRD.md) | **Engine PRD** (ledger, `w` templates, lived resolver, overlay, guardrails) |
| [prd/results/PRD.md](prd/results/PRD.md) | **Results PRD** (hero, why, mix sliders, apply) |
| [prd/T1-TEST-PLAN.md](prd/T1-TEST-PLAN.md) | **T1** scenario cards, matrix, golden plan (`PI-*`) |
| [prd/TEST-SUITE-REVIEW.md](prd/TEST-SUITE-REVIEW.md) | **T2/T3** audit closure — spec complete, I2 RED list |
| [research/questionnaire.md](research/questionnaire.md) | Ancestor notes — PRD wins on wording |
| [research/lived-vs-official.md](research/lived-vs-official.md) | What may be overridden |
| [research/weights-kids-wealth.md](research/weights-kids-wealth.md) | Shares, not stacked pp per child |
| [research/category-rates.md](research/category-rates.md) | Per-line YoY, URLs, naive means; engine uses MoSPI default |
| [research/overlays.md](research/overlays.md) | No hardcoded 8–14% as MoSPI |
| [research/sources.md](research/sources.md) | HCES, RBI, what is not a price index |
| [research/product-shell.md](research/product-shell.md) | Header, history, apply |
| [research/audit/](research/audit/README.md) | Audit (hygiene still applies) |

## Working rules

- No advice copy.  
- Your estimate ≠ MoSPI.  
- No rupee outflow bands as π.  
- No self-identified tier.  
- CII stays elsewhere.
