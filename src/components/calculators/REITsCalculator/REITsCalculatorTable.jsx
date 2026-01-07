import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * REITs Calculator Evolution Table
 * Displays year-wise breakdown of REITs investment including dividends and capital appreciation
 * 
 * @param {Array} evolution - Evolution data from useREITsCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useREITsCalculator hook (optional, for post-tax footer)
 */
const REITsCalculatorTable = ({ evolution, tenure, results = null }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Transform evolution data for InvestmentTable format
  const tableData = evolution.map((yearData, index) => {
    const openingBalance = index === 0 
      ? yearData.investmentValue - yearData.totalReturn 
      : evolution[index - 1].investmentValue
    const closingBalance = yearData.investmentValue
    
    return {
      year: yearData.year,
      openingBalance,
      investment: 0, // No new investment in REITs after initial
      interest: yearData.dividendIncome + yearData.capitalGain, // Total returns (dividend + capital gain)
      closingBalance,
      // Store additional data for potential future use
      dividendIncome: yearData.dividendIncome,
      capitalGain: yearData.capitalGain,
    }
  })

  // Extract post-tax values from results if available
  const preTaxMaturity = results?.finalValue || null
  const taxAmount = results?.taxAmount || null
  const postTaxAmount = results?.postTaxAmount || null
  const postTaxSpendingPower = results?.actualSpendingPower || null

  return (
    <InvestmentTable
      data={tableData}
      title="Year-wise Investment Evolution (Dividend + Capital Appreciation)"
      tenure={tenure}
      preTaxMaturity={preTaxMaturity}
      taxAmount={taxAmount}
      postTaxAmount={postTaxAmount}
      postTaxSpendingPower={postTaxSpendingPower}
      instrumentType="reits"
    />
  )
}

export default REITsCalculatorTable


