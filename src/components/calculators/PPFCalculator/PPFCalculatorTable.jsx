import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * PPF Calculator Evolution Table
 * Displays year-wise breakdown of PPF investment
 * 
 * @param {Array} evolution - Evolution data from usePPFCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from usePPFCalculator hook (optional, for post-tax footer)
 */
const PPFCalculatorTable = ({ evolution, tenure, results = null }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Extract post-tax values from results if available (PPF is tax-free, so taxAmount = 0)
  const preTaxMaturity = results?.maturityValue || null
  const taxAmount = 0 // PPF is tax-free
  const postTaxAmount = results?.maturityValue || null // Same as pre-tax since tax-free
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
      instrumentType="ppf"
    />
  )
}

export default PPFCalculatorTable

