# Corpus Simulator - Feature Documentation

## 🎯 Overview

The **Corpus Simulator** is a comprehensive financial planning tool that allows you to simulate your future corpus by combining multiple investment instruments. Unlike individual calculators that focus on a single instrument, the Corpus Simulator provides a holistic view of your entire investment portfolio, accounting for tax implications, inflation adjustments, and real-world purchasing power.

## ✨ Key Capabilities

### 1. **Multi-Instrument Portfolio Simulation**
- Combine up to 10+ investment instruments simultaneously
- Supports: PPF, FD, SIP, Equity, ELSS, NPS, SSY, NSC, SCSS, SGB
- Real-time aggregation of all investments
- See how different instruments contribute to your total corpus

### 2. **Existing + Future Investment Support**
- **Existing Investments**: Input your current investments and simulate their growth
- **Future Investments**: Plan new investments alongside existing ones
- **Smart Projection**: Choose whether to continue investing in existing instruments or let them grow independently
- **Accurate Current Value**: Uses existing calculator logic to estimate current value based on investment history

### 3. **Tax-Aware Simulations**
- **User-Selectable Tax Bracket**: Choose your income tax slab (0%, 5%, 20%, 30%)
- **Accurate Tax Calculations**: Uses actual principal/interest, not estimates
- **Multiple Tax Methods**:
  - **Withdrawal**: Tax applied at maturity (most realistic for retirement planning)
  - **Accumulation**: Tax paid annually during investment period
  - **Comparison**: See both scenarios side-by-side
- **Instrument-Specific Tax Rules**:
  - FD/NSC/SCSS: Interest taxed as per your tax bracket
  - Equity/SIP/ELSS: LTCG (10% above ₹1L exemption) vs STCG (15%)
  - SGB: Tax-free if held till maturity
  - PPF/SSY: Completely tax-free (EEE)
  - NPS: 60% tax-free, 40% taxable

### 4. **Inflation-Adjusted Projections**
- **General Inflation Rate**: Default 6% (customizable)
- **Category-Specific Inflation**:
  - Education: 10% (default)
  - Healthcare: 8% (default)
  - Real Estate: 7% (default)
  - Luxury Goods: 6% (default)
  - Consumer Goods: 4-5% (default)
- **Nominal vs Real Value**: See both inflation-adjusted and nominal corpus
- **Purchasing Power Analysis**: Understand what your corpus can actually buy

### 5. **Purchasing Power Analysis**
- **City-Specific Pricing**: Tier 1, Tier 2, Tier 3 cities
- **Category-Based Examples**:
  - Education (School fees, College tuition)
  - Real Estate (2BHK Apartment, Plot)
  - Healthcare (Medical procedures, Insurance)
  - Luxury Goods (Cars, Vacations)
  - Consumer Goods (Daily expenses)
- **Future Price Projections**: See how prices will change over time
- **Affordability Metrics**: Units affordable, percentage coverage

### 6. **Comprehensive Tax Breakdown**
- **Instrument-Wise Tax Details**: See tax for each instrument separately
- **Expandable Tax Information**: Click any row to see detailed tax calculations
- **Tax Rate Clarity**:
  - **Tax Rate on Interest**: Your income tax bracket (e.g., 30%)
  - **Effective Tax Rate**: Tax as % of total maturity value (e.g., 9.1%)
  - Clear explanation of why rates differ
- **Total Tax Summary**: Aggregate tax across all instruments

### 7. **Scenario Comparison & Saving**
- **Save Multiple Simulations**: Save up to 10 different scenarios
- **Rename & Organize**: Custom names for each saved simulation
- **Load Previous Simulations**: Quickly switch between scenarios
- **Session Persistence**: Automatically restores your last session
- **Save & Start Fresh**: Save current simulation and begin new one

### 8. **Visual Analytics**
- **Pie Charts**: Instrument-wise corpus breakdown
- **Bar Charts**: Nominal vs inflation-adjusted comparison
- **Progress Indicators**: Visual representation of step completion
- **Responsive Tables**: Detailed breakdowns with expandable rows

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 with hooks
- **State Management**: Zustand (lightweight, perfect for multi-step forms)
- **Form Validation**: React Hook Form + Joi schemas
- **Charts**: Highcharts (PieChart, BarChart)
- **Storage**: localStorage (session persistence + saved simulations)

### Key Components

