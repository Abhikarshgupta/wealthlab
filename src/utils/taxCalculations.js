/**
 * Tax Calculation Utilities
 * Calculates tax implications for different investment instruments
 * Based on Indian tax rules (FY 2024-25)
 */

/**
 * Get tax rate for an instrument type
 * @param {string} instrumentType - Type of instrument
 * @returns {Object} { type: 'ltcg' | 'stcg' | 'interest' | 'exempt', rate: number }
 */
export const getTaxRateForInstrument = (instrumentType) => {
  const taxRules = {
    ppf: {
      type: 'exempt',
      rate: 0,
      notes: 'Tax-free (EEE - Exempt, Exempt, Exempt)',
    },
    ssy: {
      type: 'exempt',
      rate: 0,
      notes: 'Tax-free (EEE - Exempt, Exempt, Exempt)',
    },
    fd: {
      type: 'interest',
      rate: null, // Depends on income slab
      notes: 'Interest taxed annually as per income slab. TDS applicable if interest > ₹40,000 (₹50,000 for senior citizens)',
    },
    equity: {
      type: 'ltcg',
      rate: 0.10, // 10% above ₹1L exemption
      exemptionLimit: 100000, // ₹1L exemption
      notes: 'LTCG: 10% above ₹1L exemption (held > 1 year). STCG: 15% (held < 1 year)',
    },
    sip: {
      type: 'ltcg',
      rate: 0.10, // 10% above ₹1L exemption
      exemptionLimit: 100000, // ₹1L exemption
      notes: 'LTCG: 10% above ₹1L exemption (held > 1 year). STCG: 15% (held < 1 year)',
    },
    elss: {
      type: 'ltcg',
      rate: 0.10, // 10% above ₹1L exemption (after 3-year lock-in)
      exemptionLimit: 100000, // ₹1L exemption
      notes: 'LTCG: 10% above ₹1L exemption (held > 3 years). STCG: 15% (held < 3 years)',
    },
    etf: {
      type: 'conditional',
      notes: 'Equity ETFs: LTCG (10% above ₹1L exemption) after 1 year, STCG (15%) before 1 year. Debt ETFs: LTCG (20% with indexation) after 3 years. Gold ETFs: LTCG (20% with indexation) after 3 years',
      equityEtf: {
        type: 'ltcg',
        rate: 0.10,
        exemptionLimit: 100000,
        minHoldingPeriod: 1,
      },
      debtEtf: {
        type: 'ltcg_indexed',
        rate: 0.20,
        minHoldingPeriod: 3,
      },
      goldEtf: {
        type: 'ltcg_indexed',
        rate: 0.20,
        minHoldingPeriod: 3,
      },
      internationalEtf: {
        type: 'ltcg',
        rate: 0.10,
        exemptionLimit: 100000,
        minHoldingPeriod: 1,
      },
    },
    nps: {
      type: 'partial',
      taxFreePortion: 0.60, // 60% tax-free
      taxablePortion: 0.40, // 40% taxable
      notes: '60% tax-free, 40% taxable as per income slab',
    },
    sgb: {
      type: 'conditional',
      capitalGainsExempt: true, // If held till maturity
      interestTaxable: true,
      interestRate: 0.025, // 2.5% interest taxable
      notes: 'Capital gains exempt if held till maturity (5/8 years). Interest (2.5%) taxable annually',
    },
    nsc: {
      type: 'interest',
      rate: null, // Depends on income slab
      notes: 'Interest taxable as per income slab. Reinvested qualifies for 80C deduction',
    },
    scss: {
      type: 'interest',
      rate: null, // Depends on income slab
      notes: 'Interest taxable quarterly as per income slab',
    },
    ipo: {
      type: 'ltcg',
      rate: 0.10, // 10% above ₹1L exemption
      exemptionLimit: 100000, // ₹1L exemption
      notes: 'LTCG: 10% above ₹1L exemption (held > 1 year). STCG: 15% (held < 1 year). Listing gains taxable',
    },
    reits: {
      type: 'ltcg',
      rate: 0.10, // 10% above ₹1L exemption
      exemptionLimit: 100000, // ₹1L exemption
      stcgRate: 0.15, // 15% for STCG
      minHoldingPeriod: 1, // LTCG after 1 year
      dividendTaxable: true, // Dividend taxable as per income slab
      notes: 'Dividend income: Taxable as per income tax slab. LTCG: 10% above ₹1L exemption (held > 1 year). STCG: 15% (held < 1 year). No indexation benefit on capital gains',
    },
    debtMutualFund: {
      type: 'ltcg_indexed',
      rate: 0.20, // 20% with indexation
      minHoldingPeriod: 3, // LTCG after 3 years
      stcgRate: null, // STCG taxed as per income slab
      notes: 'LTCG: 20% with indexation benefit after 3 years - More tax-efficient than FDs. STCG: Taxed as per income tax slab if held < 3 years. No TDS on redemption.',
    },
    bonds54EC: {
      type: 'capital_gains_exempt',
      capitalGainsExempt: true, // Exempts LTCG on property sale (up to ₹50L per FY)
      interestTaxable: true,
      maxExemptionLimit: 5000000, // ₹50L per financial year
      notes: 'Exempts long-term capital gains tax on property sale (up to ₹50L per FY). Interest taxable as per income tax slab. Must invest within 6 months of property sale.',
    },
  }

  return taxRules[instrumentType] || {
    type: 'unknown',
    rate: 0,
    notes: 'Tax rules not defined for this instrument',
  }
}

