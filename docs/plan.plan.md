<!-- 71080274-f83d-4b65-ac7c-30298198c6e1 5a30f499-5b75-4d9d-b8ed-46c134ad363b -->
# Corpus Calculator - Implementation Plan

## Overview

Build a comprehensive corpus calculator that:

1. Calculates corpus from multiple investment instruments
2. Shows nominal vs inflation-adjusted values
3. Applies tax calculations with educational content explaining approaches
4. Displays real-world purchasing power comparisons across multiple categories
5. Uses category-specific inflation rates with user-configurable defaults
6. Supports city-specific pricing for 10 Indian cities

## Task Breakdown for Parallel Execution

### Task Group 1: Core Calculation Utilities (Can be done in parallel)

**Owner: Backend/Calculation Engineer**

#### Task 1.1: Corpus Aggregation Utility

- **File**: `src/utils/corpusCalculations.js`
- **Functions**:
- `calculateCorpusFromInstruments(instruments, investments)`
- `aggregateInvestedAmounts(instruments)`
- `aggregateMaturityValues(instruments)`
- **Dependencies**: Existing calculator hooks (useFDCalculator, useSIPCalculator, etc.)
- **Output**: Returns total invested, total returns, nominal corpus
- **Estimated Time**: 1-2 days

#### Task 1.2: Tax Calculation Utility

- **File**: `src/utils/taxCalculations.js`
- **Functions**:
- `calculateTaxOnWithdrawal(corpus, instrumentType, tenure)`
- `calculateTaxDuringAccumulation(investments, instrumentType, tenure)`
- `calculateTaxBoth(corpus, investments, instrumentType, tenure)`
- `getTaxRateForInstrument(instrumentType)`
- **Tax rules by instrument**:
- PPF/SSY: Tax-free (EEE)
- FD: Interest taxed annually (TDS applicable)
- Equity/MF/ELSS: LTCG 10% above ₹1L exemption, STCG 15%
- NPS: 60% tax-free, 40% taxable
- SGB: Capital gains exempt if held till maturity, interest taxable
- NSC: Interest taxable, reinvested qualifies for 80C
- SCSS: Interest taxable per income slab
- **Dependencies**: None
- **Output**: Tax amounts and post-tax corpus values
- **Estimated Time**: 2-3 days

#### Task 1.3: Purchasing Power Calculation Utility

- **File**: `src/utils/purchasingPowerComparisons.js`
- **Functions**:
- `calculateFuturePrice(currentPrice, inflationRate, years)`
- `calculateAffordability(corpus, futurePrice)`
- `calculatePurchasingPower(corpus, examples, years, city)`
- **Dependencies**: `src/constants/purchasingPowerExamples.js`
- **Output**: Affordability metrics (can afford X units, Y% of price)
- **Estimated Time**: 1-2 days

### Task Group 2: Constants & Configuration (Can be done in parallel)

**Owner: Data/Configuration Engineer**

#### Task 2.1: Inflation Rates Constants

- **File**: `src/constants/inflationRates.js`
- **Content**:
- Default category-specific inflation rates
- Export functions to get/set rates
- **Default Rates**:
- Education: 10%
- Healthcare: 8%
- Real Estate: 7%
- Luxury Goods: 6%
- Consumer Goods (Wholesale): 4%
- Consumer Goods (Retail): 5%
- General Inflation: 6%
- **Dependencies**: None
- **Estimated Time**: 0.5 days

#### Task 2.2: Purchasing Power Examples Database

- **File**: `src/constants/purchasingPowerExamples.js`
- **Structure**: City-based pricing data with extensible structure
- **Cities**: 10 cities grouped by tier
- **Metros (4)**: New Delhi, Mumbai, Chennai, Kolkata
- **Tier-1 (4)**: Bangalore, Pune, Hyderabad, Ahmedabad
- **Tier-2 (2)**: Indore, Guwahati
- **Categories with Pricing**:
- **Education** (city-specific):
  - School fees (1 year): Metros ₹5L, Tier-1 ₹3L, Tier-2 ₹2L
  - Engineering college (4 years): Metros ₹20L, Tier-1 ₹15L, Tier-2 ₹10L
  - MBA tuition: Metros ₹25L, Tier-1 ₹20L, Tier-2 ₹15L
