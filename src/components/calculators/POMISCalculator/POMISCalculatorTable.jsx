import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * POMIS Calculator Evolution Table
 * Displays year-wise breakdown of POMIS investment
 * 
 * @param {Array} evolution - Evolution data from usePOMISCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from usePOMISCalculator hook (optional, for post-tax footer)
 */
const POMISCalculatorTable = ({ evolution, tenure, results = null }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Extract post-tax values from results if available
  const preTaxMaturity = results?.maturityAmount || null
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
      instrumentType="pomis"
    />
  )
}

export default POMISCalculatorTable

