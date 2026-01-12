import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * SGB Calculator Results Panel
 * Displays calculated results including principal, returns, maturity amount, and pie chart
 * 
 * @param {Object} results - Calculation results from useSGBCalculator hook
 */
const SGBCalculatorResults = ({ results }) => {
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
    goldAmount,
    maturityAmount,
    goldAppreciatedValue,
    fixedInterestAmount,
    totalReturns,
    effectiveReturn,
    cagr,
    taxAmount,
    postTaxAmount,
    taxRule,
    actualSpendingPower,
    tenure,
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Principal Invested',
      y: principal,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Fixed Interest',
      y: fixedInterestAmount,
      color: '#14B8A6' // Teal
    },
    {
      name: 'Gold Appreciation',
      y: goldAppreciatedValue - principal,
      color: '#F59E0B' // Amber
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
        instrumentType="sgb"
      />

      {/* Tax Breakdown (Expandable) */}
      <TaxBreakdown
        maturityAmount={maturityAmount}
        principal={principal}
        returns={totalReturns}
        taxAmount={taxAmount}
        postTaxAmount={postTaxAmount}
        taxSlab={incomeTaxSlab}
        taxRateLabel={results.taxRateLabel}
        taxRule={taxRule}
        instrumentType="sgb"
      />


      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${principal}-${fixedInterestAmount}-${goldAppreciatedValue - principal}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default SGBCalculatorResults

