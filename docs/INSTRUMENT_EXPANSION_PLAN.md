# Instrument Expansion Plan

**Last Updated**: January 2025  
**Status**: Planning Phase  
**Objective**: Expand calculator coverage with High/Medium priority instruments, add "upcoming" cards for Low priority instruments

---

## 🎯 Strategy Overview

### Core Principle
- **Build calculators** for instruments with significant tax implications or high retail investor demand
- **Show "upcoming" cards** for specialized/niche instruments that don't warrant full calculators yet
- Focus on instruments relevant to ₹10L net worth retail investors

### Implementation Approach
- Follow existing calculator architecture patterns
- Reuse common components (InputField, ResultCard, InvestmentTable, etc.)
- Maintain consistency with existing calculators
- Add instruments to Corpus Simulator after calculator implementation

---

## ✅ Currently Implemented (10 Calculators)

1. ✅ PPF - Public Provident Fund
2. ✅ FD - Fixed Deposit
3. ✅ SIP - Systematic Investment Plan
4. ✅ SSY - Sukanya Samriddhi Yojana
5. ✅ NSC - National Savings Certificate
6. ✅ SCSS - Senior Citizens Savings Scheme
7. ✅ SGB - Sovereign Gold Bonds
8. ✅ NPS - National Pension System
9. ✅ Equity - Direct Equity/Mutual Funds
10. ✅ ELSS - Equity Linked Savings Scheme

**Status**: All production-ready with full features

---

## 🚀 High Priority Calculators (4 instruments)

### Rationale
- Significant tax implications
- High retail investor demand
- Common investment vehicles for ₹10L net worth investors
- Easy to implement (similar to existing calculators)

### 1. RD Calculator - Recurring Deposit ⭐⭐⭐

**Priority**: High  
**Effort**: 1-2 days  
**Tax Implications**: Interest taxable as per income tax slab, TDS applicable

**Features**:
- Monthly recurring deposit amount
- Tenure input (months/years)
- Interest rate input (default: bank-specific rates)
- Compounding frequency options
- Year-wise breakdown table
- Tax calculation info (TDS thresholds)

**Similar To**: FD Calculator (recurring version)

**Formula**: Future Value of Annuity
```
FV = P × [(1 + r)^n - 1] / r × (1 + r)
```
Where:
- P = Monthly deposit amount
- r = Monthly interest rate
- n = Number of months

**Tax Considerations**:
- Interest taxable as per income tax slab
- TDS at 10% if interest exceeds ₹40,000/year (₹50,000 for senior citizens)
- Form 15G/15H for TDS exemption

**Info Panel Content**:
- Fixed monthly contributions
- Flexible tenure options
- Premature withdrawal penalty
- Loan facility available
- Tax implications

---

### 2. ETF Calculator - Exchange Traded Funds ⭐⭐⭐

**Priority**: High  
**Effort**: 2-3 days  
**Tax Implications**: LTCG/STCG similar to equity, lower expense ratios

**Features**:
- SIP or Lumpsum mode
- ETF type selection (Equity, Debt, Gold, International)
- Expected CAGR input (default: market-linked)
- Tenure input
- Step-up SIP option
- Expense ratio input (lower than mutual funds)
- Year-wise breakdown table

**Similar To**: Equity Calculator + SIP Calculator

**Tax Considerations**:
- Equity ETFs: LTCG (10% above ₹1L exemption) after 1 year, STCG (15%) before 1 year
- Debt ETFs: LTCG (20% with indexation) after 3 years
- Gold ETFs: LTCG (20% with indexation) after 3 years
- Lower expense ratios (0.05-0.50%) vs Mutual Funds (1-2%)

**Info Panel Content**:
- Lower expense ratios
- Index tracking
- Real-time trading
- Tax efficiency
- Diversification benefits

**ETF Types to Support**:
- Equity ETFs (Nifty 50, Sensex, Sectoral)
- Debt ETFs (Government Securities, Corporate Bonds)
- Gold ETFs
- International ETFs (S&P 500, NASDAQ)