- **Real Estate** (city-specific):
  - 2BHK apartment: Metros ₹1.5Cr, Tier-1 ₹80L, Tier-2 ₹40L
  - Plot (500 sq yd): Metros ₹1Cr, Tier-1 ₹50L, Tier-2 ₹25L
- **Luxury Goods** (same across cities):
  - BMW M3: ₹1.5Cr
  - iPhone 15 Pro Max: ₹1.5L
  - 55" OLED TV: ₹1.5L
- **Healthcare** (city-specific):
  - Annual health insurance premium: ₹50K (same)
  - Heart surgery: Metros ₹5L, Tier-1 ₹3.5L, Tier-2 ₹2.5L
  - ICU stay (1 week): Metros ₹2L, Tier-1 ₹1.5L, Tier-2 ₹1L
- **Consumer Goods** (same across cities):
  - Monthly grocery (family of 4): ₹15K
  - Petrol (per liter): ₹100
  - Gold (per gram): ₹13,000
- **Dependencies**: None
- **Estimated Time**: 1-2 days

### Task Group 3: Store Updates (Sequential - Store first, then Components)

**Owner: State Management Engineer**

#### Task 3.1: Corpus Calculator Store Enhancement

- **File**: `src/store/corpusCalculatorStore.js`
- **Add fields**:
- `selectedInstruments`: Array
- `investments`: Object mapping instrument to data
- `settings`: Object with inflation rates, tax method, time horizon, selectedCity
- `results`: Calculated corpus results
- `purchasingPower`: Purchasing power comparisons
- **Add actions**: setSelectedInstruments, updateInvestment, updateSettings, setResults, setPurchasingPower
- **Dependencies**: None
- **Estimated Time**: 1 day

#### Task 3.2: User Preferences Store Enhancement

- **File**: `src/store/userPreferencesStore.js`
- **Add category-specific inflation rates**:
- `educationInflationRate`: 10
- `healthcareInflationRate`: 8
- `realEstateInflationRate`: 7
- `luxuryGoodsInflationRate`: 6
- `consumerGoodsWholesaleRate`: 4
- `consumerGoodsRetailRate`: 5
- **Add actions**: Update methods for each rate
- **Dependencies**: None
- **Estimated Time**: 0.5 days

### Task Group 4: UI Components - Settings & Configuration (Can be done in parallel)

**Owner: Frontend Engineer A**

#### Task 4.1: City Selector Component

- **File**: `src/components/corpus/CitySelector.jsx`
- **Features**:
- Dropdown/radio buttons for 10 cities
- Group by tier (Metros, Tier-1, Tier-2)
- Visual grouping/labels with clear tier separation
- Store selection in corpusCalculatorStore
- Display selected city
- **Dependencies**: `corpusCalculatorStore`
- **Estimated Time**: 0.5 days

#### Task 4.2: Category Inflation Settings Component

- **File**: `src/components/corpus/CategoryInflationSettings.jsx`
- **Features**:
- Expandable section
- Input fields for each category with defaults
- Show current defaults and allow override
- Info tooltips explaining each category
- Save to userPreferencesStore
- **Dependencies**: `userPreferencesStore`
- **Estimated Time**: 1 day

#### Task 4.3: Tax Method Selector Component

- **File**: `src/components/corpus/TaxMethodSelector.jsx`
- **Features**:
- Radio buttons with descriptions:
  - Option A: Taxes on Withdrawal (Most Realistic)
  - Option B: Taxes During Accumulation
  - Option C: Show Both (Comparison)
- Info icon linking to educational panel
- Store selection in corpusCalculatorStore
- **Dependencies**: `corpusCalculatorStore`
- **Estimated Time**: 0.5 days

#### Task 4.4: Tax Education Panel Component

- **File**: `src/components/corpus/TaxEducationPanel.jsx`
- **Features**:
- Explain each tax approach (What/How/Why format)
- Which is most realistic per instrument with examples
- Real-world examples showing impact
- Impact on final corpus amount visualization
- Expandable/collapsible sections
- **Dependencies**: None (static content)
- **Estimated Time**: 1-2 days

### Task Group 5: UI Components - Results Display (Can be done in parallel after Task 1.1)

**Owner: Frontend Engineer B**

#### Task 5.1: Corpus Results Component

