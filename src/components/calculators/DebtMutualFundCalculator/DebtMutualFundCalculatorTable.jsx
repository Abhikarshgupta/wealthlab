import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * Debt Mutual Fund Calculator Evolution Table
 * Displays year-wise breakdown of debt mutual fund investment
 * 
 * @param {Array} evolution - Evolution data from useDebtMutualFundCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const DebtMutualFundCalculatorTable = ({ evolution, tenure }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  return (
    <InvestmentTable
      data={evolution}
      title="Year-wise Investment Evolution"
      tenure={tenure}
    />
  )
}

export default DebtMutualFundCalculatorTable

