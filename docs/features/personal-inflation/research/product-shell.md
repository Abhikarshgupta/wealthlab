# Product shell — notes, not a PRD

WealthLab already has a global inflation toggle (`InflationToggle`, `userPreferencesStore`, default 6%). This tool should **feed that number**, not fork 16 calculators.

## Intent

- Page like `/personal-inflation`, mobile / tablet / desktop.  
- After city + interview: **your inflation** sticky; **pay illustration** + **SIP graph** (what ₹10k/month buys); then bills. Apply your inflation into `InflationToggle`.  
- **Lifestyle** (upgrades) is display only; not in the applied rate.  
- Calculators get **your inflation** unless they pick the published mix.  
- **History:** last 10 completed runs, this browser, prefill; **Personal (est.)** in header opens this page. Manual 6% unchanged.  
- Corpus `generalInflationRate` updates on opt-in.  
- Tone: two ways to read money; no advice; no scare.  
- Legal: illustrative; not tax; lived band ≠ MoSPI. Salary ₹ on results is illustration only.

## Out / later

AA, live scrape, life-event timeline, cloud sync, full salary-hike / CTC product, CII. Results may show **keep-up pay arithmetic**, not a negotiator.

## When to write PRDs

After the [README](../README.md) research list is agreed: separate short PRDs for **engine**, **UX**, **ingest/legal**.
