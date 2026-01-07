import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * ELSS Calculator Evolution Table
 * Displays year-wise breakdown of ELSS investment
 * 
 * @param {Array} evolution - Evolution data from useELSSCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useELSSCalculator hook (optional, for post-tax footer)
 */
const ELSSCalculatorTable = ({ evolution, tenure, results = null }) => {
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
      instrumentType="elss"
    />
  )
}

export default ELSSCalculatorTable

