import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * 54EC Bonds Calculator Results Panel
 * Displays calculated results including principal, interest earned, maturity amount, 
 * tax savings, and pie chart
 * 
 * @param {Object} results - Calculation results from use54ECBondsCalculator hook
 */
const Bonds54ECCalculatorResults = ({ results }) => {
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
    investmentAmount,
    interestEarned,
    maturityAmount,
    effectiveReturn,
    taxSaved,
    taxOnInterest,
    netTaxBenefit,
    exemptedCapitalGain,
    taxAmount,
    postTaxAmount,
    taxRule,
    actualSpendingPower,
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Investment',
      y: investmentAmount,
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
        instrumentType="bonds54EC"
      />

      {/* Tax Breakdown (Expandable) */}
      <TaxBreakdown
        maturityAmount={maturityAmount}
        principal={investmentAmount}
        returns={interestEarned}
        taxAmount={taxAmount}
        postTaxAmount={postTaxAmount}
        taxSlab={incomeTaxSlab}
        taxRateLabel={results.taxRateLabel}
        taxRule={taxRule}
        instrumentType="bonds54EC"
      />

      {/* Tax Savings Section */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
          Tax Savings & Benefits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Capital Gain Exempted</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(exemptedCapitalGain)}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Tax Saved (on Capital Gains)</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(taxSaved)}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Tax on Interest (30% slab)</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(taxOnInterest)}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Net Tax Benefit</p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(netTaxBenefit)}
            </p>
          </div>
        </div>
        <p className="text-xs text-green-700 dark:text-green-400 mt-3">
          <strong>Note:</strong> Tax calculations assume 20% LTCG tax on property sale and 30% income tax slab on interest. 
          Actual tax savings may vary based on your tax bracket.
        </p>
      </div>

      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${investmentAmount}-${interestEarned}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default Bonds54ECCalculatorResults