/**
 * Calculate tax on withdrawal (most realistic scenario)
 * Tax is calculated when corpus is withdrawn
 * @param {number} corpus - Total corpus amount (maturity value)
 * @param {string} instrumentType - Type of instrument
 * @param {number} tenure - Investment tenure in years
 * @param {Object} options - Additional options
 * @param {number} options.incomeTaxSlab - Income tax slab rate (as decimal, e.g., 0.30 for 30%)
 * @param {number} options.ltcgExemptionUsed - Already used LTCG exemption (for equity instruments)
 * @param {Object} options.investmentData - Investment data object (for accurate interest calculation)
 * @param {number} options.principal - Principal amount invested (alternative to investmentData)
 * @param {number} options.returns - Actual returns/interest earned (alternative to calculating from principal)
 * @returns {Object} { taxAmount, postTaxCorpus, taxRate }
 */
export const calculateTaxOnWithdrawal = (corpus, instrumentType, tenure, options = {}) => {
  if (!corpus || corpus <= 0) {
    return { taxAmount: 0, postTaxCorpus: corpus, taxRate: 0 }
  }

  const taxRule = getTaxRateForInstrument(instrumentType)
  const { 
    incomeTaxSlab = 0.30, 
    ltcgExemptionUsed = 0,
    investmentData = {},
    principal = null,
    returns = null,
  } = options

  let taxAmount = 0
  let effectiveTaxRate = 0

  switch (taxRule.type) {
    case 'exempt':
      // PPF, SSY - No tax
      taxAmount = 0
      effectiveTaxRate = 0
      break

    case 'ltcg':
      // Equity, SIP, ELSS - LTCG if held > 1 year (or > 3 years for ELSS)
      const minHoldingPeriod = instrumentType === 'elss' ? 3 : 1
      const availableExemption = Math.max(0, taxRule.exemptionLimit - ltcgExemptionUsed)

      if (tenure >= minHoldingPeriod) {
        // Long-term capital gains
        const taxableAmount = Math.max(0, corpus - availableExemption)
        taxAmount = taxableAmount * taxRule.rate
        effectiveTaxRate = corpus > 0 ? (taxAmount / corpus) * 100 : 0
      } else {
        // Short-term capital gains
        taxAmount = corpus * 0.15 // 15% STCG
        effectiveTaxRate = 15
      }
      break

    case 'ltcg_indexed':
      // Debt Mutual Funds - LTCG with indexation after 3 years
      const minDebtFundHoldingPeriod = taxRule.minHoldingPeriod || 3
      
      // Try to get principal for indexation calculation
      let principalAmount = principal
      if (principalAmount === null || principalAmount === undefined) {
        principalAmount = investmentData?.principal || 
                         investmentData?.investedAmount ||
                         investmentData?.yearlyInvestment ||
                         (returns !== null && returns > 0 ? corpus - returns : corpus * 0.7) // Estimate if not available
      }

      if (tenure >= minDebtFundHoldingPeriod) {
        // Long-term capital gains with indexation
        // Indexation factor = CII for year of sale / CII for year of purchase
        // Simplified: Assume 6% inflation for indexation (typical CII increase)
        const indexationFactor = Math.pow(1.06, tenure) // Simplified indexation
        const indexedCost = principalAmount * indexationFactor
        const capitalGains = Math.max(0, corpus - indexedCost)
        taxAmount = capitalGains * taxRule.rate // 20% with indexation
        effectiveTaxRate = corpus > 0 ? (taxAmount / corpus) * 100 : 0
      } else {
        // Short-term capital gains - taxed as per income slab
        const capitalGains = Math.max(0, corpus - principalAmount)
        taxAmount = capitalGains * incomeTaxSlab
        effectiveTaxRate = corpus > 0 ? (taxAmount / corpus) * 100 : 0
      }
      break

    case 'partial':
      // NPS - 60% tax-free, 40% taxable
      const taxablePortion = corpus * taxRule.taxablePortion
      taxAmount = taxablePortion * incomeTaxSlab
      effectiveTaxRate = taxRule.taxablePortion * incomeTaxSlab * 100
      break

    case 'conditional':
      // SGB - Capital gains exempt if held till maturity, interest taxable
      // For simplicity, assume held till maturity (5/8 years)
      const minSGBTenure = 5
      if (tenure >= minSGBTenure) {
        // Capital gains exempt if held till maturity
        // Only interest portion (2.5% fixed) is taxable annually
        // For withdrawal calculation, assume interest was already taxed annually
        // This is a simplified calculation - actual tax depends on when interest was received
        taxAmount = 0 // Capital gains exempt, interest already taxed
        effectiveTaxRate = 0
      } else {
        // If withdrawn early, capital gains taxable
        taxAmount = corpus * 0.15 // 15% STCG approximation
        effectiveTaxRate = 15
      }
      break

    case 'interest':
      // FD, NSC, SCSS - Interest taxed as per income slab
      // Principal is not taxable (already post-tax money)
      // Only interest portion is taxable
      
      // Try to get actual interest amount in order of preference:
      // 1. Direct returns parameter (most accurate)
      // 2. Calculate from principal if available
      // 3. Calculate from investmentData
      // 4. Fallback to estimate (for backward compatibility)
      
      let actualInterest = null
      
      if (returns !== null && returns !== undefined && returns > 0) {
        // Use provided returns directly (most accurate)
        actualInterest = returns
      } else {
        // Try to get principal
        let principalAmount = principal
        
        if (principalAmount === null || principalAmount === undefined) {
          // Try to get from investmentData
          principalAmount = investmentData?.principal || 
                           investmentData?.investedAmount ||
                           investmentData?.yearlyInvestment ||
                           0
        }
        
        if (principalAmount && principalAmount > 0 && corpus > principalAmount) {
          // Calculate actual interest
          actualInterest = corpus - principalAmount
        }
      }
      
      if (actualInterest !== null && actualInterest > 0) {
        // Use actual interest for tax calculation
        taxAmount = actualInterest * incomeTaxSlab
        effectiveTaxRate = corpus > 0 ? (taxAmount / corpus) * 100 : 0
      } else {
        // Fallback to estimate (for backward compatibility)
        // This should rarely happen now, but keeping for safety
        const estimatedReturns = corpus * 0.3 // Rough estimate
        taxAmount = estimatedReturns * incomeTaxSlab
        effectiveTaxRate = (estimatedReturns / corpus) * incomeTaxSlab * 100
      }
      break

    case 'capital_gains_exempt':
      // 54EC Bonds - Capital gains exempt, interest taxable
      // Capital gains exemption is already applied at investment time (not at withdrawal)
      // Only interest portion is taxable as per income slab
      
      // Try to get actual interest amount
      let bonds54ECInterest = null
      
      if (returns !== null && returns !== undefined && returns > 0) {
        bonds54ECInterest = returns
      } else {
        let principalAmount = principal
        
        if (principalAmount === null || principalAmount === undefined) {
          principalAmount = investmentData?.principal || 
                           investmentData?.investedAmount ||
                           0
        }
        
        if (principalAmount && principalAmount > 0 && corpus > principalAmount) {
          bonds54ECInterest = corpus - principalAmount
        }
      }
      
      if (bonds54ECInterest !== null && bonds54ECInterest > 0) {
        // Only interest is taxable (capital gains already exempt at investment)
        taxAmount = bonds54ECInterest * incomeTaxSlab
        effectiveTaxRate = corpus > 0 ? (taxAmount / corpus) * 100 : 0
      } else {
        // Fallback: estimate interest portion
        const estimatedInterest = corpus * 0.25 // Rough estimate for 5-year bond
        taxAmount = estimatedInterest * incomeTaxSlab
        effectiveTaxRate = corpus > 0 ? (taxAmount / corpus) * 100 : 0
      }
      break

    default:
      taxAmount = 0
      effectiveTaxRate = 0
  }

  const postTaxCorpus = corpus - taxAmount

  return {
    taxAmount: Math.round(taxAmount * 100) / 100,
    postTaxCorpus: Math.round(postTaxCorpus * 100) / 100,
    taxRate: Math.round(effectiveTaxRate * 100) / 100,
    taxRule: taxRule.notes,
  }
}