- **File**: `src/components/corpus/CorpusResults.jsx`
- **Features**:
- Display primary metrics:
  - Total Invested
  - Total Returns
  - Nominal Corpus
  - Inflation-Adjusted Corpus
  - Post-Tax Corpus (based on selected method)
- Visual styling with ResultCard components
- Responsive layout
- **Dependencies**: `corpusCalculations.js`, `taxCalculations.js`, `corpusCalculatorStore`
- **Estimated Time**: 1-2 days

#### Task 5.2: Instrument Breakdown Table Component

- **File**: `src/components/corpus/InstrumentBreakdownTable.jsx`
- **Features**:
- Table showing per-instrument contributions
- Columns: Invested amount, Returns, Maturity value, Percentage of total, Tax implications
- Use existing InvestmentTable component styling
- Responsive table
- **Dependencies**: `corpusCalculatorStore`, `InvestmentTable` component
- **Estimated Time**: 1 day

#### Task 5.3: Purchasing Power Panel Component

- **File**: `src/components/corpus/PurchasingPowerPanel.jsx`
- **Features**:
- Display by category (tabs or accordion)
- Categories: Education, Real Estate, Luxury Goods, Healthcare, Consumer Goods
- Show current prices vs future prices (inflation-adjusted)
- Affordability metrics (can afford X units, Y% of price)
- Visual indicators (progress bars, percentages)
- City-specific pricing display (show selected city)
- Show city tier context
- **Dependencies**: `purchasingPowerComparisons.js`, `purchasingPowerExamples.js`, `corpusCalculatorStore`
- **Estimated Time**: 2-3 days

#### Task 5.4: Visualization Components

- **Files**: 
- `src/components/corpus/CorpusVisualizations.jsx` (or integrate into CorpusResults)
- **Features**:
- Pie chart: Instrument-wise breakdown (use existing PieChart component)
- Bar chart: Nominal vs Inflation-Adjusted vs Post-Tax comparison
- Line chart: Year-wise corpus growth (if needed)
- **Dependencies**: `PieChart` component, Highcharts, `corpusCalculatorStore`
- **Estimated Time**: 1-2 days

### Task Group 6: Main Page Integration (Sequential - After all components)

**Owner: Frontend Lead**

#### Task 6.1: Corpus Calculator Page - Step 1 (Instrument Selection)

- **File**: `src/pages/CorpusCalculatorPage/CorpusCalculatorPage.jsx`
- **Features**:
- Checkbox cards for each instrument type
- Use existing instrument selection patterns
- Store selections in corpusCalculatorStore
- Navigation to Step 2
- **Dependencies**: All Task Group 3 (Store), Task Group 4 components
- **Estimated Time**: 1 day

#### Task 6.2: Corpus Calculator Page - Step 2 (Investment Details)

- **File**: `src/pages/CorpusCalculatorPage/CorpusCalculatorPage.jsx`
- **Features**:
- Dynamic forms for each selected instrument
- Reuse existing calculator input components (InputField, Slider, etc.)
- Include step-up options where applicable
- Store investment data in corpusCalculatorStore
- Navigation to Step 3
- **Dependencies**: Task 6.1, existing calculator components
- **Estimated Time**: 2-3 days

#### Task 6.3: Corpus Calculator Page - Step 3 (Settings & Options)

- **File**: `src/pages/CorpusCalculatorPage/CorpusCalculatorPage.jsx`
- **Features**:
- General inflation rate input
- Category-specific inflation rates (use CategoryInflationSettings component)
- Tax calculation method selector (use TaxMethodSelector)
- Tax education panel (use TaxEducationPanel)
- City selector (use CitySelector)
- Time horizon input (years until corpus withdrawal)
- Calculate button
- **Dependencies**: Task 6.2, Task Group 4 components
- **Estimated Time**: 1 day

#### Task 6.4: Corpus Calculator Page - Results View

- **File**: `src/pages/CorpusCalculatorPage/CorpusCalculatorPage.jsx`
- **Features**:
- Integrate CorpusResults component
- Integrate InstrumentBreakdownTable component
- Integrate PurchasingPowerPanel component
- Integrate Visualization components
- Responsive layout (desktop: side-by-side, mobile: stacked)
- Real-time calculation on input changes
- **Dependencies**: Task 6.3, Task Group 5 components, Task Group 1 utilities
- **Estimated Time**: 2-3 days

## Implementation Files

