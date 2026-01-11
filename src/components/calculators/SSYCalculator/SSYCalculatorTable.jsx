import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SSY Calculator Evolution Table
 * Displays year-wise breakdown of SSY investment till girl child turns 21
 * 
 * @param {Array} evolution - Evolution data from useSSYCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useSSYCalculator hook (optional, for post-tax footer)
 */
const SSYCalculatorTable = ({ evolution, tenure, results = null }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Extract post-tax values from results if available (SSY is tax-free, so taxAmount = 0)
  const preTaxMaturity = results?.maturityValue || null
  const taxAmount = 0 // SSY is tax-free
  const postTaxAmount = results?.maturityValue || null // Same as pre-tax since tax-free
  const postTaxSpendingPower = results?.actualSpendingPower || null

  return (
    <InvestmentTable
      data={evolution}
      title="Year-wise Investment Evolution (Till Girl Child Turns 21)"
      tenure={tenure}
      preTaxMaturity={preTaxMaturity}
      taxAmount={taxAmount}
      postTaxAmount={postTaxAmount}
      postTaxSpendingPower={postTaxSpendingPower}
      instrumentType="ssy"
    />
  )
}

export default SSYCalculatorTable

