import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SSY Calculator Evolution Table
 * Displays year-wise breakdown of SSY investment till girl child turns 21
 * 
 * @param {Array} evolution - Evolution data from useSSYCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const SSYCalculatorTable = ({ evolution, tenure }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

  return (
    <InvestmentTable
      data={evolution}
      title="Year-wise Investment Evolution (Till Girl Child Turns 21)"
      tenure={tenure}
    />
  )
}

export default SSYCalculatorTable

