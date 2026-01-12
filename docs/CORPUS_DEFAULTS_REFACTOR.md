# Corpus Calculator Defaults Refactor Plan

## Executive Summary

This document outlines critical architectural issues in the corpus calculator's default initialization system and proposes a comprehensive refactor following frontend engineering best practices.

## Critical Issues Identified

### 1. **useEffect Anti-Pattern: Side Effects on State Changes**

**Location**: `src/pages/CorpusCalculatorPage/CorpusCalculatorPage.jsx:103-110`

**Problem**:
- Initialization happens in `useEffect` that triggers on `currentStep` change
- Creates race conditions between state updates and component renders
- Exhaustive deps warnings (missing `investments`, `updateInvestment`)
- Not event-driven - initialization happens passively, not on user action
- Hard to debug and test

**Current Code**:
```javascript
useEffect(() => {
  if (currentStep === 2 && selectedInstruments.length > 0) {
    initializeDefaultsForInstruments(selectedInstruments, investments, updateInvestment)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentStep]) // Missing: investments, updateInvestment, selectedInstruments
```

**Issues**:
- ❌ Side effect runs on state change, not user action
- ❌ Missing dependencies cause stale closures
- ❌ No guarantee defaults are applied before component renders
- ❌ Hard to trace when/why initialization happens

### 2. **Incorrect Data Type Checking: Zero vs Undefined**

**Location**: `src/utils/corpusDefaults.js:14-65`