---

### 3. POMIS Calculator - Post Office Monthly Income Scheme ⭐⭐⭐

**Priority**: High  
**Effort**: 1-2 days  
**Tax Implications**: Interest taxable as per income tax slab

**Features**:
- Principal amount input (₹1,000 - ₹9L single, ₹15L joint)
- Fixed 5-year tenure
- Monthly interest rate (default: ~7.4% p.a.)
- Monthly income display
- Annual interest calculation
- Year-wise breakdown table

**Similar To**: SCSS Calculator (monthly income variant)

**Formula**: Simple Interest
```
Monthly Interest = (Principal × Annual Rate) / 12
```

**Tax Considerations**:
- Interest taxable as per income tax slab
- TDS applicable if interest exceeds ₹40,000/year
- No tax deduction benefit (unlike PPF/NSC)

**Info Panel Content**:
- Fixed monthly income
- Sovereign guarantee
- 5-year tenure
- Joint account option
- Premature withdrawal rules

**Key Differences from SCSS**:
- Monthly income vs quarterly income
- Lower investment limit
- No age restriction

---

### 4. Debt Mutual Funds Calculator ⭐⭐⭐

**Priority**: High  
**Effort**: 2-3 days  
**Tax Implications**: LTCG with indexation after 3 years (more tax-efficient than FDs)

**Features**:
- SIP or Lumpsum mode
- Debt fund type selection (Liquid, Gilt, Corporate Bond, Short-term, Long-term)
- Expected return input (default: 7-9% based on type)
- Tenure input
- Step-up SIP option
- Year-wise breakdown table

**Similar To**: SIP Calculator + Equity Calculator

**Tax Considerations**:
- LTCG (20% with indexation) after 3 years - **More tax-efficient than FDs**
- STCG (as per income tax slab) before 3 years
- No TDS on redemption
- Indexation benefit reduces tax liability

**Info Panel Content**:
- Tax efficiency (indexation benefit)
- Lower risk than equity
- Higher returns than FDs (post-tax)
- Liquidity options
- Fund categories explained

**Debt Fund Types**:
- Liquid Funds (0-90 days)
- Short-term Debt (1-3 years)
- Long-term Debt (3+ years)
- Gilt Funds (Government Securities)
- Corporate Bond Funds

**Key Selling Point**: Tax efficiency vs FDs (indexation benefit)

---

## 📊 Medium Priority Calculators (4 instruments)

### Rationale
- Moderate tax implications
- Growing retail investor interest
- Useful for portfolio diversification

### 5. IPO/FPO Calculator ⭐⭐

**Priority**: Medium  
**Effort**: 2-3 days  
**Tax Implications**: LTCG/STCG similar to equity

**Features**:
- Application amount input
- Shares allotted input
- Issue price input
- Listing price input (or expected listing gain %)
- Holding period input
- Year-wise breakdown table

**Similar To**: Equity Calculator (specialized for IPOs)

**Tax Considerations**:
- Listing gains: STCG (15%) if sold within 1 year
- Long-term: LTCG (10% above ₹1L exemption) after 1 year
- Dividend income taxable

**Info Panel Content**:
- IPO process explained
- Listing gains/losses
- Tax implications
- Risk warnings
- Historical performance trends

**Use Cases**:
- Calculate listing gains/losses
- Plan holding period for tax optimization
- Estimate post-tax returns

---

### 6. REITs Calculator - Real Estate Investment Trusts ⭐⭐

**Priority**: Medium  
**Effort**: 2-3 days  
**Tax Implications**: Dividend taxable, capital gains similar to equity

**Features**:
- Investment amount input
- Number of units input
- Expected dividend yield (default: 6-8%)
- Expected capital appreciation (default: 5-7%)
- Tenure input
- Year-wise breakdown table (dividend + capital appreciation)

**Similar To**: Equity Calculator (with dividend component)

