import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * Debt Mutual Fund Calculator Evolution Table
 * Displays year-wise breakdown of debt mutual fund investment
 * 
 * @param {Array} evolution - Evolution data from useDebtMutualFundCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useDebtMutualFundCalculator hook (optional, for post-tax footer)
 */
const DebtMutualFundCalculatorTable = ({ evolution, tenure, results = null }) => {
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
      instrumentType="debtMutualFund"
    />
  )
}

export default DebtMutualFundCalculatorTable

