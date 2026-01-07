import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SIP Calculator Evolution Table
 * Displays year-wise breakdown of SIP investment
 * 
 * @param {Array} evolution - Evolution data from useSIPCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useSIPCalculator hook (optional, for post-tax footer)
 */
const SIPCalculatorTable = ({ evolution, tenure, results = null }) => {
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
      instrumentType="sip"
    />
  )
}

export default SIPCalculatorTable

