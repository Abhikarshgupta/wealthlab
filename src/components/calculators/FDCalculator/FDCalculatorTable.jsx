import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * FD Calculator Evolution Table
 * Displays year-wise or month-wise breakdown of FD investment
 * 
 * @param {Array} evolution - Evolution data from useFDCalculator hook
 */
const FDCalculatorTable = ({ evolution }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Check if this is monthly evolution (when tenure < 1 year)
  const isMonthly = evolution.length > 0 && evolution[0].label && evolution[0].label.startsWith('Month')

  return (
    <InvestmentTable
      data={evolution}
      title={isMonthly ? "Month-wise Investment Evolution" : "Year-wise Investment Evolution"}
    />
  )
}

export default FDCalculatorTable

