# Inflation rates vs spend vs shares (do not mix)

Three different jobs got stacked into one questionnaire. Split them.

## 1. Inflation is a **rate**, not a budget

If rent prices in the official sample rose **2%**, that **2% is the inflation number**. It does not matter whether the household pays ₹8,000 or ₹50,000 rent. **Rupee spend does not enter the inflation formula.**

₹24k vs ₹1.5L **household outflow is irrelevant to π** if the **mix is the same**.

## 2. When (and only when) **shares** matter

A **single** “your inflation” for SIP is a **weighted average** of published category rates:

`π = w_food × π_food + w_rent × π_rent + …` with `w` summing to 100%.

The `w` are **percent of the basket**, not rupees. Two renters both putting **40%** of consumption on rent get the **same** official-weighted π, whether rent is ₹15k or ₹60k.

Shares matter **only** to combine many rates into one π. They are not “how much you spend.”

If we **do not** combine — we only **show** State Urban food / housing / education / headline vs Combined — then **shares do not matter at all**. That product is “inflation numbers for your geography.”

## 3. What we should ask: city → state, not “what tier am I?”

People will pick **Tier 1** because it sounds like them. That is not a price series. There is **no MoSPI tier CPI**. Informal T1/T2/T3 ≠ RBI tiers ≠ HRA X/Y/Z.

**Ask city** (from a list). Derive **State/UT Urban** rates. Show Combined (and all-India Urban) as the comparison line.

Do **not** ask the user to self-classify metro/T1/T2/T3 for inflation. Optional: after city, **show** “we use Karnataka Urban” so they learn. If the city is missing, ask **state** only (still Urban).

There is still **no Bengaluru CPI**. City is a **key** to the state table.

## 4. This product is **B + lived sliders** (not A)

A (geography rates only) is **not** the feature. See [decision.md](decision.md).

Questionnaire = **persona bucket** (default `w`, which sliders to offer). Then sliders for **actual `w` and some `π_i`**. Rent +10% vs MoSPI +2% is a **rate override**, then weighted. That is “your inflation.”

Do **not** ask rupee outflow. Do **not** ask tier. **Do** ask city → state.