```
src/
├── pages/CorpusCalculatorPage/
│   └── CorpusCalculatorPage.jsx      # Main orchestrator
├── components/corpus/
│   ├── steps/
│   │   ├── Step1InstrumentSelection.jsx
│   │   ├── Step2InvestmentDetails.jsx
│   │   ├── Step3Settings.jsx
│   │   └── Step4Results.jsx
│   ├── InstrumentInputForms/         # Instrument-specific forms
│   ├── CorpusResults.jsx             # Primary metrics display
│   ├── InstrumentBreakdownTable.jsx  # Detailed breakdown with tax
│   ├── PurchasingPowerPanel.jsx     # Purchasing power analysis
│   ├── CorpusVisualizations.jsx     # Charts and graphs
│   ├── TaxEducationPanelOverlay.jsx # Side panel with tax education
│   └── SavedCalculationsPanel.jsx   # Save/load simulations
├── store/
│   └── corpusCalculatorStore.js      # Zustand store
├── utils/
│   ├── corpusCalculations.js        # Core calculation logic
│   ├── taxCalculations.js           # Tax computation
│   ├── purchasingPowerComparisons.js # Purchasing power logic
│   ├── corpusValidation.js          # Form validation
│   └── corpusDefaults.js            # Default values
└── hooks/
    ├── useCorpusCalculator.js        # Calculation hook
    └── useCorpusPersistence.js      # Persistence hook
```

## 📊 Calculation Flow

### Step 1: Instrument Selection
- Select multiple investment instruments
- Visual cards with instrument details
- Real-time validation

### Step 2: Investment Details
For each selected instrument:
- **Existing Investment** (optional):
  - Current value
  - Years invested
  - Expected return rate
  - Plan to invest more? (yes/no)
- **Future Investment** (if planning to invest more):
  - Instrument-specific inputs (principal, SIP amount, etc.)
  - Tenure (years + months for FD)
  - Expected return rates

### Step 3: Settings & Configuration
- **General Inflation Rate**: Default 6%
- **Category Inflation Rates**: Customize per category
- **Income Tax Bracket**: Select your tax slab
- **Tax Method**: Withdrawal / Accumulation / Both
- **Time Horizon**: Years until corpus withdrawal (1-50 years)
- **City Selection**: For purchasing power analysis

### Step 4: Results & Analysis
- **Primary Metrics**:
  - Total Invested Amount
  - Total Returns
  - Nominal Corpus
  - Inflation-Adjusted Corpus
  - Post-Tax Corpus
  - Purchasing Power Loss
- **Instrument Breakdown**: Detailed table with tax details
- **Visualizations**: Pie charts, bar charts
- **Purchasing Power**: Category-wise affordability analysis

## 🎓 Educational Features

### Tax Education Panel
- **Side Overlay**: Comprehensive tax education
- **Tax Approaches**: Explanation of withdrawal vs accumulation
- **Instrument-Specific Rules**: Click any instrument to see tax details
- **Real-World Examples**: Practical scenarios and calculations

### Tax Calculation Transparency
- **Expandable Details**: Click any instrument row to see:
  - Interest earned
  - Tax rate on interest (your bracket)
  - Effective tax rate (% of maturity value)
  - Tax amount
  - Post-tax value
  - Clear explanation of calculations

## 💾 Persistence Features

### Session Persistence
- Automatically saves progress as you work
- Restores previous session on reload
- "Previous session detected" banner with options

### Saved Simulations
- Save up to 10 different scenarios
- Custom names for each simulation
- View corpus value for quick reference
- Rename and delete saved simulations
- Overlay panel for managing saved simulations

## 🔧 Technical Highlights

### Accurate Tax Calculations
- **Problem Solved**: Previous implementation used arbitrary 30% assumption
- **Solution**: Uses actual principal/interest calculations
- **Priority Logic**:
  1. Direct returns parameter (most accurate)
  2. Calculate from principal (corpus - principal)
  3. Fallback estimate (backward compatibility)

### FD Tenure Enhancement
- **Years + Months Input**: Flexible tenure input (e.g., 1 year 3 months)
- **Auto-Normalization**: Converts 15 months → 1 year 3 months
- **Backward Compatible**: Supports legacy format
- **Consistent**: Same experience across FD Calculator and Corpus Simulator

