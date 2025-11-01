<!-- b8fc9a49-ccb7-4feb-bb79-aa1551582661 954a8486-694e-4b5b-b326-0bae34f7f013 -->
# WealthLab Platform - Implementation Plan

## Project Architecture

### Technology Stack

- **Framework:** React (JavaScript) with Vite
- **Styling:** Tailwind CSS
- **State Management:** 
    - Local component state (useState/useEffect) for individual calculators
    - Zustand ONLY for GoalPlanningPage & CorpusCalculatorPage
- **Form Management:** React Hook Form + Joi validation
- **Routing:** React Router v6 with production-grade route structure
- **Charting:** Recharts
- **Utilities:** date-fns for date calculations

### Architecture Principles

- **Production-Grade:** Scalable, maintainable architecture to avoid rearchitecting
- **Separation of Concerns:** Each calculator is independent feature
- **Real-Time Calculations:** No calculate buttons, reactive updates via useEffect
- **Responsive Design:** Desktop (side-by-side), Mobile (stacked, one scroll below)
- **Modular Structure:** Each feature has its own PLAN.md for parallel development

### Current Interest Rates (As of November 2025)

Based on latest government and market data:

- PPF: 7.1% p.a. (compounded annually)
- NSC: 7.7% p.a. (compounded annually, paid at maturity)
- SSY: 8.2% p.a. (compounded annually)
- SCSS: 8.2% p.a. (paid quarterly)
- SGB: 2.5% p.a. + gold price appreciation
- FD: 5.5-7.5% p.a. (varies by bank/tenure)
- NPS: 8-12% expected (market-linked)
- SIP/Mutual Funds: 10-15% expected (market-linked)
- ELSS: 12-15% expected (market-linked)
- Equity: Variable (market-dependent)

## Phase 1: Project Setup & Core Structure

### 1.1 Initialize Project

```bash
npm create vite@latest wealth-mngr --template react
npm install tailwindcss postcss autoprefixer zustand react-hook-form joi recharts date-fns react-router-dom
npx tailwindcss init -p
```

### 1.2 Folder Structure

```
/src
  /components
    /calculators
      /PPFCalculator
    - PPFCalculator.jsx
    - PPFCalculatorInfo.jsx
    - PPFCalculatorResults.jsx
    - PPFCalculatorTable.jsx
    - usePPFCalculator.js (hook for calculations)
    - ppfSchema.js (Joi validation)
      /FDCalculator
      /SIPCalculator
      /EquityCalculator
      /NPSCalculator
      /SSYCalculator
      /SGBCalculator
      /NSCCalculator
      /ELSSCalculator
      /SCSSCalculator
    /common
      /InputField
      /Slider
      /ToggleSwitch
      /ResultCard
      /PieChart
      /InvestmentTable
      /Layout
    - CalculatorLayout.jsx (handles desktop/mobile layout)
    - MainLayout.jsx (header, footer, navigation)
    - PageLayout.jsx (full-page layouts)
  /pages
    /Home
   - Home.jsx
    /calculators
   - CalculatorPage.jsx (renders individual calculator based on route)
    /GoalPlanningPage
   - GoalPlanningPage.jsx
   - components/
    - GoalForm.jsx
    - RiskProfileSelector.jsx
    - RecommendationsDisplay.jsx
    /CorpusCalculatorPage
   - CorpusCalculatorPage.jsx
   - components/
    - Step1Selection.jsx
    - Step2InputForms.jsx
    - Step3Review.jsx
    - CorpusResults.jsx
  /store
  - goalPlanningStore.js (Zustand)
  - corpusCalculatorStore.js (Zustand)
  - userPreferencesStore.js (Zustand)
  /utils
  - calculations.js
  - formatters.js
  - validators.js (Joi validation helpers)
  /constants
  - investmentRates.js
  - investmentInfo.js
  /hooks
  - useRealtimeCalculator.js (hook for real-time calculations)
  /routes
  - AppRoutes.jsx
  - routes.js (route configuration)
  /docs
  - architecture.md
  - PLAN.md (main plan)
    /calculators
   - PLAN-PPF.md
   - PLAN-FD.md
   - PLAN-SIP.md
   - PLAN-Equity.md
   - PLAN-NPS.md
   - PLAN-SSY.md
   - PLAN-SGB.md
   - PLAN-NSC.md
   - PLAN-ELSS.md
   - PLAN-SCSS.md
```

