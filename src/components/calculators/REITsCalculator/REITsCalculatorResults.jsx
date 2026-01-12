import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * REITs Calculator Results Panel
 * Displays calculated results including total invested, dividends, capital gains, final value, and pie chart
 * 
 * @param {Object} results - Calculation results from useREITsCalculator hook
 */
const REITsCalculatorResults = ({ results }) => {
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
    totalDividendIncome,
    totalCapitalGain,
    finalValue,
    totalReturns,
    cagr,
    taxAmount,
    postTaxAmount,
    taxRule,
    actualSpendingPower,
  } = results

  // Prepare pie chart data
  const pieChartData = [
    {
      name: 'Total Invested',
      y: investmentAmount,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Dividend Income',
      y: totalDividendIncome,
      color: '#14B8A6' // Teal
    },
    {
      name: 'Capital Gains',
      y: totalCapitalGain,
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
        instrumentType="reits"
      />

      {/* Tax Breakdown (Expandable) */}
      <TaxBreakdown
        maturityAmount={finalValue}
        principal={investmentAmount}
        returns={totalReturns}
        taxAmount={taxAmount}
        postTaxAmount={postTaxAmount}
        taxSlab={incomeTaxSlab}
        taxRateLabel={results.taxRateLabel}
        taxRule={taxRule}
        instrumentType="reits"
      />


      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${investmentAmount}-${totalDividendIncome}-${totalCapitalGain}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default REITsCalculatorResults

