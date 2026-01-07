import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * 54EC Bonds Calculator Evolution Table
 * Displays year-wise breakdown of 54EC Bonds investment
 * 
 * @param {Array} evolution - Evolution data from use54ECBondsCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from use54ECBondsCalculator hook (optional, for post-tax footer)
 */
const Bonds54ECCalculatorTable = ({ evolution, tenure, results = null }) => {
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
      instrumentType="bonds54EC"
    />
  )
}

export default Bonds54ECCalculatorTable