### New Files to Create:

1. `src/utils/corpusCalculations.js` - Core corpus calculation logic (Task 1.1)
2. `src/utils/taxCalculations.js` - Tax calculation functions (Task 1.2)
3. `src/utils/purchasingPowerComparisons.js` - Purchasing power calculations (Task 1.3)
4. `src/constants/inflationRates.js` - Category-specific inflation rates (Task 2.1)
5. `src/constants/purchasingPowerExamples.js` - Real-world example prices (Task 2.2)
6. `src/components/corpus/CitySelector.jsx` - City selection component (Task 4.1)
7. `src/components/corpus/CorpusResults.jsx` - Results display component (Task 5.1)
8. `src/components/corpus/PurchasingPowerPanel.jsx` - Purchasing power display (Task 5.3)
9. `src/components/corpus/TaxMethodSelector.jsx` - Tax method selector (Task 4.3)
10. `src/components/corpus/TaxEducationPanel.jsx` - Tax education content (Task 4.4)
11. `src/components/corpus/CategoryInflationSettings.jsx` - Inflation rate settings (Task 4.2)
12. `src/components/corpus/InstrumentBreakdownTable.jsx` - Instrument breakdown table (Task 5.2)
13. `src/components/corpus/CorpusVisualizations.jsx` - Visualization components (Task 5.4)

### Files to Modify:

1. `src/pages/CorpusCalculatorPage/CorpusCalculatorPage.jsx` - Main page implementation (Tasks 6.1-6.4)
2. `src/store/corpusCalculatorStore.js` - Enhanced store (Task 3.1)
3. `src/store/userPreferencesStore.js` - Add category inflation rates (Task 3.2)

## Technical Considerations

### Tax Calculation Accuracy

- Use current Indian tax rules (FY 2024-25)
- Consider Section 80C limits for eligible instruments
- Handle LTCG exemption limits (₹1L for equity)
- Account for TDS on FD interest

### Inflation Rate Sources

- Use RBI data for general inflation
- Use sector-specific data for category rates
- Allow user override for personal experience

### City Pricing Structure

- Extensible data structure for easy addition of cities
- Tier-based pricing for Education, Real Estate, Healthcare
- Common pricing for Luxury Goods and Consumer Goods
- Clear separation of city-specific vs universal pricing

### Performance

- Use memoization for complex calculations
- Optimize re-renders with React.memo
- Cache purchasing power calculations
- Lazy load city-specific data

### Responsive Design

- Desktop: Side-by-side layout (inputs + results)
- Mobile: Stacked layout with scroll
- Accordion sections for category details
- City selector optimized for mobile

## Testing Considerations

### Unit Tests

- Tax calculation accuracy per instrument
- Inflation adjustment correctness
- Purchasing power calculations
- Corpus aggregation logic
- City-specific pricing lookup

### Integration Tests

- Multi-instrument corpus calculation
- Tax method switching
- Settings persistence
- Form validation
- City selection impact on purchasing power

## Execution Workflow

### Overview

This workflow breaks down the implementation into phases with clear parallel and sequential execution paths. Tasks within the same group can be done in parallel, while groups must be completed in order due to dependencies.

### Phase 1: Foundation & Setup (Week 1)

**Duration**: 3-5 days

**Can be done in parallel**: Yes, all tasks

#### Parallel Tasks:

1. **Task 2.1**: Create `src/constants/inflationRates.js` (0.5 days)
2. **Task 2.2**: Create `src/constants/purchasingPowerExamples.js` (1-2 days)
3. **Task 3.1**: Enhance `src/store/corpusCalculatorStore.js` (1 day)
4. **Task 3.2**: Enhance `src/store/userPreferencesStore.js` (0.5 days)

**Workflow**:

```
Day 1: All 4 tasks start in parallel
Day 2: Tasks 2.1, 3.2 complete; Tasks 2.2, 3.1 continue
Day 3: Task 2.2 completes; Task 3.1 completes
```

**Dependencies**: None - these are foundational files

---

### Phase 2: Core Calculation Utilities (Week 1-2)

**Duration**: 4-7 days

**Can be done in parallel**: Yes, all tasks

#### Parallel Tasks:

1. **Task 1.1**: Create `src/utils/corpusCalculations.js` (1-2 days)
2. **Task 1.2**: Create `src/utils/taxCalculations.js` (2-3 days)
3. **Task 1.3**: Create `src/utils/purchasingPowerComparisons.js` (1-2 days)

