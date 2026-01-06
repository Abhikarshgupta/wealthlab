import InvestmentTable from '@/components/common/InvestmentTable/InvestmentTable'
import { formatCurrency, formatPercentageValue } from '@/utils/formatters'

/**
 * IPO Calculator Evolution Table
 * Displays year-wise breakdown of IPO investment including listing gains and post-listing growth
 * 
 * @param {Array} evolution - Evolution data from useIPOCalculator hook
 * @param {number} tenure - Investment tenure in years
 */
const IPOCalculatorTable = ({ evolution, tenure }) => {
  if (!evolution || evolution.length === 0) {
    return null
  }

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
        </table>
      </div>
    </div>
  )
}

export default IPOCalculatorTable

