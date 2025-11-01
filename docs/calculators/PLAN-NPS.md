# NPS Calculator Implementation Plan

## Input Fields
1. Monthly Contribution: Amount
2. Tenure: Years
3. Asset Allocation:
   - Equity: 0-75% (default 50%)
   - Debt: 0-100% (default 30%)
   - Corporate Bonds: 0-100% (default 20%)
4. Expected Returns per Asset Class:
   - Equity: 12% (default)
   - Debt: 8% (default)
   - Corporate Bonds: 9% (default)
5. Adjust for Inflation: Toggle

## Calculation Logic
- Weighted return based on allocation
- SIP formula for monthly contributions
- Total = Sum of (Allocation % × Expected Return × Contribution)

## Reference
- See PLAN-SIP.md for SIP structure
- Unique: Asset allocation with weighted returns
