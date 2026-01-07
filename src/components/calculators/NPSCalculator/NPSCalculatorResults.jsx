import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * NPS Calculator Results Panel
 * Displays calculated results including total invested, returns, corpus, weighted return, and pie chart
 * 
 * @param {Object} results - Calculation results from useNPSCalculator hook
 */
const NPSCalculatorResults = ({ results }) => {
  const { adjustInflation, incomeTaxSlab } = useUserPreferencesStore()

  if (!results) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Results
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Enter values and ensure asset allocation totals 100% to see calculation results
        </p>
      </div>
    )
  }

  const {
    totalInvested,
    returnsEarned,
    corpusValue,
    weightedReturn,
    xirr,
    allocation,
    inputAllocation,
    taxAmount,
    postTaxAmount,
    taxRule,
    actualSpendingPower,
  } = results

  // Check if allocation was adjusted (input differs from effective)
  const allocationAdjusted = inputAllocation && (
    Math.abs(inputAllocation.equity - allocation.equity) > 0.01 ||
    Math.abs(inputAllocation.corporateBonds - allocation.corporateBonds) > 0.01 ||
    Math.abs(inputAllocation.governmentBonds - allocation.governmentBonds) > 0.01 ||
    Math.abs(inputAllocation.alternative - allocation.alternative) > 0.01
  )

  // Prepare pie chart data for investment breakdown
  const pieChartData = [
    {
      name: 'Total Invested',
      y: totalInvested,
      color: '#6366F1' // Indigo
    },
    {
      name: 'Returns Earned',
      y: returnsEarned,
      color: '#14B8A6' // Teal
    }
  ]

  // Prepare pie chart data for asset allocation
  const allocationChartData = [
    {
      name: 'Equity',
      y: allocation.equity,
      color: '#3B82F6' // Blue
    },
    {
      name: 'Corporate Bonds',
      y: allocation.corporateBonds,
      color: '#10B981' // Green
    },
    {
      name: 'Government Bonds',
      y: allocation.governmentBonds,
      color: '#F59E0B' // Amber
    },
    ...(allocation.alternative > 0 ? [{
      name: 'Alternative',
      y: allocation.alternative,
      color: '#8B5CF6' // Purple
    }] : [])
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
        instrumentType="nps"
      />

      {/* Tax Breakdown (Expandable) */}
      <TaxBreakdown
        maturityAmount={corpusValue}
        principal={totalInvested}
        returns={returnsEarned}
        taxAmount={taxAmount}
        postTaxAmount={postTaxAmount}
        taxSlab={incomeTaxSlab}
        taxRule={taxRule}
        instrumentType="nps"
      />


      {/* Investment Breakdown Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${totalInvested}-${returnsEarned}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>

      {/* Asset Allocation Pie Chart */}
      <div className="mt-6">
        {allocationAdjusted && (
          <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Note:</strong> Asset allocation has been adjusted to comply with PFRDA age-based regulations. 
              The chart below shows the effective allocation used in calculations.
            </p>
          </div>
        )}
        <PieChart
          key={`${allocation.equity}-${allocation.corporateBonds}-${allocation.governmentBonds}-${allocation.alternative}`}
          data={allocationChartData}
          title="Asset Allocation (Effective)"
          height={350}
        />
      </div>
    </div>
  )
}

export default NPSCalculatorResults

