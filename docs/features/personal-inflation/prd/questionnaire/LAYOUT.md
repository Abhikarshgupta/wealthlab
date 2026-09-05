# Questionnaire layout (pages 1–3)

Visual and interaction spec for the interview. Copy ids and mapping stay in [PRD.md](PRD.md). Results chrome: [results PRD](../results/PRD.md). Route: `/personal-inflation`.

## Job

A **calm interview**, not a census and not a dashboard. Same family as the corpus simulator (green selected states, numbered steps, white card on gray) but **narrower** (~672px): one conversation, not a 3-column instrument grid.

Four pages. This file covers **1–3**. Page 4 is a results shell until the engine lands.

| Page | Title in stepper | User question |
| --- | --- | --- |
| 1 | Place | Where you live |
| 2 | Household | How does this year get spent? |
| 3 | Bills | What actually jumped? |
| 4 | Your number | What is my inflation? |

## Principles (financial tool)

1. **Trust over drama.** No “CPI is fake,” no red scare, no 12% hero on page 1.
2. **Consequence before control.** Each chapter: why we ask → tiny example → the control.
3. **One idea per page.** Place is geography. Household is mix (`w`). Bills are lived flags. Do not mix rate sliders or ₹ here.
4. **Show the year, not the loudest bill.** Examples always mix (“rent jumped; groceries did not”).
5. **Device-only, no income.** Privacy sits under the first control, not in a legal dump.
6. **Selected is obvious.** Green border + fill, same as corpus instrument cards.
7. **Quiet path stays short.** Chapter 3 only renders unlocked beats; a household with few chips sees a one-line “short health check.”

Do **not** show: MoSPI, 04.1, π, floors, caps, overlay %, tier, rupee bands.

## Information hierarchy (every chapter)

```
kicker     Step n of 3          (green, uppercase, small)
title      The question
why        One sentence
example    One line in a green tint box
controls   Radios / chips / search
helper     Under the legend, 1 line
nav        Back (secondary) · Continue (primary green)
```

Sticky **progress** above the card (four circles). Sticky **number** only on page 4.

## Page 1 — Place

Searchable city. Chip after pick: *We use {state} urban prices, not a {city} index.*  
Fallback: “My city isn’t listed” → state/UT select. Still urban. No map, no GPS, no tier.

Example: *Bengaluru uses Karnataka urban prices — not a Bengaluru index.*

## Page 2 — Household (one screen, grouped)

Order matches the PRD: roof → who (chips) → commute → dining → CAM (after roof).

Roof helpers: EMI is repayment, not a price; owners start from cash housing.  
Who: select all; blank = just me / us. School 1 and 2+ exclusive; sandwich allowed.

Visual: full-width radio cards; commute can be 3-up on tablet. Chips wrap.

## Page 3 — What moved

Always: care, own premium. Then only unlocked beats (lease, CAM, school, coach, elder, help, motor).

Radios: *About the same* | *It jumped* (lease: *Same lease* | *New lease or reset*).  
“About the same” is a real answer — not a skip.

Premium “whose jumped” chips from Chapter 2 roles + **None jumped**.

## Home / landing

Hero: third CTA **What’s my inflation?** (outline, green-tinted border).  
Compact band under the hero: three short cards (mix ≠ national average; loud bill ≠ inflation; apply to calculators) + the same CTA.  
Feature grid includes the tool. Header: **My inflation**. Footer: same label.

## Motion and density

Fade-in already on home. Interview: no decorative float icons on questions. Prefer `prefers-reduced-motion`. Touch targets ≥ 44px on radios/chips. Primary continue disabled until the chapter is valid; first missing field as helper text, not a modal.

## Acceptance (layout)

- Pages 1–3 never include sliders or ₹.
- Example box present on every chapter.
- Chapter 3 question count follows Chapter 2.
- Home CTA reaches `/personal-inflation`.
- Page 4 may be a stub; it must not invent a fake 6.6%.