### 1.3 Investment Rates Constants File

Create `src/constants/investmentRates.js` with all hardcoded rates and last-updated timestamps.

### 1.4 Zustand Store Setup

Create global store ONLY for:

- **GoalPlanningStore:** Goal inputs, risk profile, recommendations
- **CorpusCalculatorStore:** Selected instruments, form data across steps, portfolio state
- **UserPreferencesStore:** Global settings (default inflation rate, currency format)

**Note:** Individual calculators use local component state (useState) with useEffect for real-time reactivity. No Zustand needed for calculators.

### 1.5 Routing Architecture

**Route Structure:**

```
/ (Home)
  └── Dashboard with quick access to calculators

/calculators (Calculator Index)
  └── Grid of all available calculators

/calculators/ppf
  └── PPF Calculator page

/calculators/fd
  └── FD Calculator page

/calculators/sip
  └── SIP Calculator page

/calculators/equity
  └── Equity Calculator page

/calculators/nps
  └── NPS Calculator page

/calculators/ssy
  └── SSY Calculator page

/calculators/sgb
  └── SGB Calculator page

/calculators/nsc
  └── NSC Calculator page

/calculators/elss
  └── ELSS Calculator page

/calculators/scss
  └── SCSS Calculator page

/goal-planning
  └── Goal-based financial planning page

/corpus-calculator
  └── Multi-instrument corpus calculator (3-step form)
```

**Route Configuration (`routes.js`):**

```javascript
export const routes = {
  home: '/',
  calculators: {
    index: '/calculators',
    ppf: '/calculators/ppf',
    fd: '/calculators/fd',
    sip: '/calculators/sip',
    equity: '/calculators/equity',
    nps: '/calculators/nps',
    ssy: '/calculators/ssy',
    sgb: '/calculators/sgb',
    nsc: '/calculators/nsc',
    elss: '/calculators/elss',
    scss: '/calculators/scss'
  },
  goalPlanning: '/goal-planning',
  corpusCalculator: '/corpus-calculator'
};
```

## Phase 2: Individual Investment Calculators (Feature 1)

### 2.1 Calculator Component Structure & Layout

