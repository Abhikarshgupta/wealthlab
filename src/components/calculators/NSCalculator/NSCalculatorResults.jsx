import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * NSC Calculator Results Panel
 * Displays calculated results including principal, interest earned, maturity amount, effective return, and pie chart
 * 
 * @param {Object} results - Calculation results from useNSCalculator hook
 */
const NSCalculatorResults = ({ results }) => {
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
    interestEarned,
    maturityAmount,
    effectiveReturn,
    taxAmount,
    postTaxAmount,
    taxRate,
    taxRule,
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
      name: 'Interest Earned',
      y: interestEarned,
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
        taxRateLabel={results.taxRateLabel}
        taxAmount={taxAmount}
        effectiveReturn={effectiveReturn}
        instrumentType="nsc"
      />

      {/* Tax Breakdown (Expandable) */}
      <TaxBreakdown
        maturityAmount={maturityAmount}
        principal={principal}
        returns={interestEarned}
        taxAmount={taxAmount}
        postTaxAmount={postTaxAmount}
        taxSlab={incomeTaxSlab}
        taxRateLabel={results.taxRateLabel}
        taxRule={taxRule}
        instrumentType="nsc"
      />


      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${principal}-${interestEarned}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default NSCalculatorResults

