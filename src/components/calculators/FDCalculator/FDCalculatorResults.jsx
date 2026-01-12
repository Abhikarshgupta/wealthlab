import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'
import useUserPreferencesStore from '@/store/userPreferencesStore'

/**
 * FD Calculator Results Panel
 * Displays calculated results including principal, maturity amount, interest earned, effective return, and pie chart
 * 
 * @param {Object} results - Calculation results from useFDCalculator hook
 * @param {string} compoundingFrequency - Selected compounding frequency
 */
const FDCalculatorResults = ({ results, compoundingFrequency }) => {
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
    maturityAmount,
    interestEarned,
    effectiveReturn,
    taxAmount,
    postTaxAmount,
    taxRate,
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

      {/* Compounding Frequency Info */}
      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Compounding:</strong> {
            compoundingFrequency === 'quarterly' ? 'Quarterly (4 times per year)' :
            compoundingFrequency === 'monthly' ? 'Monthly (12 times per year)' :
            compoundingFrequency === 'annually' ? 'Annually (once per year)' :
            'Cumulative (paid at maturity)'
          }
        </p>
      </div>

      {/* Hero Section: Money in Hand / Actual Spending Power */}
      <MoneyInHandHero
        postTaxAmount={postTaxAmount}
        actualSpendingPower={actualSpendingPower}
        inflationAdjusted={adjustInflation && actualSpendingPower !== null}
        taxSlab={incomeTaxSlab}
        taxRateLabel={results.taxRateLabel}
        taxAmount={taxAmount}
        effectiveReturn={effectiveReturn}
        instrumentType="fd"
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
        tdsInfo={tdsInfo}
        instrumentType="fd"
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

export default FDCalculatorResults