**Tax Considerations**:
- Dividend income: Taxable as per income tax slab
- Capital gains: LTCG (10% above ₹1L exemption) after 1 year
- STCG (15%) before 1 year
- No indexation benefit on capital gains

**Info Panel Content**:
- Regular dividend income
- Real estate exposure
- Listed on exchanges (liquidity)
- Lower minimum investment than physical real estate
- Risk factors

**Key Features**:
- Dividend yield input
- Capital appreciation separate from dividends
- Total return calculation

---

### 7. InvITs Calculator - Infrastructure Investment Trusts ⭐⭐

**Priority**: Medium  
**Effort**: 2-3 days  
**Tax Implications**: Similar to REITs

**Features**:
- Investment amount input
- Number of units input
- Expected distribution yield (default: 8-12%)
- Expected capital appreciation (default: 5-7%)
- Tenure input
- Year-wise breakdown table

**Similar To**: REITs Calculator

**Tax Considerations**:
- Distribution income: Taxable as per income tax slab
- Capital gains: LTCG (10% above ₹1L exemption) after 1 year
- STCG (15%) before 1 year

**Info Panel Content**:
- Infrastructure exposure
- Regular distributions
- Lower minimum investment
- Listed on exchanges
- Risk factors

**Key Difference from REITs**:
- Higher distribution yield (8-12% vs 6-8%)
- Infrastructure focus vs real estate

---

### 8. 54EC Bonds Calculator - Capital Gain Bonds ⭐⭐

**Priority**: Medium  
**Effort**: 1-2 days  
**Tax Implications**: **Tax exemption on long-term capital gains** from property sale

**Features**:
- Capital gain amount input (from property sale)
- Investment amount input (max: capital gain amount)
- Fixed 5-year tenure
- Interest rate input (default: current rate ~5.75%)
- Year-wise breakdown table
- Tax savings calculation

**Similar To**: NSC Calculator (tax exemption focus)

**Tax Considerations**:
- **Exempts long-term capital gains tax** (up to ₹50L per financial year)
- Interest taxable as per income tax slab
- TDS applicable on interest
- Must invest within 6 months of property sale

**Info Panel Content**:
- Tax exemption benefit
- 5-year lock-in
- Issued by NHAI, REC, PFC
- Investment deadline (6 months from sale)
- Interest payment frequency

**Key Selling Point**: Tax exemption on property sale gains

**Use Case**: Property sale capital gains planning

---

## 📋 Low Priority - "Upcoming" Cards (8 instruments)

These instruments will have placeholder cards with "Coming Soon" badge but no calculator implementation yet.

### Rationale
- Lower retail investor demand
- Specialized/niche products
- Complex tax implications
- Alternative to existing calculators

### Upcoming Cards to Add

1. **POTD** - Post Office Time Deposits
   - Description: Similar to Bank FDs with sovereign guarantee
   - Reason: Similar to FD Calculator, niche product

2. **KVP** - Kisan Vikas Patra
   - Description: Doubles investment at maturity (~10 years)
   - Reason: Long tenure, less common

3. **CFD** - Corporate Fixed Deposits
   - Description: Higher interest than bank FDs, higher credit risk
   - Reason: Higher risk, requires credit rating understanding

4. **G-Secs** - Government Securities (RBI Retail Direct)
   - Description: Direct government bonds, Treasury Bills
   - Reason: Requires RBI Retail Direct account, more complex

5. **7.75% GOI Savings Bonds**
   - Description: 7-year government bonds with high interest
   - Reason: Similar to NSC, less common

6. **Hybrid Mutual Funds**
   - Description: Balanced Advantage Funds, Equity Savings Funds
   - Reason: Covered by SIP/Equity calculators, less differentiation needed

7. **FoF** - Fund of Funds
   - Description: International FoFs, Multi-asset FoFs
   - Reason: Higher expense ratios, less common

8. **ULIPs** - Unit Linked Insurance Plans
   - Description: Insurance + Investment, market-linked
   - Reason: Complex products, higher charges, less transparent