**Workflow**:

```
Day 1: All 3 tasks start in parallel
Day 2: Task 1.1 completes; Tasks 1.2, 1.3 continue
Day 3: Task 1.3 completes; Task 1.2 continues
Day 4-5: Task 1.2 completes
```

**Dependencies**:

- Task 1.3 depends on Task 2.2 (purchasingPowerExamples.js) - can start after Day 1
- Task 1.1 depends on existing calculator hooks (already exist)

**Integration Checkpoint**: After completion, verify all utilities work together:

- Corpus calculation aggregates correctly
- Tax calculations apply correctly
- Purchasing power calculations use correct data

---

### Phase 3: UI Components - Settings & Configuration (Week 2)

**Duration**: 3-4 days

**Can be done in parallel**: Yes, all tasks

#### Parallel Tasks:

1. **Task 4.1**: Create `src/components/corpus/CitySelector.jsx` (0.5 days)
2. **Task 4.2**: Create `src/components/corpus/CategoryInflationSettings.jsx` (1 day)
3. **Task 4.3**: Create `src/components/corpus/TaxMethodSelector.jsx` (0.5 days)
4. **Task 4.4**: Create `src/components/corpus/TaxEducationPanel.jsx` (1-2 days)

**Workflow**:

```
Day 1: Tasks 4.1, 4.3 start (quick wins)
Day 1-2: Tasks 4.2, 4.4 start in parallel
Day 2: Tasks 4.1, 4.3 complete
Day 3: Task 4.2 completes
Day 4: Task 4.4 completes
```

**Dependencies**:

- All tasks depend on Phase 1 (stores) - must complete first
- Task 4.2 depends on Task 3.2 (userPreferencesStore)
- Task 4.1, 4.3 depend on Task 3.1 (corpusCalculatorStore)

**Integration Checkpoint**: Test all components together:

- City selector updates store correctly
- Inflation settings persist to userPreferencesStore
- Tax method selector updates corpusCalculatorStore
- Tax education panel displays correctly

---

### Phase 4: UI Components - Results Display (Week 2-3)

**Duration**: 5-8 days

**Can be done in parallel**: Yes, after Task 1.1 completes

#### Parallel Tasks (after Task 1.1):

1. **Task 5.1**: Create `src/components/corpus/CorpusResults.jsx` (1-2 days)
2. **Task 5.2**: Create `src/components/corpus/InstrumentBreakdownTable.jsx` (1 day)
3. **Task 5.3**: Create `src/components/corpus/PurchasingPowerPanel.jsx` (2-3 days)
4. **Task 5.4**: Create `src/components/corpus/CorpusVisualizations.jsx` (1-2 days)

**Workflow**:

```
Day 1: Wait for Task 1.1 completion (corpusCalculations.js)
Day 2: All 4 tasks start in parallel
Day 3: Task 5.2 completes; Others continue
Day 4: Task 5.1 completes; Tasks 5.3, 5.4 continue
Day 5: Task 5.4 completes; Task 5.3 continues
Day 6-7: Task 5.3 completes
```

**Dependencies**:

- All tasks depend on Task 1.1 (corpusCalculations.js)
- Task 5.1 depends on Task 1.2 (taxCalculations.js) - can start after Day 4
- Task 5.3 depends on Task 1.3 (purchasingPowerComparisons.js) and Task 2.2
- Task 5.4 depends on existing PieChart component (already exists)

**Integration Checkpoint**: Test results display:

- CorpusResults shows correct values
- InstrumentBreakdownTable displays all instruments
- PurchasingPowerPanel shows city-specific data
- Visualizations render correctly

---

### Phase 5: Main Page Integration (Week 3-4)

**Duration**: 5-7 days

**Must be done sequentially**: Yes, each step depends on previous

#### Sequential Tasks:

1. **Task 6.1**: Step 1 - Instrument Selection (1 day)
2. **Task 6.2**: Step 2 - Investment Details (2-3 days)
3. **Task 6.3**: Step 3 - Settings & Options (1 day)
4. **Task 6.4**: Results View Integration (2-3 days)

**Workflow**:

