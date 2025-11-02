# FD Calculator: Years + Months Input Enhancement Plan

## Problem Statement
Currently, the FD calculator and FD input form in the Corpus Calculator use radio buttons to toggle between "Years" and "Months" input modes. Users can only input either years OR months, not both simultaneously. This limits flexibility for scenarios like "1 year 3 months" or "2 years 6 months".

## Use Cases & Scenarios

### Use Case 1: Standard FD Investment
**Scenario**: User wants to invest ₹1,00,000 for 1 year and 3 months
- **Current Behavior**: User must choose either "1 year" or "15 months" (approximation)
- **Desired Behavior**: User inputs "1" year and "3" months directly
- **Expected Result**: Calculations based on exactly 1.25 years (1 year + 3 months)

### Use Case 2: Short-term FD
**Scenario**: User wants to invest for 6 months only
- **Current Behavior**: User selects "Months" radio and inputs "6"
- **Desired Behavior**: User inputs "0" years and "6" months
- **Expected Result**: Calculations based on 0.5 years

### Use Case 3: Long-term FD
**Scenario**: User wants to invest for 3 years and 11 months
- **Current Behavior**: User must choose either "3 years" or "47 months" (approximation)
- **Desired Behavior**: User inputs "3" years and "11" months
- **Expected Result**: Calculations based on exactly 3.9167 years

### Use Case 4: Existing Investment Tenure
**Scenario**: User has an existing FD that's been invested for 2 years and 4 months
- **Current Behavior**: User must approximate (2 years or 28 months)
- **Desired Behavior**: User inputs "2" years and "4" months
- **Expected Result**: Accurate projection of remaining tenure

### Use Case 5: Corpus Calculator Integration
**Scenario**: User selects FD in Corpus Calculator and wants to specify tenure as years + months
- **Current Behavior**: Uses radio toggle (years OR months)
- **Desired Behavior**: Separate inputs for years and months
- **Expected Result**: Consistent experience across FD Calculator and Corpus Calculator

## Technical Requirements

### 1. Data Structure Changes

#### Current Structure:
```javascript
{
  tenure: 5,           // Number
  tenureUnit: 'years' // 'years' | 'months'
}
```

#### Proposed Structure:
```javascript
{
  tenureYears: 1,     // Number (0 or positive integer)
  tenureMonths: 3,    // Number (0-11, integer)
  // OR keep backward compatibility:
  tenure: 5,          // Optional: Total tenure in years (for backward compatibility)
  tenureUnit: 'years' // Optional: For backward compatibility
}
```

### 2. UI Component Changes

#### FD Input Component (Corpus Calculator)
**File**: `src/components/corpus/InstrumentInputForms/FDInput.jsx`

**Current UI**:
```
Tenure: [5] (number input)
○ Years  ○ Months (radio buttons)
```

**Proposed UI**:
```
Tenure:
  Years:  [1]  (number input, min: 0, max: 10)
  Months: [3]  (number input, min: 0, max: 11)
```

#### FD Calculator Component
**File**: `src/components/calculators/FDCalculator/FDCalculator.jsx`

**Current UI**:
```
Tenure: [5] (number input)
○ Years  ○ Months (radio buttons)
```

**Proposed UI**:
```
Tenure:
  Years:  [1]  (number input, min: 0, max: 10)
  Months: [3]  (number input, min: 0, max: 11)
```

### 3. Utility Functions Required

#### New Utility Functions:
```javascript
// Convert years + months to total years (decimal)
function convertYearsMonthsToYears(years, months) {
  return years + (months / 12)
}

// Convert years + months to total months
function convertYearsMonthsToMonths(years, months) {
  return (years * 12) + months
}

// Normalize months (if user enters 15 months, convert to 1 year 3 months)
function normalizeYearsMonths(years, months) {
  const totalMonths = (years * 12) + months
  const normalizedYears = Math.floor(totalMonths / 12)
  const normalizedMonths = totalMonths % 12
  return { years: normalizedYears, months: normalizedMonths }
}

// Convert legacy format (tenure + tenureUnit) to years + months
function convertLegacyToYearsMonths(tenure, tenureUnit) {
  if (tenureUnit === 'months') {
    return {
      years: Math.floor(tenure / 12),
      months: tenure % 12
    }
  }
  return {
    years: Math.floor(tenure),
    months: Math.round((tenure % 1) * 12)
  }
}
```

### 4. Calculation Updates

#### Files to Update:
1. **`src/components/calculators/FDCalculator/useFDCalculator.js`**
   - Update to accept `tenureYears` and `tenureMonths` instead of `tenure` and `tenureUnit`
   - Convert to total years for calculations
   - Maintain backward compatibility

2. **`src/utils/corpusCalculations.js`**
   - Update `calculateInstrumentCorpus` for FD case
   - Handle years + months input for FD

3. **`src/components/calculators/FDCalculator/fdSchema.js`**
   - Update validation schema to include `tenureYears` and `tenureMonths`
   - Ensure at least one is > 0
   - Validate months range (0-11)

4. **`src/utils/corpusValidation.js`**
   - Update FD validation in `validateFutureInvestment`
   - Check for `tenureYears` and `tenureMonths` instead of `tenure`

### 5. Backward Compatibility

#### Migration Strategy:
1. **Legacy Data Support**: If `tenure` and `tenureUnit` exist, convert to `tenureYears` and `tenureMonths` on load
2. **Default Values**: If neither format exists, default to `tenureYears: 0, tenureMonths: 0`
3. **Display Logic**: Show appropriate placeholder values based on current state

