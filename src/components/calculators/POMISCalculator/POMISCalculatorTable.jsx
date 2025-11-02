import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * POMIS Calculator Evolution Table
 * Displays year-wise breakdown of POMIS investment
 * 
 * @param {Array} evolution - Evolution data from usePOMISCalculator hook
 */
const POMISCalculatorTable = ({ evolution }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  return (
    <InvestmentTable
      data={evolution}
      title="Year-wise Investment Evolution"
    />
  )
}

export default POMISCalculatorTable

