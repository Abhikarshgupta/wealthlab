# Results PRD (V0)

**Status:** draft for implementation.  
**Job:** **your inflation** stays at the top. Below it, **one story at a time** (accordion): raise vs this number, then SIP, then bills.  
**Does not:** put salary beside the SIP graph; call the raise block “pay next year”; floors/caps; two slider banks; “ask HR for X%.”

Contracts: [questionnaire PRD](../questionnaire/PRD.md) §10; [engine PRD](../engine/PRD.md) §2, §9–10.

---

## 1. What the user needs to understand (plain language)

A college graduate who does not follow CPI.

**Your inflation is an average across a typical year — not your scariest bill.**

If rent went up 12%, that is not “my inflation is 12%.” Rent is only part of what a household spends. Groceries, power, travel, and the rest usually rose less (published food is around 5%, not 12%). Mix those together and the number lands around **6–8%**, not 10–12%, unless *most* bills jumped like rent.

That is why a renter’s first number looks “too low.” It is doing the job. The page must say so in one sentence **next to the big number**, not in a footnote.

Interview radios set the **starting** “went up.” Results is where they type what they believe.

**Never show:** floor, cap, 04.1, MoSPI, π, overlay. Clamp in silence.

---

## 2. What arrives

Engine `w` + seeded rates. They type over those. Apply writes **your inflation** (`pi_your_estimate`) into calculators. Big number at 1 decimal. Shares as whole %.

---

## 3. Layout

### What we tried and why it failed

| Layout | What it did | Why it breaks for a graduate |
| --- | --- | --- |
| **A.** Left: % + “pay next year” ₹. Right: SIP graph, then bills | Packed “so what” next to a chart | Salary and SIP are different questions. “Pay next year” sounds like a cost forecast, not *hike minus inflation*. Graph beside take-home ₹ — no relation. |
| **B.** Everything open, one long scroll | Honest, complete | Phone: % gone, then salary, graph, 11 bills. They never finish. |
| **C. (ship)** Number always on top. Then **three drawers**, one idea each | Same facts, ordered questions | Read top to bottom. Open only what they came for. |

Do not ship A.

### Information flow (the page is a conversation)

1. **What is my inflation?** → the big %.  
2. **Why isn’t it 12%?** → one sentence (rent is part of the year).  
3. **Did my raise keep up?** → hike % minus this inflation % = real income change. Optional: tax / in-hand.  
4. **What does a SIP still buy?** → graph (only after they care about investing).  
5. **Want a different %?** → bills (went up + share of year).

Salary and SIP never sit in the same visual cluster. Bills are last because they *edit* the number; interpretation comes first.

### Structure (desktop and phone — same)

```
┌─────────────────────────────────────────┐
│  Your inflation     6.6%                │  always visible (sticky)
│  one sentence why not 12%               │
│  [ Use 6.6% in calculators ]            │
├─────────────────────────────────────────┤
│  ▼ Did your raise keep up?              │  default OPEN
│      Letter hike [ 12 ]%                │
│      Your inflation     8%              │
│      Real change in pay  +4%            │
│      ▸ After tax (optional)             │
├─────────────────────────────────────────┤
│  ▶ What a SIP still buys                │  closed
│      graph lives only in here           │
├─────────────────────────────────────────┤
│  ▶ Change this 6.6%                     │  closed
│      one row per bill, two boxes        │
└─────────────────────────────────────────┘
```

Sticky = **only** the number, the sentence, apply. Not salary. Not the graph.

Drawers: independent. Default: raise **open**, SIP **closed**, bills **closed**. Desktop: **one column**, max ~640px. Two columns were the “couldn’t relate” bug.

### Drawer 1 — Did your raise keep up?

Not “pay next year.” Not a ₹ forecast next to a chart.

```
Real raise  ≈  salary increase %  −  your inflation %
```

Letter **12%**, inflation **8%** → raise bigger by **4%** (*keep last year’s lifestyle and a little left*). Gap **>5–15%**: *You did not just keep up. You pulled ahead.* Gap **>15%**: *This should feel like a good year, not a calculator.* Letter **4%**, inflation **6.6%** → prices ahead by **2.6%** (*letter went up; month still tighter*).

| Field | Copy | Prefill |
| --- | --- | --- |
| Salary increase | *Hike on the letter / CTC, %* | empty |
| Your inflation | Read-only, same as hero | 6.6 |
| Result | Outcome line + gap % (no signed minus on “beat”) | hike − inflation, 1 decimal |

No “ask for 10%.”

**After tax (nested, collapsed)**

CTC ≠ in-hand. Approximate only: extra CTC is taxed at **this year’s marginal slab**.

- Required when open: **Tax slab** (prefill from app preferences). Extra CTC is taxed at that marginal rate.  
- In-hand hike ≈ CTC hike × (1 − slab). Real raise after tax = in-hand − inflation.  
- **How we calculated this** shows the arithmetic. No cess, surcharge, or deductions. Last year’s slab is not asked — without rupee CTC it cannot change the hike math.

No monthly ₹ on this drawer by default. Changing hike does **not** change 6.6%.

### Drawer 2 — What a SIP still buys

Graph **only** in here. Demo ₹10,000 / month, 12% a year, 10 years. Two lines: buying power at your % vs India’s published figure. **Open SIP calculator** for tax, step-up, corpus. Graph moves when 6.6% moves.

### Drawer 3 — Change this 6.6%

| Box | Prefill | Editable |
| --- | --- | --- |
| **Went up** ___% | Jump → seed. Else published. | Every visible bill. |
| **Share of year** ___% | Engine mix | Yes, except Everything else. |

**This adds {x} points to your 6.6%.** Not EMI/gold/funds. Silent clamps. **Start over from your answers.**

---

## 4. Copy

Use: *your inflation*, *salary increase*, *real raise*, *went up*, *share of year*.  
Do not use: *pay next year*, MoSPI, floor, cap.

Apply: **Use 6.6% in calculators.** SIP CTA only inside drawer 2.

Foot: *Not tax advice. Not HR advice. Saved on this device.*

---

## 5. Why first paint is ~6–8%

Lucknow renter, lease 12%, school 8%, rest published → about **6.6%**. Near **11%** only if most bills also “went up” like rent.

---

## 6. Which bills appear

Rent (if they rent) → Groceries → School → CAM → Power → Help → Health → Car → Cabs/metro → Eating out → Everything else. Owners: no rent row.

## 7. Engine (silent)

Published rates for the comparison book. Typed went-up only changes your inflation. Shares sum to 100%.

## 8. Refuse

₹ in the interview. Two-column salary-beside-graph. “Pay next year.” Floor/cap labels. Full tax return. “Ask for X%.” Full SIP app on this page.

## 9. Acceptance

Sticky % only at top. Raise drawer: 12% − 8% = +4%. Tax nested. SIP graph not visible until that drawer opens. Bills last. Hike boxes do not change 6.6%.

## Changelog

| Date | Change |
| --- | --- |
| 29 Aug 2026 | First results PRD. |
| 29 Aug 2026 | Accordion flow: raise (hike − inflation), SIP, bills. Drop “pay next year.” |
| 5 Sep 2026 | Raise copy: outcome lines (lifestyle left / month tighter) + unsigned gap %. After tax: slab × hike. |
| 5 Sep 2026 | Positive gap bands: ≤5% little left; >5–15% pulled ahead; >15% good year. |
