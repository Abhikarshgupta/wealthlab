# Open Issues - Corpus Calculator

**Last Updated:** 2024  
**Status:** Active Development

---

## Overview

This document tracks open issues and enhancements for the Corpus Calculator. All critical tax compliance issues have been resolved. Remaining items are enhancements or incomplete features.

---

## 🔴 High Priority Issues

### Issue 1: Tax During Accumulation - Incomplete Implementation

**Status:** ⚠️ Partially Implemented  
**Priority:** High  
**Location:** `src/utils/taxCalculations.js:412-461`

**Problem:**
The `calculateTaxDuringAccumulation` function only handles 'interest' type instruments (FD, NSC, SCSS). Missing implementations for:

1. **SGB Interest Tax** - 2.5% fixed interest taxable annually
   - Should calculate: `Principal × 2.5% × tax slab` per year
   - Currently: Returns zeros

2. **REITs Dividend Tax** - Dividend income taxable annually
   - Should calculate annual dividend tax if dividend rate provided
   - Currently: Returns zeros

3. **Year-by-Year Breakdown** - Missing for all instruments
   - Should show annual tax paid, interest earned, net corpus growth
   - Currently: Only simplified calculation for interest type

**Required Changes:**
- Implement SGB annual interest tax calculation
- Implement REITs annual dividend tax calculation
- Add comprehensive year-by-year breakdown for all instruments
- Update UI to display annual tax breakdown

**Impact:** Users selecting "Tax During Accumulation" method see incomplete calculations.

---

## 🟡 Medium Priority Enhancements

### Issue 2: Old Tax Regime Option Missing

**Status:** ⚠️ Not Implemented  
**Priority:** Medium  
**Location:** `src/components/corpus/TaxBracketSelector.jsx`

**Problem:**
Currently only New Tax Regime (FY 2024-25) is available. Users cannot select Old Tax Regime.

**Old Tax Regime Slabs:**
- 0%: Income up to ₹2.5L
- 5%: Income ₹2.5L - ₹5L
- 20%: Income ₹5L - ₹10L
- 30%: Income above ₹10L

**Required Changes:**
- Add toggle: "New Tax Regime" vs "Old Tax Regime"
- Update tax slab arrays based on regime selection
- Update UI labels dynamically

**Impact:** Users preferring Old Tax Regime cannot use accurate calculations.

---

## 🟢 Low Priority Enhancements

### Issue 3: Actual CII Lookup Table

**Status:** ⚠️ Using Simplified Method  
**Priority:** Low  
**Location:** `src/utils/taxCalculations.js:225`

**Problem:**
Debt mutual fund indexation uses fixed 6% assumption instead of actual Cost Inflation Index (CII) values.

**Current Implementation:**
```javascript
const indexationFactor = Math.pow(1.06, tenure) // Simplified indexation
```

**Required Changes:**
- Create CII data table (FY-wise from CBDT)
- Replace 6% assumption with actual CII lookup
- Update calculation to use: `CII(year_of_sale) / CII(year_of_purchase)`

**Impact:** Minor accuracy improvement. Current method is acceptable per CA audit.

**Note:** Disclaimer already added in UI (line 440 of InstrumentBreakdownTable.jsx).

---

### Issue 4: Proper FIFO for SIP Tax Calculation

**Status:** ⚠️ Using Simplified Method  
**Priority:** Low  
**Location:** `src/utils/taxCalculations.js`

**Problem:**
SIP tax calculation treats entire corpus as single investment instead of using FIFO (First In, First Out) method per installment.

**Current Implementation:**
- Treats entire SIP corpus as one investment
- Uses simplified LTCG calculation

**Required Changes:**
- Implement proper FIFO logic (only for standalone SIP calculator)
- Calculate tax per installment based on holding period
- Apply ₹1L exemption per financial year across all installments

**Impact:** Minor accuracy improvement. Current method is acceptable per CA audit for corpus calculator.

**Note:** 
- Disclaimer already added in UI (line 435 of InstrumentBreakdownTable.jsx)
- Per CA audit: Acceptable for corpus calculator if disclaimed
- Consider implementing only in standalone SIP calculator, not corpus calculator

---

## ✅ Completed Issues (Reference)

### Fixed Issues:
1. ✅ **timeHorizon Application** - All instruments now cap tenure with timeHorizon
2. ✅ **Tax Slabs Updated** - FY 2024-25 New Tax Regime implemented
3. ✅ **LTCG Exemption Sharing** - Exemption shared across equity instruments
4. ✅ **TDS Consideration** - TDS calculation added for FD/SCSS
5. ✅ **NPS Negative Returns** - Edge case handling fixed
6. ✅ **Disclaimers Added** - SIP FIFO, indexation, surcharge/cess disclaimers

---

## Implementation Priority

### Phase 1: High Priority (Do First)
1. Complete Tax During Accumulation implementation
   - SGB interest tax
   - REITs dividend tax
   - Year-by-year breakdown

### Phase 2: Medium Priority (Do Next)
2. Add Old Tax Regime option

### Phase 3: Low Priority (Optional Enhancements)
3. Implement actual CII lookup table
4. Implement proper FIFO for SIP (standalone calculator only)

---

## Testing Checklist

After implementing fixes, validate:

- [ ] Tax During Accumulation shows annual breakdown for all instruments
- [ ] SGB interest tax calculated correctly (2.5% annually)
- [ ] REITs dividend tax calculated correctly (if dividend rate provided)
- [ ] Old Tax Regime option works correctly
- [ ] Tax calculations match expected values for both regimes
- [ ] CII lookup (if implemented) uses actual values
- [ ] FIFO implementation (if done) works correctly in standalone SIP calculator

---

## Notes

- All critical tax compliance issues have been resolved
- Codebase is production-ready for "Tax on Withdrawal" method
- "Tax During Accumulation" method needs completion for full feature parity
- Simplified methods (SIP FIFO, CII assumption) are acceptable per CA audit if properly disclaimed

---

**Document Version:** 1.0  
**Status:** Active  
**Next Review:** After Phase 1 implementation

