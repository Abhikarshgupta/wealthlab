import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * RD Calculator Evolution Table
 * Displays year-wise or month-wise breakdown of RD investment
 * 
 * @param {Array} evolution - Evolution data from useRDCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useRDCalculator hook (optional, for post-tax footer)
 */
const RDCalculatorTable = ({ evolution, tenure, results = null }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Check if this is monthly evolution (when tenure < 1 year)
  const isMonthly = evolution.length > 0 && evolution[0].label && evolution[0].label.startsWith('Month')

  // Extract post-tax values from results if available
  const preTaxMaturity = results?.maturityAmount || null
  const taxAmount = results?.taxAmount || null
  const postTaxAmount = results?.postTaxAmount || null
  const postTaxSpendingPower = results?.actualSpendingPower || null

  return (
    <InvestmentTable
      data={evolution}
      title={isMonthly ? "Month-wise Investment Evolution" : "Year-wise Investment Evolution"}
      tenure={tenure}
      preTaxMaturity={preTaxMaturity}
      taxAmount={taxAmount}
      postTaxAmount={postTaxAmount}
      postTaxSpendingPower={postTaxSpendingPower}
      instrumentType="rd"
    />
  )
}

export default RDCalculatorTable