**Card Design**:
- Grayed out appearance
- "Coming Soon" badge
- Brief description
- Non-clickable (or click shows "Coming Soon" message)
- Different styling from active calculators

---

## 🚫 Not Included (Specialized/Inaccessible)

These instruments are not practical for ₹10L net worth investors or too specialized:

1. **LRS Calculator** - Liberalised Remittance Scheme
   - Reason: $250K/year limit, high minimum investment

2. **Physical/Digital Gold Calculator**
   - Reason: Covered by SGB Calculator (more tax-efficient)

3. **Real Estate Calculator**
   - Reason: ₹10L insufficient for meaningful real estate investment

4. **P2P Lending Calculator**
   - Reason: Regulatory complexity, higher risk

5. **AIFs** - Alternative Investment Funds
   - Reason: ₹1 Crore minimum, not accessible

6. **Guaranteed Return Plans** (Insurance)
   - Reason: Complex products, low transparency

7. **Annuity Plans**
   - Reason: Specialized retirement products, complex

---

## 📐 Implementation Plan

### Phase 1: High Priority Calculators (Weeks 1-2)

**Week 1**:
- Day 1-2: RD Calculator
- Day 3-4: POMIS Calculator

**Week 2**:
- Day 1-3: ETF Calculator
- Day 4-5: Debt Mutual Funds Calculator

**Deliverables**:
- 4 new calculators
- Updated CalculatorPage with new cards
- Updated routes.js
- Updated instruments.js (for Corpus Simulator)
- Updated investmentRates.js
- Updated investmentInfo.js

### Phase 2: Medium Priority Calculators (Weeks 3-4)

**Week 3**:
- Day 1-2: 54EC Bonds Calculator
- Day 3-4: IPO/FPO Calculator

**Week 4**:
- Day 1-3: REITs Calculator
- Day 4-5: InvITs Calculator

**Deliverables**:
- 4 new calculators
- Updated CalculatorPage
- Updated routes.js
- Updated instruments.js
- Updated investmentRates.js
- Updated investmentInfo.js

### Phase 3: Upcoming Cards (Week 5)

**Week 5**:
- Day 1-2: Add "upcoming" cards to CalculatorPage
- Day 3: Update styling for upcoming cards
- Day 4-5: Testing and polish

**Deliverables**:
- 8 "upcoming" cards with "Coming Soon" badges
- Updated CalculatorPage styling
- Consistent card design

### Phase 4: Corpus Simulator Integration (Week 6)

**Week 6**:
- Integrate new calculators into Corpus Simulator
- Update corpus calculations
- Update tax calculations
- Update instrument defaults

**Deliverables**:
- Corpus Simulator supports all new instruments
- Accurate tax calculations
- Updated UI for instrument selection

---

## 🔧 Technical Implementation Details

### Calculator Structure

Each calculator follows the existing pattern:

```
src/components/calculators/[InstrumentName]Calculator/
├── [InstrumentName]Calculator.jsx          # Main component
├── [InstrumentName]Calculator.stub.jsx    # Stub for lazy loading
├── [InstrumentName]CalculatorInfo.jsx      # Info panel
├── [InstrumentName]CalculatorResults.jsx   # Results panel
├── [InstrumentName]CalculatorTable.jsx     # Year-wise breakdown
├── [instrument]Schema.js                   # Joi validation schema
└── use[InstrumentName]Calculator.js        # Custom hook (calculations)
```

### Common Components to Reuse

- `InputField` - Form inputs
- `ResultCard` - Result display
- `InvestmentTable` - Year-wise breakdown
- `PieChart` - Visualizations
- `CalculatorLayout` - Responsive layout
- `ToggleSwitch` - Toggle options

### Constants to Update

**investmentRates.js**:
```javascript
rd: {
  rate: 6.5, // Default, varies by bank
  compounding: 'quarterly',
  lastUpdated: '2025-01-01',
},
etf: {
  equity: 12, // Default CAGR
  debt: 7,
  gold: 8,
  international: 10,
  lastUpdated: '2025-01-01',
},
pomis: {
  rate: 7.4,
  lastUpdated: '2025-01-01',
},
// ... etc
```