**Problem**:
- `needsDefaultInitialization` checks `!== undefined` but doesn't distinguish between:
  - `undefined` (needs default)
  - `0` (invalid value, also needs default)
  - Valid value (doesn't need default)

**Current Code**:
```javascript
case 'fd': {
  const hasTenure = (data.tenureYears !== undefined || data.tenureMonths !== undefined) || 
                    (data.tenure && data.tenureUnit)
  return !data.principal || !hasTenure || !data.rate
}
```

**Issue**:
- If `tenureYears: 0, tenureMonths: 0` exists, `hasTenure` is `true`
- Function returns `false` (doesn't need initialization)
- But `0,0` is invalid - should be `1,0` (default)
- **Root cause of FD showing 0,0 in console**

**Validation Logic Conflict**:
- `validateYearsMonths(0, 0)` returns `{ isValid: false }` (invalid)
- But `needsDefaultInitialization` thinks tenure exists (doesn't initialize)
- Creates inconsistent state

### 3. **migrateFDData Normalizes Invalid Values**

**Location**: `src/utils/fdTenureUtils.js:86-95`

**Problem**:
- When `tenureYears: 0, tenureMonths: 0` exists, `migrateFDData` normalizes it
- Returns `{ tenureYears: 0, tenureMonths: 0 }` (still invalid)
- Prevents defaults from being applied

**Current Code**:
```javascript
if (instrumentData.tenureYears !== undefined || instrumentData.tenureMonths !== undefined) {
  const normalized = normalizeYearsMonths(
    instrumentData.tenureYears || 0,  // 0 || 0 = 0
    instrumentData.tenureMonths || 0  // 0 || 0 = 0
  )
  return {
    ...instrumentData,
    tenureYears: normalized.years,  // Still 0
    tenureMonths: normalized.months  // Still 0
  }
}
```

**Issue**:
- Normalizes `0,0` → `0,0` (no change)
- Should detect invalid values and return `undefined` to trigger defaults

### 4. **Component-Level Side Effects**

**Location**: `src/components/corpus/InstrumentInputForms/FDInput.jsx:16-25`

**Problem**:
- Component has `useEffect` that migrates data on mount
- Creates timing issues - when does migration happen vs initialization?
- Duplicates logic that should be in defaults system

**Current Code**:
```javascript
useEffect(() => {
  const migrated = migrateFDData(instrumentData)
  if (migrated.tenureYears !== instrumentData.tenureYears || 
      migrated.tenureMonths !== instrumentData.tenureMonths) {
    updateInvestment(instrumentId, migrated)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []) // Only run on mount
```

**Issues**:
- ❌ Runs on every mount, even if data is already correct
- ❌ Missing dependencies
- ❌ Component shouldn't mutate data - should be pure

## Proposed Refactor

### Phase 1: Event-Driven Initialization

**Goal**: Move initialization from `useEffect` to explicit user actions

**Changes**:

1. **Initialize on Step Navigation**:
   ```javascript
   const handleNext = () => {
     if (currentStep === 1) {
       // Initialize defaults BEFORE moving to step 2
       initializeDefaultsForInstruments(selectedInstruments, investments, updateInvestment)
     }
     if (currentStep < 4 && isCurrentStepValidWrapper()) {
       setCurrentStep(currentStep + 1)
     }
   }
   ```

2. **Initialize on Instrument Selection** (optional, for better UX):
   ```javascript
   const handleInstrumentToggle = (instrumentId) => {
     if (!current.includes(instrumentId)) {
       setSelectedInstruments([...current, instrumentId])
       // Initialize defaults immediately for better UX
       if (currentStep === 2) {
         initializeDefaultsForInstruments([instrumentId], investments, updateInvestment)
       }
     }
   }
   ```

**Benefits**:
- ✅ Explicit, traceable initialization
- ✅ No race conditions
- ✅ No exhaustive deps issues
- ✅ Easier to test
- ✅ Better user experience (immediate feedback)

### Phase 2: Fix Data Type Checking

**Goal**: Distinguish between `undefined`, `0` (invalid), and valid values

**Changes**:

1. **Create Validation Helper**:
   ```javascript
   /**
    * Check if a value is valid (not undefined, null, or invalid default)
    * @param {*} value - Value to check
    * @param {*} invalidValues - Array of values considered invalid (e.g., [0])
    * @returns {boolean}
    */
   const isValidValue = (value, invalidValues = [0]) => {
     return value !== undefined && 
            value !== null && 
            !invalidValues.includes(value)
   }
   ```

2. **Update needsDefaultInitialization**:
   ```javascript
   case 'fd': {
     // Check if tenure is valid (not undefined AND not 0,0)
     const hasValidTenure = (
       (isValidValue(data.tenureYears) && isValidValue(data.tenureMonths)) ||
       (isValidValue(data.tenure) && data.tenureUnit)
     )
     return !isValidValue(data.principal) || !hasValidTenure || !isValidValue(data.rate)
   }
   ```

3. **Update getInstrumentDefaults**:
   ```javascript
   case 'fd':
     if (!isValidValue(data.principal)) defaults.principal = 100000
     // Only set defaults if tenure is missing OR invalid (0,0)
     if (!isValidValue(data.tenureYears) || !isValidValue(data.tenureMonths)) {
       if (!isValidValue(data.tenure) || !data.tenureUnit) {
         defaults.tenureYears = 1
         defaults.tenureMonths = 0
       }
     }
     if (!isValidValue(data.rate)) defaults.rate = investmentRates.fd?.rate || 6.5
     break
   ```

**Benefits**:
- ✅ Handles `0` as invalid value
- ✅ Consistent with validation logic
- ✅ Prevents invalid defaults from persisting

### Phase 3: Fix migrateFDData

**Goal**: Detect invalid values and let defaults handle them

**Changes**:

```javascript
export const migrateFDData = (instrumentData) => {
  if (!instrumentData) {
    return {} // Let defaults handle it
  }

  // If new format exists, normalize and validate
  if (instrumentData.tenureYears !== undefined || instrumentData.tenureMonths !== undefined) {
    const years = instrumentData.tenureYears || 0
    const months = instrumentData.tenureMonths || 0
    
    // If both are 0, this is invalid - return undefined to trigger defaults
    if (years === 0 && months === 0) {
      const { tenureYears, tenureMonths, ...rest } = instrumentData
      return rest // Remove invalid tenure, let defaults set it
    }
    
    const normalized = normalizeYearsMonths(years, months)
    return {
      ...instrumentData,
      tenureYears: normalized.years,
      tenureMonths: normalized.months
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
      tenure: instrumentData.tenure,
      tenureUnit: instrumentData.tenureUnit
    }
  }

  // Return data as-is - defaults will handle missing tenure
  return { ...instrumentData }
}
```

**Benefits**:
- ✅ Detects invalid `0,0` values
- ✅ Removes invalid values to trigger defaults
- ✅ Consistent behavior

### Phase 4: Remove Component-Level Side Effects

**Goal**: Make components pure - no data mutation

**Changes**:

1. **Remove useEffect from FDInput**:
   - Migration should happen in defaults system, not component
   - Component should only display and handle user input

2. **Use Derived State**:
   ```javascript
   const FDInput = ({ instrumentId, instrumentData, updateInvestment }) => {
     // Pure function - no side effects
     const migrated = migrateFDData(instrumentData)
     const tenureYears = migrated.tenureYears ?? 0
     const tenureMonths = migrated.tenureMonths ?? 0
     
     // Component is now pure - just displays and handles events
     return (/* JSX */)
   }
   ```

**Benefits**:
- ✅ Components are pure and predictable
- ✅ Easier to test
- ✅ No timing issues

## Implementation Plan

### Step 1: Fix Data Type Checking (Critical - Fixes FD Issue)
1. Add `isValidValue` helper function
2. Update `needsDefaultInitialization` to use it
3. Update `getInstrumentDefaults` to use it
4. Update `migrateFDData` to detect invalid values
5. Add tests for `0` values

### Step 2: Move to Event-Driven Initialization
1. Remove `useEffect` from `CorpusCalculatorPage`
2. Add initialization to `handleNext` when moving to step 2
3. Optionally add to `handleInstrumentToggle` for better UX
4. Remove exhaustive deps warnings

### Step 3: Clean Up Components
1. Remove `useEffect` from `FDInput`
2. Make components pure (no side effects)
3. Ensure migration happens in defaults system

### Step 4: Add Comprehensive Tests
1. Test initialization on step navigation
2. Test initialization on instrument selection
3. Test invalid `0` values are replaced with defaults
4. Test migration doesn't interfere with defaults

## Testing Strategy

### Unit Tests
- `isValidValue` helper function
- `needsDefaultInitialization` with `0` values
- `getInstrumentDefaults` with `0` values
- `migrateFDData` with invalid `0,0` values

### Integration Tests
- Initialization on step 2 navigation
- Initialization on instrument selection in step 2
- FD shows `1,0` not `0,0` after initialization
- SIP shows `years` selected after initialization

### E2E Tests
- User selects FD → navigates to step 2 → sees `1 year, 0 months`
- User selects SIP → navigates to step 2 → sees `Years` selected
- User changes step back and forth → defaults persist correctly

## Migration Path

1. **Phase 1** (Critical): Fix data type checking - this fixes the immediate FD issue
2. **Phase 2** (Important): Move to event-driven - improves architecture
3. **Phase 3** (Cleanup): Remove component side effects - improves maintainability
4. **Phase 4** (Validation): Add comprehensive tests - ensures correctness

## Risk Assessment

**Low Risk**:
- Adding `isValidValue` helper (pure function)
- Updating `migrateFDData` to detect invalid values

**Medium Risk**:
- Moving initialization from `useEffect` to event handlers
- Need to ensure initialization happens at right time

**Mitigation**:
- Keep old code commented for rollback
- Add comprehensive tests before refactoring
- Test with real user flows

## Success Criteria

1. ✅ FD initializes with `tenureYears: 1, tenureMonths: 0` (not `0,0`)
2. ✅ SIP initializes with `tenureUnit: 'years'` selected
3. ✅ No exhaustive deps warnings
4. ✅ Initialization happens on explicit user actions
5. ✅ Components are pure (no side effects)
6. ✅ All tests pass
7. ✅ No console errors or warnings

## Additional Considerations

### Performance
- Initialization should be fast (synchronous)
- No unnecessary re-renders
- Consider memoization if needed

### Accessibility
- Ensure form fields are properly initialized for screen readers
- Default values should be announced

### User Experience
- Consider initializing defaults immediately when instrument is selected (better UX)
- Show loading state if initialization is async (shouldn't be needed)

## Conclusion

This refactor addresses fundamental architectural issues:
1. **Event-driven over reactive**: Explicit actions over side effects
2. **Correct data validation**: Distinguish invalid values from missing values
3. **Pure components**: No side effects in presentation layer
4. **Testability**: Easier to test event-driven flow

The refactor will result in:
- More predictable behavior
- Easier debugging
- Better test coverage
- Improved user experience
- Cleaner architecture