```
Day 1: Task 6.1 starts (depends on Phase 3 completion)
Day 2: Task 6.1 completes; Task 6.2 starts
Day 3-4: Task 6.2 continues
Day 5: Task 6.2 completes; Task 6.3 starts
Day 6: Task 6.3 completes; Task 6.4 starts
Day 7-8: Task 6.4 continues
Day 9: Task 6.4 completes
```

**Dependencies**:

- Task 6.1: Depends on Phase 3 (all setting components) and Phase 1 (stores)
- Task 6.2: Depends on Task 6.1, existing calculator components
- Task 6.3: Depends on Task 6.2, Phase 3 components
- Task 6.4: Depends on Task 6.3, Phase 4 components, Phase 2 utilities

**Integration Checkpoint**: Full flow testing:

- Step 1: Select instruments → Store updates
- Step 2: Fill investment details → Store updates
- Step 3: Configure settings → Store updates
- Step 4: View results → Calculations work correctly

---

### Phase 6: Testing & Polish (Week 4-5)

**Duration**: 3-5 days

**Can be done in parallel**: Partially

#### Parallel Tasks:

1. **Unit Testing**: Test all utilities (1-2 days)
2. **Component Testing**: Test all components (1-2 days)
3. **Integration Testing**: Test full flow (1-2 days)
4. **UI/UX Polish**: Fix styling, responsiveness (1-2 days)

**Workflow**:

```
Day 1: All 4 tasks start in parallel
Day 2: Continue testing and polish
Day 3: Complete unit and component tests
Day 4: Complete integration tests
Day 5: Complete UI/UX polish
```

**Dependencies**:

- All tasks depend on Phase 5 completion
- Testing can start as soon as Phase 5 is done
- UI/UX polish can happen alongside testing

---

## Complete Execution Timeline

### Week 1: Foundation & Core Utilities

```
Day 1-2: Phase 1 (Foundation) - All parallel
Day 2-5: Phase 2 (Core Utilities) - All parallel
Day 3-4: Phase 3 (Settings Components) - All parallel
```

**Deliverables by End of Week 1**:

- ✅ All constants and stores ready
- ✅ Core calculation utilities complete
- ✅ Settings & configuration components ready

### Week 2: Results Components & Integration Start

```
Day 1-2: Phase 4 (Results Components) - All parallel
Day 3-5: Phase 5 (Main Page) - Sequential (Steps 1-2)
```

**Deliverables by End of Week 2**:

- ✅ All result display components ready
- ✅ Steps 1-2 of corpus calculator complete

### Week 3: Main Page Completion

```
Day 1-2: Phase 5 (Main Page) - Sequential (Steps 3-4)
Day 3-5: Phase 6 (Testing & Polish) - Parallel
```

**Deliverables by End of Week 3**:

- ✅ Complete corpus calculator page
- ✅ Testing complete
- ✅ UI/UX polished

---

## Team Assignment Recommendations

### Team Structure (4-5 developers)

**Developer 1: Backend/Calculation Engineer**

- Task 1.1: Corpus Aggregation Utility
- Task 1.2: Tax Calculation Utility
- Task 1.3: Purchasing Power Calculation Utility
- Task 2.1: Inflation Rates Constants
- **Total**: ~5-7 days

**Developer 2: Data/Configuration Engineer**

- Task 2.2: Purchasing Power Examples Database
- Task 3.1: Corpus Calculator Store Enhancement
- Task 3.2: User Preferences Store Enhancement
- **Total**: ~3-4 days, then can help with testing

**Developer 3: Frontend Engineer A**

- Task 4.1: City Selector Component
- Task 4.2: Category Inflation Settings Component
- Task 4.3: Tax Method Selector Component
- Task 4.4: Tax Education Panel Component
- **Total**: ~3-4 days

**Developer 4: Frontend Engineer B**

- Task 5.1: Corpus Results Component
- Task 5.2: Instrument Breakdown Table Component
- Task 5.3: Purchasing Power Panel Component
- Task 5.4: Visualization Components
- **Total**: ~5-8 days

**Developer 5: Frontend Lead**

- Task 6.1: Step 1 - Instrument Selection
- Task 6.2: Step 2 - Investment Details
- Task 6.3: Step 3 - Settings & Options
- Task 6.4: Results View Integration
- **Total**: ~5-7 days

**All Developers**: Phase 6 (Testing & Polish) - Parallel

---

