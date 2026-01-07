import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * SCSS Calculator Results Panel
 * Displays calculated results including principal, interest, maturity amount, quarterly interest, and pie chart
 * 
 * @param {Object} results - Calculation results from useSCSSCalculator hook
 */
const SCSSCalculatorResults = ({ results }) => {
  const { adjustInflation, incomeTaxSlab } = useUserPreferencesStore()

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
    principal,
    totalInterest,
    maturityAmount,
    quarterlyInterest,
    effectiveReturn,
    taxAmount,
    postTaxAmount,
    taxRule,
    tdsInfo,
    actualSpendingPower,
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Principal',
      y: principal,
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

      {/* Hero Section: Money in Hand / Actual Spending Power */}
      <MoneyInHandHero
        postTaxAmount={postTaxAmount}
        actualSpendingPower={actualSpendingPower}
        inflationAdjusted={adjustInflation && actualSpendingPower !== null}
        taxSlab={incomeTaxSlab}
        taxAmount={taxAmount}
        effectiveReturn={effectiveReturn}
        instrumentType="scss"
      />

      {/* Tax Breakdown (Expandable) */}
      <TaxBreakdown
        maturityAmount={maturityAmount}
        principal={principal}
        returns={totalInterest}
        taxAmount={taxAmount}
        postTaxAmount={postTaxAmount}
        taxSlab={incomeTaxSlab}
        taxRule={taxRule}
        tdsInfo={tdsInfo}
        instrumentType="scss"
      />

      {/* Quarterly Interest Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Quarterly Interest Payment
        </h3>
        <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
          {formatCurrency(quarterlyInterest)}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
          Interest is paid quarterly (every 3 months) to your bank account
        </p>
      </div>

      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${principal}-${totalInterest}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default SCSSCalculatorResults