**investmentInfo.js**:
- Add detailed info for each instrument
- Features, tax benefits, eligibility

**instruments.js**:
- Add to `availableInstruments` array
- Add icons and metadata

**routes.js**:
- Add route constants for each calculator

### Tax Calculation Integration

Update `utils/taxCalculations.js` to handle:
- RD: Interest taxable (TDS thresholds)
- ETF: LTCG/STCG based on type
- POMIS: Interest taxable
- Debt Mutual Funds: Indexation benefit for LTCG
- IPO/FPO: Listing gains taxable
- REITs/InvITs: Dividend + capital gains
- 54EC Bonds: Capital gains exemption

### Corpus Simulator Integration

1. Add instruments to `availableInstruments` in `instruments.js`
2. Update `corpusDefaults.js` with default values
3. Update `corpusCalculations.js` with calculation logic
4. Update `corpusValidation.js` with validation rules
5. Update tax calculations in Corpus Simulator

---

## 📊 Calculator Comparison Matrix

| Calculator | Tax Benefits | Risk Level | Lock-in | Complexity | Similar To |
|------------|-------------|-----------|---------|------------|------------|
| RD | None | Low | Flexible | Low | FD |
| ETF | LTCG benefit | Medium | None | Low | Equity |
| POMIS | None | Low | 5 years | Low | SCSS |
| Debt MF | Indexation | Low | None | Medium | SIP |
| IPO/FPO | LTCG benefit | High | None | Medium | Equity |
| REITs | LTCG benefit | Medium | None | Medium | Equity |
| InvITs | LTCG benefit | Medium | None | Medium | REITs |
| 54EC Bonds | Capital gains exemption | Low | 5 years | Low | NSC |

---

## ✅ Success Criteria

### Functional Requirements
- ✅ All High priority calculators implemented
- ✅ All Medium priority calculators implemented
- ✅ All "upcoming" cards added
- ✅ All calculators integrated into Corpus Simulator
- ✅ Accurate tax calculations
- ✅ Consistent UI/UX with existing calculators

### Quality Requirements
- ✅ Real-time calculations (no calculate button)
- ✅ Responsive design (desktop + mobile)
- ✅ Dark mode support
- ✅ Year-wise breakdown tables
- ✅ Information panels with tax benefits
- ✅ Form validation with Joi
- ✅ Accessibility features

### Testing Requirements
- ✅ Calculation accuracy verified
- ✅ Tax calculations verified
- ✅ Form validation tested
- ✅ Responsive design tested
- ✅ Dark mode tested
- ✅ Cross-browser compatibility

---

## 📝 Notes

### Tax Implications Summary

**High Tax Benefit Instruments**:
- 54EC Bonds: Capital gains exemption
- Debt Mutual Funds: Indexation benefit (more tax-efficient than FDs)
- ELSS: 80C deduction + LTCG benefit
- PPF/SSY: EEE (tax-free)

**Medium Tax Benefit Instruments**:
- ETF: LTCG benefit (similar to equity)
- REITs/InvITs: Dividend + capital gains
- IPO/FPO: LTCG benefit

**Low/No Tax Benefit Instruments**:
- RD: Interest taxable
- POMIS: Interest taxable
- FD: Interest taxable

### Implementation Priority Rationale

**High Priority**: Instruments with significant tax benefits or high demand
**Medium Priority**: Useful diversification tools with moderate tax benefits
**Low Priority**: Specialized/niche products or alternatives to existing calculators

### Future Considerations

- Monitor user feedback on "upcoming" cards
- Consider promoting Low priority instruments to Medium if demand increases
- Add more specialized calculators based on user requests
- Consider adding comparison features (e.g., FD vs Debt Mutual Funds)

---

**See `docs/STATUS.md` for current implementation status and `docs/ROADMAP.md` for long-term plans.**