## Critical Path (Must Complete in Order)

1. **Phase 1** (Foundation) → Must complete first
2. **Phase 2** (Core Utilities) → Can start Day 1, Task 1.3 waits for Task 2.2
3. **Phase 3** (Settings Components) → Depends on Phase 1
4. **Phase 4** (Results Components) → Depends on Phase 2, Task 1.1
5. **Phase 5** (Main Page) → Depends on Phases 3 & 4
6. **Phase 6** (Testing) → Depends on Phase 5

---

## Parallel Execution Map

```
Week 1:
├── Day 1-2: Phase 1 (Foundation) ──────────────────────┐
│   ├── Task 2.1 (Inflation Rates)                      │
│   ├── Task 2.2 (Examples Database)                    │ All Parallel
│   ├── Task 3.1 (Corpus Store)                         │
│   └── Task 3.2 (User Preferences Store)               │
└────────────────────────────────────────────────────────┘
         │
         ▼
├── Day 2-5: Phase 2 (Core Utilities) ──────────────────┐
│   ├── Task 1.1 (Corpus Calculations)                   │
│   ├── Task 1.2 (Tax Calculations)                     │ All Parallel
│   └── Task 1.3 (Purchasing Power) ──────┐             │
│                                          │ (waits for Task 2.2)
└──────────────────────────────────────────┼────────────┘
         │                                 │
         ▼                                 ▼
├── Day 3-4: Phase 3 (Settings Components) ────────────┐
│   ├── Task 4.1 (City Selector)                         │
│   ├── Task 4.2 (Inflation Settings)                   │ All Parallel
│   ├── Task 4.3 (Tax Selector)                         │
│   └── Task 4.4 (Tax Education)                        │
└────────────────────────────────────────────────────────┘

Week 2:
├── Day 1-2: Phase 4 (Results Components) ──────────────┐
│   ├── Task 5.1 (Corpus Results)                        │
│   ├── Task 5.2 (Breakdown Table)                       │ All Parallel
│   ├── Task 5.3 (Purchasing Power Panel)                │
│   └── Task 5.4 (Visualizations)                        │
└────────────────────────────────────────────────────────┘
         │
         ▼
├── Day 3-9: Phase 5 (Main Page) ───────────────────────┐
│   ├── Task 6.1 (Step 1) ────┐                          │
│   │                        │                          │ Sequential
│   └── Task 6.2 (Step 2) ───┼───┐                      │
│                            │   │                      │
│   └── Task 6.3 (Step 3) ───┼───┼───┐                  │
│                            │   │   │                  │
│   └── Task 6.4 (Results) ──┼───┼───┼───┐              │
└────────────────────────────┴───┴───┴───┴──────────────┘
         │
         ▼
Week 3:
├── Day 1-5: Phase 6 (Testing & Polish) ─────────────────┐
│   ├── Unit Testing                                     │
│   ├── Component Testing                                │ All Parallel
│   ├── Integration Testing                             │
│   └── UI/UX Polish                                     │
└────────────────────────────────────────────────────────┘
```

---

## Daily Standup Checklist

### End of Week 1:

- [ ] All stores updated and tested
- [ ] All constants files created with correct data
- [ ] Core calculation utilities complete and tested
- [ ] Settings components ready for integration

### End of Week 2:

- [ ] All result display components complete
- [ ] Steps 1-2 of main page working
- [ ] Basic flow testable

### End of Week 3:

- [ ] Complete corpus calculator functional
- [ ] All tests passing
- [ ] UI/UX polished
- [ ] Ready for review

---

## Risk Mitigation

### Dependency Risks:

- **Risk**: Task 1.3 blocked waiting for Task 2.2
- **Mitigation**: Start Task 2.2 on Day 1, prioritize completion

- **Risk**: Phase 4 components blocked waiting for Phase 2
- **Mitigation**: Prioritize Task 1.1 completion, start Phase 4 components as soon as Task 1.1 is done

### Integration Risks:

- **Risk**: Components don't integrate well
- **Mitigation**: Weekly integration checkpoints, test components together early

- **Risk**: Tax calculations complex, may take longer
- **Mitigation**: Allocate extra time for Task 1.2, start early

### Data Risks:

- **Risk**: City-specific pricing data incomplete
- **Mitigation**: Start with rough estimates, refine later, structure allows easy updates