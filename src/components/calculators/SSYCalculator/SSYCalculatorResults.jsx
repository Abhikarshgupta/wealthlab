import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * SSY Calculator Results Panel
 * Displays calculated results including total invested, interest earned, maturity value, maturity year, return percentage, and pie chart
 * 
 * @param {Object} results - Calculation results from useSSYCalculator hook
 */
const SSYCalculatorResults = ({ results }) => {
  const { adjustInflation } = useUserPreferencesStore()

  if (!results) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Results
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Enter values to see calculation results
        </p>
      </div>
    )
  }

  const {
    totalInvested,
    totalInterest,
    maturityValue,
    maturityYear,
    yearsTillMaturity,
    returnPercentage,
    actualSpendingPower
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Total Invested',
      y: totalInvested,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Total Interest',
      y: totalInterest,
      color: '#14B8A6' // Teal
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Results
      </h2>

      {/* Maturity Info */}
      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Maturity Year:</strong> {maturityYear} • <strong>Investment Period:</strong> {yearsTillMaturity} {yearsTillMaturity === 1 ? 'year' : 'years'} (Account matures when girl child turns 21)
        </p>
      </div>

      {/* Hero Section: Money in Hand / Spending Power */}
      <MoneyInHandHero
        postTaxAmount={maturityValue}
        actualSpendingPower={actualSpendingPower}
        inflationAdjusted={adjustInflation && actualSpendingPower !== null}
        taxSlab={0}
        taxAmount={0}
        instrumentType="ssy"
      />

      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${totalInvested}-${totalInterest}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default SSYCalculatorResults

