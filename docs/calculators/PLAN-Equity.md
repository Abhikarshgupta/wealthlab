# Equity Calculator Implementation Plan

## Input Fields
1. Investment Type: SIP or Lumpsum (radio)
2. Amount: Investment amount
3. Tenure: Years
4. Expected CAGR: User input (default 12%)
5. Adjust for Inflation: Toggle

## Calculation Logic
- SIP: Use calculateSIPFutureValue()
- Lumpsum: Use calculateCompoundInterest()
- Market-linked returns

## Reference
- See PLAN-SIP.md for SIP structure
- Support both SIP and lumpsum modes