### Validation & Error Handling
- **Step-by-Step Validation**: Prevents progression with invalid data
- **Clear Error Messages**: Tooltips showing missing fields
- **Required Field Indicators**: Red asterisks for required fields
- **Navigation Control**: Step markers clickable only when valid

## 📈 Use Cases

### Use Case 1: Retirement Planning
1. Select multiple instruments (PPF, NPS, Equity, FD)
2. Input existing investments
3. Plan future investments
4. Set time horizon (e.g., 20 years)
5. See inflation-adjusted corpus
6. Analyze purchasing power for retirement needs

### Use Case 2: Goal-Based Planning
1. Choose instruments matching goal timeline
2. Simulate different scenarios
3. Compare tax implications
4. Adjust investments to meet goal
5. Save multiple scenarios for comparison

### Use Case 3: Tax Optimization
1. Compare different tax brackets
2. See impact of tax method (withdrawal vs accumulation)
3. Understand instrument-specific tax rules
4. Optimize portfolio for tax efficiency

### Use Case 4: City Comparison
1. Select different cities
2. Compare purchasing power
3. Understand cost differences
4. Plan relocation decisions

## 🎨 User Experience Features

### Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Optimized for all screen sizes

### Dark Mode Support
- Full dark mode compatibility
- Consistent theming across all components

### Accessibility
- Keyboard navigation support
- ARIA labels and roles
- Focus indicators
- Screen reader friendly

### Performance
- Real-time calculations without lag
- Optimized re-renders
- Efficient state management
- Lazy loading of heavy components

## 📝 Example Scenarios

### Scenario 1: Aggressive Growth Portfolio
- **Instruments**: Equity (SIP), ELSS, NPS
- **Tax Bracket**: 30%
- **Time Horizon**: 15 years
- **Result**: Higher returns, moderate tax impact

### Scenario 2: Conservative Portfolio
- **Instruments**: PPF, FD, NSC
- **Tax Bracket**: 20%
- **Time Horizon**: 10 years
- **Result**: Lower returns, tax-efficient options

### Scenario 3: Balanced Portfolio
- **Instruments**: Mix of equity and debt
- **Tax Bracket**: 30%
- **Time Horizon**: 20 years
- **Result**: Balanced risk-reward with tax optimization

## 🔮 Future Enhancements

### Potential Additions
- **Comparison Mode**: Side-by-side comparison of multiple scenarios
- **Export/Import**: JSON export for sharing simulations
- **Historical Simulations**: Track changes over time
- **Goal Integration**: Link with Goal Planning feature
- **Advanced Tax Scenarios**: TDS, surcharge, cess calculations
- **Real-Time Gold Prices**: Integration for SGB
- **Market-Linked Returns**: Dynamic return rates for equity

## 🎯 Key Differentiators

### vs. Individual Calculators
- **Holistic View**: See entire portfolio, not just one instrument
- **Tax Aggregation**: Understand total tax impact
- **Purchasing Power**: Real-world affordability analysis
- **Scenario Comparison**: Save and compare multiple scenarios

### vs. Simple Spreadsheets
- **Professional Calculations**: Accurate tax and inflation math
- **Visual Analytics**: Charts and graphs
- **User-Friendly**: No Excel knowledge required
- **Always Updated**: Based on current tax laws

### vs. Financial Planning Tools
- **Free & Open**: No subscription fees
- **Privacy-First**: All data stored locally
- **Transparent**: See exactly how calculations work
- **Educational**: Learn while you plan

## 📚 Technical Documentation

For developers working on this feature:

- **Calculation Logic**: See `src/utils/corpusCalculations.js`
- **Tax Calculations**: See `src/utils/taxCalculations.js`
- **Validation**: See `src/utils/corpusValidation.js`
- **State Management**: See `src/store/corpusCalculatorStore.js`

## 🎉 Summary

The Corpus Simulator is a powerful, user-friendly tool that bridges the gap between individual calculators and comprehensive financial planning. It empowers users to:

✅ **Simulate** multiple investment scenarios  
✅ **Understand** tax implications clearly  
✅ **Visualize** purchasing power in real-world terms  
✅ **Compare** different strategies  
✅ **Plan** with confidence for their financial future  

Built with production-grade architecture, comprehensive error handling, and a focus on user education, the Corpus Simulator is designed to be both a powerful calculation tool and an educational resource for financial planning.

---

**Built with ❤️ for Indian investors who want to take control of their financial future.**