/**
 * Calculate tax during accumulation (tax paid annually during investment period)
 * Tax is calculated and deducted annually on interest/gains
 * @param {Object} investments - Investment data per instrument
 * @param {string} instrumentType - Type of instrument
 * @param {number} tenure - Investment tenure in years
 * @param {Object} options - Additional options
 * @param {number} options.incomeTaxSlab - Income tax slab rate (as decimal)
 * @returns {Object} { totalTaxPaid, finalCorpus, annualTaxBreakdown }
 */
export const calculateTaxDuringAccumulation = (investments, instrumentType, tenure, options = {}) => {
  if (!investments || !instrumentType || !tenure) {
    return { totalTaxPaid: 0, finalCorpus: 0, annualTaxBreakdown: [] }
  }

  const taxRule = getTaxRateForInstrument(instrumentType)
  const { incomeTaxSlab = 0.30 } = options

  // This is a simplified calculation
  // In reality, annual tax calculations depend on the instrument's specific characteristics
  // For now, return a placeholder structure
  const annualTaxBreakdown = []

  // For instruments with annual interest (FD, SCSS), calculate year-wise tax
  if (taxRule.type === 'interest') {
    // Simplified: Estimate annual interest and tax
    let cumulativeCorpus = investments.principal || investments.yearlyInvestment || 0
    let totalTaxPaid = 0

    for (let year = 1; year <= tenure; year++) {
      // Estimate annual interest (simplified - actual calculation depends on instrument)
      const estimatedAnnualInterest = cumulativeCorpus * 0.08 // Rough 8% estimate
      const annualTax = estimatedAnnualInterest * incomeTaxSlab

      totalTaxPaid += annualTax
      cumulativeCorpus += estimatedAnnualInterest - annualTax

      annualTaxBreakdown.push({
        year,
        interestEarned: Math.round(estimatedAnnualInterest * 100) / 100,
        taxPaid: Math.round(annualTax * 100) / 100,
        netCorpus: Math.round(cumulativeCorpus * 100) / 100,
      })
    }

    return {
      totalTaxPaid: Math.round(totalTaxPaid * 100) / 100,
      finalCorpus: Math.round(cumulativeCorpus * 100) / 100,
      annualTaxBreakdown,
    }
  }

  // For other instruments, tax is typically paid at withdrawal
  // Return zeros for this scenario
  return {
    totalTaxPaid: 0,
    finalCorpus: 0,
    annualTaxBreakdown: [],
  }
}

