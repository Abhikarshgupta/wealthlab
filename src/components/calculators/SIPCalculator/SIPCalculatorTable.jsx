import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'

/**
 * SIP Calculator Evolution Table
 * Displays year-wise breakdown of SIP investment
 * 
 * @param {Array} evolution - Evolution data from useSIPCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const SIPCalculatorTable = ({ evolution, tenure }) => {
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

export default SIPCalculatorTable