#### Migration Code:
```javascript
function migrateFDData(instrumentData) {
  // If new format exists, use it
  if (instrumentData.tenureYears !== undefined || instrumentData.tenureMonths !== undefined) {
    return {
      ...instrumentData,
      tenureYears: instrumentData.tenureYears || 0,
      tenureMonths: instrumentData.tenureMonths || 0
    }
  }
  
  // If legacy format exists, convert it
  if (instrumentData.tenure !== undefined && instrumentData.tenureUnit) {
    const converted = convertLegacyToYearsMonths(
      instrumentData.tenure,
      instrumentData.tenureUnit
    )
    return {
      ...instrumentData,
      tenureYears: converted.years,
      tenureMonths: converted.months,
      // Keep legacy fields for now (can be removed later)
      tenure: instrumentData.tenure,
      tenureUnit: instrumentData.tenureUnit
    }
  }
  
  // Default to 0 years, 0 months (will be set to defaults by form)
  return {
    ...instrumentData,
    tenureYears: 0,
    tenureMonths: 0
  }
}
```

## Implementation Steps

### Phase 1: Utility Functions & Data Migration
1. Create utility functions in `src/utils/fdTenureUtils.js`
   - `convertYearsMonthsToYears(years, months)`
   - `convertYearsMonthsToMonths(years, months)`
   - `normalizeYearsMonths(years, months)`
   - `convertLegacyToYearsMonths(tenure, tenureUnit)`
   - `migrateFDData(instrumentData)`

2. Update validation schemas
   - `fdSchema.js`: Add `tenureYears` and `tenureMonths` validation
   - `corpusValidation.js`: Update FD validation logic

### Phase 2: FD Calculator Updates
1. Update `FDCalculator.jsx`
   - Replace radio buttons with two number inputs (Years and Months)
   - Update form state management
   - Update slider logic (if applicable)

2. Update `useFDCalculator.js`
   - Accept `tenureYears` and `tenureMonths` parameters
   - Convert to total years for calculations
   - Maintain backward compatibility

3. Update `FDCalculatorResults.jsx` (if needed)
   - Display tenure as "X years Y months" format

### Phase 3: Corpus Calculator Updates
1. Update `FDInput.jsx`
   - Replace radio buttons with two number inputs
   - Update `updateInvestment` calls
   - Handle migration from legacy format

2. Update `corpusCalculations.js`
   - Update FD case in `calculateInstrumentCorpus`
   - Handle years + months input

3. Update `corpusDefaults.js`
   - Update FD defaults to use `tenureYears` and `tenureMonths`

4. Update `ExistingInvestmentSection.jsx` (if FD existing investment needs tenure)
   - Support years + months for existing FD tenure

### Phase 4: Testing & Validation
1. Test all use cases mentioned above
2. Test backward compatibility with saved calculations
3. Test edge cases:
   - 0 years, 0 months (should show validation error)
   - 0 years, 12 months (should normalize to 1 year, 0 months)
   - Large values (e.g., 15 months should normalize to 1 year 3 months)
   - Decimal inputs (should be handled gracefully)

## Edge Cases & Validations

### Validation Rules:
1. **Minimum Tenure**: At least one of `tenureYears` or `tenureMonths` must be > 0
2. **Months Range**: `tenureMonths` must be 0-11 (will be normalized if > 11)
3. **Years Range**: `tenureYears` should be reasonable (0-10 or 0-20, depending on FD limits)
4. **Total Tenure**: Total tenure (years + months/12) should not exceed maximum allowed (e.g., 10 years)

### Normalization Behavior:
- If user enters `tenureMonths: 15`, automatically normalize to `tenureYears: 1, tenureMonths: 3`
- If user enters `tenureYears: 1.5`, normalize to `tenureYears: 1, tenureMonths: 6`
- Show real-time feedback when normalization occurs

### Display Format:
- **Input Labels**: "Years" and "Months"
- **Display Format**: "1 year 3 months" or "15 months" (if years = 0) or "2 years" (if months = 0)
- **Placeholders**: "0" for years, "0" for months

## Files to Modify

1. **New Files**:
   - `src/utils/fdTenureUtils.js` (utility functions)

2. **Modified Files**:
   - `src/components/corpus/InstrumentInputForms/FDInput.jsx`
   - `src/components/calculators/FDCalculator/FDCalculator.jsx`
   - `src/components/calculators/FDCalculator/useFDCalculator.js`
   - `src/components/calculators/FDCalculator/fdSchema.js`
   - `src/utils/corpusCalculations.js`
   - `src/utils/corpusValidation.js`
   - `src/utils/corpusDefaults.js`
   - `src/components/corpus/ExistingInvestmentSection.jsx` (if needed)

## Success Criteria

1. ✅ Users can input both years and months simultaneously
2. ✅ Calculations are accurate (years + months converted correctly)
3. ✅ UI is intuitive and clear
4. ✅ Backward compatibility maintained (existing saved calculations work)
5. ✅ Validation prevents invalid inputs
6. ✅ Normalization works correctly (e.g., 15 months → 1 year 3 months)
7. ✅ Consistent behavior across FD Calculator and Corpus Calculator
8. ✅ No breaking changes to existing functionality

## Open Questions

1. Should we auto-normalize months > 11, or show a validation error?
   - **Recommendation**: Auto-normalize with visual feedback

2. Should we allow decimal inputs for years/months?
   - **Recommendation**: Only integers for years, integers for months (0-11)

3. Should we keep legacy `tenure` and `tenureUnit` fields for backward compatibility?
   - **Recommendation**: Yes, but mark as deprecated

4. What should happen if user enters 0 years and 0 months?
   - **Recommendation**: Show validation error: "Please enter at least 1 month"

5. Should the slider (in FD Calculator) show combined years+months or separate sliders?
   - **Recommendation**: Combined slider showing total tenure with dual display