**Desktop Layout (MacBook 13"):**

```
┌─────────────────────────────────────────────────────────┐
│                    Calculator Header                      │
├──────────────────┬───────────────────────────────────────┤
│                  │                                        │
│   Input Panel    │      Results Panel (Right Side)        │
│   (Left Side)    │                                        │
│                  │      - Total Invested                  │
│   - Amount       │      - Interest Earned                 │
│   - Tenure       │      - Maturity Value                  │
│   - Rate         │      - Return %                        │
│   - Step-up      │      - Pie Chart                       │
│   - Inflation    │                                        │
│   Toggle         │                                        │
│                  │                                        │
├──────────────────┴───────────────────────────────────────┤
│           Information Panel (Below)                       │
│   - Current Rate + Last Updated                           │
│   - Key Features                                           │
│   - Tax Benefits                                          │
│   - Lock-in Period                                        │
│   - Eligibility                                           │
├───────────────────────────────────────────────────────────┤
│           Evolution Table (Year-wise breakdown)            │
└───────────────────────────────────────────────────────────┘
```

**Mobile Layout:**

```
┌─────────────────────┐
│   Calculator Header │
├─────────────────────┤
│   Input Panel       │
│   (Full Width)      │
├─────────────────────┤
│   Results Panel     │ (One scroll below)
│   (Full Width)      │
├─────────────────────┤
│   Information Panel │
├─────────────────────┤
│   Evolution Table   │
└─────────────────────┘
```

### 2.2 Key Features

1. **Real-Time Calculations:** 

      - No calculate button
      - useEffect watches all form inputs
      - Calculations update automatically as user types
      - Debounced updates for performance (optional)

2. **Input Panel (Left/Desktop, Top/Mobile):**

      - React Hook Form for form management
      - Joi validation schemas per calculator
      - Input fields with real-time updates
      - Toggle for "Adjust for Inflation"
      - Step-up options (if applicable)
      - Rate slider/input

3. **Results Panel (Right/Desktop, Below/Mobile):**

      - Auto-updates as user types
      - Total invested amount
      - Interest/Returns earned
      - Maturity value
      - Effective return %
      - Pie chart (Recharts) showing principal vs interest

4. **Information Panel (Below):**

      - Current rate display with last-updated timestamp
      - Key features of the instrument
      - Tax benefits
      - Lock-in period
      - Eligibility criteria

5. **Evolution Table (Below):**

      - Year-wise breakdown
      - Opening balance, investment, interest, closing balance
      - Scrollable for long tenures

### 2.3 Form Management

**React Hook Form Integration:**

- Each calculator uses `useForm()` hook
- Register inputs with validation
- Watch for real-time updates
- Handle form errors

**Joi Validation:**

- Separate schema file per calculator (e.g., `ppfSchema.js`)
- Validate on blur and submit
- Show error messages inline
- Prevent invalid calculations

### 2.4 Financial Formulas by Instrument

**PPF Calculator:**

- Formula: A = P × [(1 + r)^n - 1] / r × (1 + r)
- Compounding: Annual
- Features: Step-up allowed, max ₹1.5L/year

**FD Calculator:**

- Formula: A = P × (1 + r/n)^(nt)
- Compounding: Quarterly (typically)
- Features: Lumpsum only

**SIP Calculator:**

- Formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
- Where P = monthly investment, r = monthly rate, n = months
- Features: Step-up SIP option

**SSY Calculator:**

- Formula: Same as PPF (yearly contribution)
- Compounding: Annual
- Features: Max ₹1.5L/year, girl child only, account maturity at 21 years

**NPS Calculator:**

- Equity/Debt/Corporate Bond allocation
- Expected returns based on asset mix
- Formula: Standard SIP formula with variable returns

**NSC Calculator:**

- Formula: A = P × (1 + r)^n
- Compounding: Annual, but paid at maturity
- Features: 5-year lock-in

**SGB Calculator:**

- Fixed interest: 2.5% p.a. (semi-annual payment)
- Gold appreciation: User input (typically 8-10%)
- Formula: Final = (Principal × gold price growth) + (2.5% × principal × years)

**SCSS Calculator:**

- Formula: Simple quarterly interest
- Interest = P × r × n
- Features: 60+ years, max ₹30L

**Equity/ELSS Calculator:**

- SIP or lumpsum input
- Expected CAGR input by user
- ELSS: 3-year lock-in
- Standard compound/SIP formulas

### 2.5 Inflation Adjustment Logic

When "Adjust for Inflation" is toggled ON:

- Real Return = [(1 + Nominal Return) / (1 + Inflation Rate)] - 1
- Apply compound inflation annually to show inflation-adjusted corpus
- Default inflation rate: 6% (based on current RBI data)
- Show both nominal and real values

### 2.6 Step-Up Logic

Allow users to specify annual increase in investment amount:

- Percentage-based: 10% annual increase in SIP
- Fixed amount: ₹500 annual increase
- Calculate future value with increasing payments

## Phase 3: Goal-Based Financial Planning (Feature 2)

### 3.1 Input Form Design

**Step 1: Goal Definition**

- Target corpus amount (₹)
- Time horizon (years)
- Risk appetite: Low / Medium / High / Very High (radio buttons)
- Current savings (optional lumpsum)
- Monthly SIP capacity (optional)

**Form Management:**

- React Hook Form + Joi validation
- Zustand store for form state persistence
- Real-time validation

### 3.2 Risk-Based Asset Allocation

- **Very High Risk:** 80% Equity + 10% SGB + 10% Debt
- **High Risk:** 60% Equity/MF + 20% Hybrid + 20% Debt
- **Medium Risk:** 40% Equity/MF + 30% Debt + 30% Safe (PPF/NSC)
- **Low Risk:** 20% Equity + 40% Debt + 40% Safe (PPF/FD/NSC)

### 3.3 Calculation Engine

1. Calculate required monthly SIP for target corpus
2. If user provides SIP + lumpsum, calculate projected corpus
3. Compare projected vs target
4. If shortfall exists:

      - Calculate gap amount
      - Suggest increase in SIP or lumpsum
      - Recommend alternative asset mix (higher returns)

### 3.4 Output Display

- **Success Case:** "Your goal is achievable! Expected corpus: ₹X"
- **Shortfall Case:** 
    - "Shortfall of ₹X detected"
    - Option 1: Increase SIP by ₹Y
    - Option 2: Add lumpsum of ₹Z
    - Option 3: Adjust time horizon to M years
    - Option 4: Consider higher-risk instruments

### 3.5 Recommended Instruments Table

Show detailed breakdown:

- Instrument name
- Allocation %
- Expected return
- Monthly investment amount
- Projected value at goal date

## Phase 4: Multi-Instrument Corpus Calculator (Feature 3)

### 4.1 Three-Step Form

**Step 1: Investment Selection**

- Display all 10 investment instruments as cards with icons
- Checkbox selection (multi-select)
- Display brief description on hover
- Zustand store: Track selected instruments

**Step 2: Detailed Input Forms**

Create sectional form for each selected instrument with:

- Current investment value (₹)
- Return type: CAGR / XIRR (radio buttons)
- Recurring investment checkbox
    - If checked: Show SIP amount input
    - Frequency dropdown: Monthly / Quarterly / Half-yearly / Yearly
- Expected return % (pre-filled with default, editable)
- Time horizon (years)
- React Hook Form + Joi validation per section
- Zustand store: Persist form data across steps

**Step 3: Review & Submit**

- Display summary table of all inputs
- Edit button for each section (returns to Step 2)
- Calculate button (triggers calculation)

### 4.2 Output Display

**Overall Corpus Section:**

1. Total invested amount
2. Total interest/returns earned
3. Total corpus value
4. Cumulative return %
5. Pie chart: Invested vs Returns

**Individual Instrument Sections:**

For each instrument:

- Same layout as overall (invested, returns, corpus, %)
- Evolution table (year-wise)
- Mini pie chart

### 4.3 Export/Import Functionality

- Export button: Generate JSON with all user inputs + metadata
- Import button: File upload to restore previous session
- JSON structure:
```json
{
  "version": "1.0",
  "exportDate": "2025-11-01",
  "investments": [
    {
      "type": "PPF",
      "currentValue": 50000,
      "returnType": "CAGR",
      "expectedReturn": 7.1,
      "isRecurring": true,
      "sipAmount": 5000,
      "frequency": "monthly",
      "tenure": 10
    }
  ]
}
```


## Phase 5: Shared Components & Utilities

### 5.1 Common Components

- **InputField:** Reusable input with label, validation, rupee symbol, React Hook Form integration
- **Slider:** Range input for percentages/amounts with real-time updates
- **ToggleSwitch:** For inflation adjustment, recurring investment
- **ResultCard:** Display calculated results with icons
- **PieChart:** Recharts-based donut chart
- **InvestmentTable:** Year-wise breakdown table with sorting
- **InfoCard:** Display instrument information with icons
- **CalculatorLayout:** Responsive wrapper handling desktop/mobile layouts

### 5.2 Utility Functions (`calculations.js`)

```javascript
// Compound interest calculation
calculateCompoundInterest(principal, rate, time, frequency)

// SIP future value
calculateSIPFutureValue(monthlyInvestment, annualRate, months)

// Step-up SIP
calculateStepUpSIP(initialSIP, stepUpPercentage, years, returnRate)

// Inflation adjustment
adjustForInflation(amount, inflationRate, years)

// XIRR calculation for irregular cash flows
calculateXIRR(cashFlows, dates)

// CAGR calculation
calculateCAGR(beginningValue, endingValue, years)

// Real return calculation
calculateRealReturn(nominalReturn, inflationRate)
```

### 5.3 Validation (`validators.js`)

- Joi schema helpers
- Validate minimum/maximum investment limits
- Age restrictions (SSY, SCSS)
- Tenure limits
- Input format validation

### 5.4 Formatters (`formatters.js`)

- Format currency (₹1,50,000)
- Format percentages (12.50%)
- Format dates (DD-MM-YYYY)
- Number abbreviations (₹1.5L, ₹2.71Cr)

## Phase 6: UI/UX Implementation

### 6.1 Design System

- **Colors:**
    - Primary: Teal/Green (#14B8A6)
    - Secondary: Indigo (#6366F1)
    - Accent: Light cyan for backgrounds
    - Success: Green, Error: Red, Warning: Amber

- **Typography:**
    - Headings: Inter/Poppins (bold)
    - Body: Inter (regular)
    - Numbers: Tabular nums for alignment

### 6.2 Layout

- **Header:** Logo + Navigation (Calculators, Goal Planning, Corpus Calculator)
- **Hero Section:** Brief introduction + CTA
- **Calculator Grid:** Cards for each calculator
- **Responsive:** Mobile-first approach

### 6.3 Accessibility

- ARIA labels for all inputs
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## Phase 7: Testing & Validation

### 7.1 Calculation Accuracy

- Manual verification against existing calculators (Groww, ET Money, ClearTax)
- Edge case testing (zero values, max limits)
- Compound frequency validation

### 7.2 User Testing

- Test all three main features
- Export/import flow
- Mobile responsiveness
- Cross-browser compatibility
- Real-time calculation performance

## Phase 8: Documentation

### 8.1 Architecture Documentation (`architecture.md`)

Document covering:

- **System Overview:** High-level architecture
- **Technology Stack:** Justification for each choice
- **Folder Structure:** Detailed explanation of each directory
- **State Management Strategy:** When to use local state vs Zustand
- **Routing Strategy:** Route structure, navigation patterns
- **Component Architecture:** Component hierarchy, props patterns
- **Form Management:** React Hook Form + Joi integration
- **Calculation Engine:** Formula references, validation approach
- **Responsive Design:** Breakpoints, layout strategies
- **Performance Optimization:** Code splitting, lazy loading
- **Testing Strategy:** Unit tests, integration tests
- **Deployment:** Build process, environment variables

### 8.2 Feature Plans (`PLAN.md` files)

Each calculator gets its own PLAN.md in `/docs/calculators/`:

- **PLAN-PPF.md:** PPF Calculator implementation details
- **PLAN-FD.md:** FD Calculator implementation details
- **PLAN-SIP.md:** SIP Calculator implementation details
- **PLAN-Equity.md:** Equity Calculator implementation details
- **PLAN-NPS.md:** NPS Calculator implementation details
- **PLAN-SSY.md:** SSY Calculator implementation details
- **PLAN-SGB.md:** SGB Calculator implementation details
- **PLAN-NSC.md:** NSC Calculator implementation details
- **PLAN-ELSS.md:** ELSS Calculator implementation details
- **PLAN-SCSS.md:** SCSS Calculator implementation details

Each PLAN.md includes:

- Component structure
- Input fields with validation rules
- Calculation formulas
- Expected outputs
- Test cases
- Dependencies on other components

## Key Mathematical Formulas Reference

### Compound Interest (Annual)

```
A = P(1 + r)^t
```

### Compound Interest (Multiple Compounding)

```
A = P(1 + r/n)^(nt)
n = compounding frequency per year
```

### SIP Future Value

```
FV = P × [(1 + r)^n - 1] / r × (1 + r)
P = monthly payment
r = monthly rate of return
n = number of months
```

### Real Return (Inflation-adjusted)

```
Real Return = [(1 + Nominal Return) / (1 + Inflation)] - 1
```

### CAGR

```
CAGR = (Ending Value / Beginning Value)^(1/years) - 1
```

## Implementation Priority

### Phase 0: Foundation (Week 1)

1. **Project Setup:**

      - Initialize Vite + React project
      - Install dependencies (Tailwind, Zustand, React Hook Form, Joi, React Router, Recharts)
      - Configure Tailwind CSS
      - Set up folder structure

2. **Architecture Setup:**

      - Create `architecture.md` document
      - Set up routing structure (`routes.js`, `AppRoutes.jsx`)
      - Create `CalculatorLayout` component for responsive layouts
      - Set up Zustand stores (goalPlanning, corpusCalculator, userPreferences)

3. **Base Components:**

      - Create common components (InputField, Slider, ToggleSwitch, ResultCard)
      - Set up React Hook Form integration
      - Create Joi validation utility functions
      - Build `PieChart` component (Recharts)

4. **Constants & Utilities:**

      - Create `investmentRates.js` with all rates
      - Create `investmentInfo.js` with instrument details
      - Build calculation utilities (`calculations.js`)
      - Create formatters (`formatters.js`)

### Phase 1: Core Calculators (Week 2-3)

1. **PPF Calculator:**

      - Create PLAN-PPF.md
      - Build PPFCalculator component with real-time calculations
      - Implement Joi validation schema
      - Add information panel and evolution table

2. **FD Calculator:**

      - Create PLAN-FD.md
      - Build FDCalculator component
      - Implement quarterly compounding logic

3. **SIP Calculator:**

      - Create PLAN-SIP.md
      - Build SIPCalculator component
      - Add step-up SIP functionality

### Phase 2: Additional Calculators (Week 4-5)

1. **SSY Calculator** (PLAN-SSY.md)
2. **NSC Calculator** (PLAN-NSC.md)
3. **SCSS Calculator** (PLAN-SCSS.md)
4. **SGB Calculator** (PLAN-SGB.md)

### Phase 3: Market-Linked Calculators (Week 6)

1. **Equity Calculator** (PLAN-Equity.md)
2. **ELSS Calculator** (PLAN-ELSS.md)
3. **NPS Calculator** (PLAN-NPS.md)

### Phase 4: Advanced Features (Week 7-8)

1. **Goal Planning Page:**

      - Build form with React Hook Form + Joi
      - Implement risk-based asset allocation
      - Create recommendations engine
      - Use Zustand for state management

2. **Corpus Calculator:**

      - Build 3-step form (Step 1: Selection, Step 2: Inputs, Step 3: Review)
      - Implement Zustand store for multi-step form
      - Build results display with sectional breakdowns
      - Add export/import functionality

### Phase 5: Polish & Testing (Week 9-10)

1. **UI/UX Polish:**

      - Ensure responsive design on all devices
      - Add loading states
      - Improve accessibility
      - Add error handling

2. **Testing:**

      - Test all calculations against reference calculators
      - Validate all forms
      - Test export/import
      - Cross-browser testing
      - Mobile device testing

3. **Documentation:**

      - Complete all PLAN.md files
      - Update architecture.md
      - Add code comments

### Phase 6: Deployment (Week 11-12)

1. **Build Optimization:**

      - Code splitting
      - Lazy loading routes
      - Image optimization

2. **Deployment:**

      - Set up production build
      - Deploy to hosting platform
      - Set up environment variables

3. **Final Testing:**

      - Production environment testing
      - Performance testing
      - User acceptance testing

### To-dos

- [ ] Initialize Vite + React project, install dependencies (Tailwind, Zustand, Recharts), configure Tailwind
- [ ] Create complete folder structure with all directories for components, pages, store, utils, constants
- [ ] Create investmentRates.js and investmentInfo.js with all hardcoded rates and instrument information
- [ ] Set up Zustand store for managing calculator inputs, results, and portfolio data
- [ ] Build calculation utilities (compound interest, SIP, inflation adjustment, CAGR, XIRR)
- [ ] Create reusable components: InputField, Slider, ToggleSwitch, ResultCard, PieChart, InvestmentTable
- [ ] Build complete PPF calculator with inputs, calculations, results, info panel, and evolution table
- [ ] Build FD calculator with compound interest logic and quarterly compounding
- [ ] Build SIP calculator with step-up option and monthly investment tracking
- [ ] Build Sukanya Samriddhi Yojana calculator with age validation and yearly contributions
- [ ] Build NPS calculator with asset allocation options (equity/debt/corporate bonds)
- [ ] Build Sovereign Gold Bond calculator with fixed interest + gold appreciation
- [ ] Build NSC calculator with 5-year lock-in and annual compounding
- [ ] Build SCSS calculator with quarterly interest payments and age validation
- [ ] Build Equity/Stock calculator with lumpsum and SIP options
- [ ] Build ELSS calculator with 3-year lock-in and SIP support
- [ ] Implement inflation adjustment toggle functionality across all calculators
- [ ] Build goal-based financial planning page with input form, risk assessment, and recommendations
- [ ] Implement goal planning calculation engine with asset allocation and shortfall analysis
- [ ] Build Step 1 of corpus calculator: Investment selection with cards and checkboxes
- [ ] Build Step 2 of corpus calculator: Sectional forms for each selected instrument
- [ ] Build Step 3 of corpus calculator: Review and submit interface
- [ ] Build corpus calculator results display with overall and sectional breakdowns
- [ ] Implement JSON export/import functionality for corpus calculator data
- [ ] Set up React Router and create navigation between Home, Calculators, Goal Planning, and Corpus pages
- [ ] Polish UI/UX, ensure responsive design, add proper spacing, colors, and accessibility features
- [ ] Test all calculations against reference calculators, validate edge cases, and ensure accuracy