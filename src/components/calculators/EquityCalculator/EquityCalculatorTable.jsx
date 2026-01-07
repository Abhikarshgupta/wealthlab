import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * Equity Calculator Evolution Table
 * Displays year-wise breakdown of equity investment
 * 
 * @param {Array} evolution - Evolution data from useEquityCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useEquityCalculator hook (optional, for post-tax footer)
 */
const EquityCalculatorTable = ({ evolution, tenure, results = null }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Extract post-tax values from results if available
  const preTaxMaturity = results?.corpusValue || null
  const taxAmount = results?.taxAmount || null
  const postTaxAmount = results?.postTaxAmount || null
  const postTaxSpendingPower = results?.actualSpendingPower || null

  return (
    <InvestmentTable
      data={evolution}
      title="Year-wise Investment Evolution"
      tenure={tenure}
      preTaxMaturity={preTaxMaturity}
      taxAmount={taxAmount}
      postTaxAmount={postTaxAmount}
      postTaxSpendingPower={postTaxSpendingPower}
      instrumentType="equity"
    />
  )
}

export default EquityCalculatorTable

