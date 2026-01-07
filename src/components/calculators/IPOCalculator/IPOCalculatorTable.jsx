import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * IPO Calculator Evolution Table
 * Displays year-wise breakdown of IPO investment including listing gains and post-listing growth
 * 
 * @param {Array} evolution - Evolution data from useIPOCalculator hook
 * @param {number} tenure - Investment tenure in years
 * @param {Object} results - Full calculation results from useIPOCalculator hook (optional, for post-tax footer)
 */
const IPOCalculatorTable = ({ evolution, tenure: _tenure, results = null }) => {
  const { adjustInflation, incomeTaxSlab, defaultInflationRate } = useUserPreferencesStore()

  if (!evolution || evolution.length === 0) {
    return null
  }

  // Extract post-tax values from results if available
  const preTaxMaturity = results?.finalValue || null
  const taxAmount = results?.taxAmount || null
  const postTaxAmount = results?.postTaxValue || null
  const postTaxSpendingPower = results?.actualSpendingPower || null
  const showPostTaxFooter = preTaxMaturity !== null && taxAmount !== null && postTaxAmount !== null

  // Transform evolution data for InvestmentTable component
  const tableData = evolution.map((item) => ({
    year: item.year === 'Listing' ? 'Listing Day' : `Year ${item.year}`,
    openingValue: item.openingValue,
    value: item.value,
    gain: item.gain,
    returnPercent: item.returnPercent
  }))

  // Format data for InvestmentTable
  const formattedData = tableData.map((row) => ({
    year: row.year,
    openingBalance: row.openingValue,
    closingBalance: row.value,
    returns: row.gain,
    returnPercent: row.returnPercent,
    // Additional columns for IPO-specific display
    totalGain: row.value - (tableData[0]?.openingValue || 0),
    totalReturnPercent: row.returnPercent
  }))

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Investment Evolution
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Opening Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Closing Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Gain/Loss
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Return %
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Return %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {formattedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {row.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(row.openingBalance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(row.closingBalance)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  row.returns >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(row.returns)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  row.returnPercent >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatPercentageValue(row.returnPercent)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  row.totalReturnPercent >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatPercentageValue(row.totalReturnPercent)}
                </td>
              </tr>
            ))}
          </tbody>
          {showPostTaxFooter && (
            <tfoot>
              <tr className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-t-2 border-yellow-300 dark:border-yellow-700">
                <td colSpan={6} className="px-6 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💰</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Post-Tax Summary (At Maturity)
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                <td className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300" colSpan={5}>
                  Final Pre-Tax Value
                </td>
                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                  {formatCurrency(preTaxMaturity)}
                </td>
              </tr>
              <tr className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                <td className="px-6 py-3 text-sm font-semibold text-red-600 dark:text-red-400" colSpan={5}>
                  Tax at Maturity
                </td>
                <td className="px-6 py-3 text-sm text-right font-bold text-red-600 dark:text-red-400 font-mono tabular-nums">
                  -{formatCurrency(taxAmount)}
                  {incomeTaxSlab && (
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      (@ {Math.round(incomeTaxSlab * 100)}% slab)
                    </span>
                  )}
                </td>
              </tr>
              <tr className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200 dark:border-green-800">
                <td className="px-6 py-3 text-sm font-semibold text-green-700 dark:text-green-400" colSpan={5}>
                  Final Post-Tax Amount
                </td>
                <td className="px-6 py-3 text-sm text-right font-bold text-green-700 dark:text-green-400 font-mono text-lg tabular-nums">
                  {formatCurrency(postTaxAmount)}
                </td>
              </tr>
              {adjustInflation && postTaxSpendingPower !== null && (
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-blue-200 dark:border-blue-800">
                  <td className="px-6 py-3 text-sm font-semibold text-blue-700 dark:text-blue-400" colSpan={5}>
                    Post-Tax Spending Power
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      (@ {defaultInflationRate}% inflation)
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-bold text-blue-700 dark:text-blue-400 font-mono text-lg tabular-nums">
                    {formatCurrency(postTaxSpendingPower)}
                  </td>
                </tr>
              )}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default IPOCalculatorTable