/**
 * Calculate tax for both scenarios (withdrawal and accumulation)
 * Returns comparison of both approaches
 * @param {number} corpus - Total corpus amount
 * @param {Object} investments - Investment data per instrument
 * @param {string} instrumentType - Type of instrument
 * @param {number} tenure - Investment tenure in years
 * @param {Object} options - Additional options
 * @returns {Object} { withdrawal: {...}, accumulation: {...}, comparison }
 */
export const calculateTaxBoth = (corpus, investments, instrumentType, tenure, options = {}) => {
  const withdrawalTax = calculateTaxOnWithdrawal(corpus, instrumentType, tenure, options)
  const accumulationTax = calculateTaxDuringAccumulation(investments, instrumentType, tenure, options)

  return {
    withdrawal: withdrawalTax,
    accumulation: accumulationTax,
    comparison: {
      difference: Math.round((withdrawalTax.postTaxCorpus - accumulationTax.finalCorpus) * 100) / 100,
      moreBeneficial: withdrawalTax.postTaxCorpus > accumulationTax.finalCorpus ? 'withdrawal' : 'accumulation',
    },
  }
}

/**
 * Calculate tax for multiple instruments
 * @param {Object} corpusByInstrument - Corpus amounts by instrument type
 * @param {Object} investments - Investment data by instrument type
 * @param {Array<string>} instruments - Array of instrument types
 * @param {string} taxMethod - 'withdrawal' | 'accumulation' | 'both'
 * @param {Object} options - Additional options
 * @returns {Object} Tax calculation results
 */
