import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * POMIS Calculator Evolution Table
 * Displays year-wise breakdown of POMIS investment
 * 
 * @param {Array} evolution - Evolution data from usePOMISCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const POMISCalculatorTable = ({ evolution, tenure }) => {
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

export default POMISCalculatorTable

