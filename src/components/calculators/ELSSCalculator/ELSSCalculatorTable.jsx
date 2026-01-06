import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * ELSS Calculator Evolution Table
 * Displays year-wise breakdown of ELSS investment
 * 
 * @param {Array} evolution - Evolution data from useELSSCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const ELSSCalculatorTable = ({ evolution, tenure }) => {
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

export default ELSSCalculatorTable

