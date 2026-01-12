import PieChart from '@/components/common/PieChart/PieChart'
import MoneyInHandHero from '@/components/common/MoneyInHandHero'
import TaxBreakdown from '@/components/common/TaxBreakdown'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'
import { calculateIndexedCost, getCurrentFinancialYear } from '@/utils/ciiCalculations'

/**
 * Debt Mutual Fund Calculator Results Panel
 * Displays calculated results including total invested, returns, corpus, XIRR, and pie chart
 * 
 * @param {Object} results - Calculation results from useDebtMutualFundCalculator hook
 */
const DebtMutualFundCalculatorResults = ({ results }) => {
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
    totalInvested,
    returnsEarned,
    corpusValue,
    xirr,
    taxAmount,
    postTaxAmount,
    taxRule,
    actualSpendingPower,
    tenure,
  } = results

  // Prepare pie chart data
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

  // Calculate indexation details if held > 3 years
  const currentFY = getCurrentFinancialYear()
  const purchaseYear = currentFY
  const saleYear = currentFY + Math.floor(tenure || 0)
  const indexationDetails = tenure >= 3 ? calculateIndexedCost(totalInvested, purchaseYear, saleYear) : null

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
        instrumentType="debtMutualFund"
      />

      {/* Tax Breakdown (Expandable) */}
      <TaxBreakdown
        maturityAmount={corpusValue}
        principal={totalInvested}
        returns={returnsEarned}
        taxAmount={taxAmount}
        postTaxAmount={postTaxAmount}
        taxSlab={incomeTaxSlab}
        taxRateLabel={results.taxRateLabel}
        taxRule={taxRule}
        instrumentType="debtMutualFund"
      />

      {/* Indexation Formula Display (if held > 3 years) */}
      {indexationDetails && tenure >= 3 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-3">
            Indexation Benefit Calculation
          </h3>
          <div className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
            <p className="font-semibold mb-2">Step-by-step Indexation Calculation:</p>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-purple-200 dark:border-purple-700 space-y-1 font-mono text-xs">
              <p>1. Purchase Year CII (FY {purchaseYear}-{purchaseYear + 1}): <span className="font-bold">{indexationDetails.purchaseCII}</span></p>
              <p>2. Sale Year CII (FY {saleYear}-{saleYear + 1}): <span className="font-bold">{indexationDetails.saleCII}</span></p>
              <p>3. Indexation Factor = Sale CII / Purchase CII</p>
              <p className="ml-4">   = {indexationDetails.saleCII} / {indexationDetails.purchaseCII} = <span className="font-bold">{indexationDetails.indexationFactor.toFixed(4)}</span></p>
              <p>4. Indexed Cost = Original Cost × Indexation Factor</p>
              <p className="ml-4">   = {formatCurrency(totalInvested)} × {indexationDetails.indexationFactor.toFixed(4)} = <span className="font-bold">{formatCurrency(indexationDetails.indexedCost)}</span></p>
              <p>5. Taxable Capital Gains = Sale Value - Indexed Cost</p>
              <p className="ml-4">   = {formatCurrency(corpusValue)} - {formatCurrency(indexationDetails.indexedCost)} = <span className="font-bold">{formatCurrency(corpusValue - indexationDetails.indexedCost)}</span></p>
              <p>6. Tax @ 20% = {formatCurrency(corpusValue - indexationDetails.indexedCost)} × 20% = <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(taxAmount)}</span></p>
            </div>
            <p className="text-xs mt-2">
              <strong>Benefit:</strong> Without indexation, taxable gains would be {formatCurrency(returnsEarned)} and tax would be {formatCurrency(returnsEarned * 0.20)}. 
              Indexation reduces taxable gains to {formatCurrency(corpusValue - indexationDetails.indexedCost)}, saving you {formatCurrency((returnsEarned * 0.20) - taxAmount)} in taxes!
            </p>
          </div>
        </div>
      )}

      {/* Tax Efficiency Note */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Tax Efficiency Note
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
          Debt mutual funds offer tax advantages over Fixed Deposits:
        </p>
        <ul className="text-xs text-blue-700 dark:text-blue-400 ml-4 list-disc space-y-1">
          <li>
            <strong>Long-term (held &gt;3 years):</strong> LTCG taxed at 20% with indexation benefit, which reduces effective tax rate significantly
          </li>
          <li>
            <strong>Short-term (held &lt;3 years):</strong> STCG taxed as per your income tax slab
          </li>
          <li>
            <strong>No TDS:</strong> Unlike FDs, no TDS is deducted on redemption
          </li>
          <li>
            <strong>Post-tax returns:</strong> After accounting for indexation, debt mutual funds often provide better post-tax returns than FDs
          </li>
        </ul>
      </div>

      {/* Pie Chart */}
      <div className="mt-6">
        <PieChart
          key={`${totalInvested}-${returnsEarned}`}
          data={pieChartData}
          title="Investment Breakdown"
          height={350}
        />
      </div>
    </div>
  )
}

export default DebtMutualFundCalculatorResults

