import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * ELSS Calculator Evolution Table
 * Displays year-wise breakdown of ELSS investment
 * 
 * @param {Array} evolution - Evolution data from useELSSCalculator hook
 */
const ELSSCalculatorTable = ({ evolution }) => {
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

export default ELSSCalculatorTable

