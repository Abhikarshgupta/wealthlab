# SGB Calculator Implementation Plan

## Input Fields
1. Gold Amount (grams): 1-1000 grams
2. Tenure: 8 years (fixed, exit option after 5)
3. Fixed Rate: 2.5% (fixed)
4. Gold Appreciation Rate: User input (default 8%)
5. Adjust for Inflation: Toggle

## Calculation Logic
- Fixed Interest: 2.5% p.a. on principal
- Gold Appreciation: Based on user input rate
- Final Value = Principal × (1 + goldRate)^years + (Principal × fixedRate × years)

## Reference
- See PLAN-PPF.md for structure
- Unique: Dual return (fixed + gold appreciation)
