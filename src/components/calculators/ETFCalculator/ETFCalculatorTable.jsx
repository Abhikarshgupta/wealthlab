import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * ETF Calculator Evolution Table
 * Displays year-wise breakdown of ETF investment
 * 
 * @param {Array} evolution - Evolution data from useETFCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useETFCalculator hook (optional, for post-tax footer)
 */
const ETFCalculatorTable = ({ evolution, tenure, results = null }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Extract post-tax values from results if available
  const preTaxMaturity = results?.corpusValue || null
  const taxAmount = results?.taxAmount || null
  const postTaxAmount = results?.postTaxAmount || null
  const postTaxSpendingPower = results?.actualSpendingPower || null

  // Determine instrument type for display
  const instrumentType = results?.etfType 
    ? ((results.etfType === 'equity' || results.etfType === 'international') ? 'equity' : 'debtMutualFund')
    : 'equity'

  return (
    <InvestmentTable
      data={evolution}
      title="Year-wise Investment Evolution"
      tenure={tenure}
      preTaxMaturity={preTaxMaturity}
      taxAmount={taxAmount}
      postTaxAmount={postTaxAmount}
      postTaxSpendingPower={postTaxSpendingPower}
      instrumentType={instrumentType}
    />
  )
}

export default ETFCalculatorTable