export const calculateTaxForMultipleInstruments = (
  corpusByInstrument,
  investments,
  instruments,
  taxMethod = 'withdrawal',
  options = {}
) => {
  const results = {
    byInstrument: {},
    total: {
      taxAmount: 0,
      postTaxCorpus: 0,
    },
  }

  if (!instruments || !Array.isArray(instruments)) {
    return results
  }

  let totalTax = 0
  let totalPostTaxCorpus = 0

  instruments.forEach((instrumentType) => {
    const corpus = corpusByInstrument[instrumentType] || 0
    const investmentData = investments[instrumentType] || {}

    let taxResult

    switch (taxMethod) {
      case 'accumulation':
        taxResult = calculateTaxDuringAccumulation(investmentData, instrumentType, investmentData.tenure || 0, options)
        results.byInstrument[instrumentType] = {
          taxAmount: taxResult.totalTaxPaid,
          postTaxCorpus: taxResult.finalCorpus,
        }
        totalTax += taxResult.totalTaxPaid
        totalPostTaxCorpus += taxResult.finalCorpus
        break

      case 'both':
        taxResult = calculateTaxBoth(corpus, investmentData, instrumentType, investmentData.tenure || 0, options)
        results.byInstrument[instrumentType] = taxResult
        totalTax += taxResult.withdrawal.taxAmount
        totalPostTaxCorpus += taxResult.withdrawal.postTaxCorpus
        break

      case 'withdrawal':
      default:
        taxResult = calculateTaxOnWithdrawal(corpus, instrumentType, investmentData.tenure || 0, options)
        results.byInstrument[instrumentType] = taxResult
        totalTax += taxResult.taxAmount
        totalPostTaxCorpus += taxResult.postTaxCorpus
        break
    }
  })

  results.total = {
    taxAmount: Math.round(totalTax * 100) / 100,
    postTaxCorpus: Math.round(totalPostTaxCorpus * 100) / 100,
  }

  return results
}

export default {
  calculateTaxOnWithdrawal,
  calculateTaxDuringAccumulation,
  calculateTaxBoth,
  getTaxRateForInstrument,
  calculateTaxForMultipleInstruments,
}

