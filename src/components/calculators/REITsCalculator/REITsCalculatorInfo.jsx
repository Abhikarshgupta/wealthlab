import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * REITs Calculator Information Panel
 * Displays information about REITs investments including features, tax implications, and risks
 */
const REITsCalculatorInfo = () => {
  const reitsInfo = investmentInfo.reits
  const reitsRates = investmentRates.reits

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About REITs
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {reitsInfo.description}
        </p>
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {reitsInfo.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expected Returns */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Expected Returns
        </h3>
        <div className="space-y-2 text-green-800 dark:text-green-300">
          <p>
            <span className="font-bold">Dividend Yield:</span>{' '}
            <span className="font-bold text-xl">
              {formatPercentageValue(reitsRates.dividendYield)}
            </span>
            {' '}per annum (historical range: 6-8%)
          </p>
          <p>
            <span className="font-bold">Capital Appreciation:</span>{' '}
            <span className="font-bold text-xl">
              {formatPercentageValue(reitsRates.capitalAppreciation)}
            </span>
            {' '}per annum (historical range: 5-7%)
          </p>
          <p className="text-sm text-green-700 dark:text-green-400 mt-2">
            <strong>Note:</strong> Returns are market-linked and may vary. Historical performance does not guarantee future returns.
          </p>
        </div>
      </div>

      {/* Tax Implications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Tax Implications
        </h3>
        <ul className="space-y-2">
          {reitsInfo.taxBenefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Considerations */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-200 mb-2">
          Risk Considerations
        </h3>
        <ul className="space-y-2 text-orange-800 dark:text-orange-300 text-sm">
          {reitsInfo.risks?.map((risk, index) => (
            <li key={index} className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Eligibility */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Eligibility
        </h3>
        <ul className="space-y-2">
          {reitsInfo.eligibility.map((item, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Investment Strategy Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Investment Strategy Tips
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Regular Income:</strong> REITs provide regular dividend income, making them suitable for income-seeking investors.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Real Estate Exposure:</strong> Provides exposure to real estate without the hassles of direct property ownership.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Liquidity:</strong> REITs are listed on stock exchanges, providing liquidity compared to physical real estate.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Lower Minimum Investment:</strong> Can invest with lower amounts compared to buying physical property.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Diversification:</strong> Consider REITs as part of a diversified portfolio alongside equity and debt investments.</span>
          </li>
        </ul>
      </div>

      {/* Lock-in Period */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Lock-in Period
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {reitsInfo.lockInPeriod}
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {reitsInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {reitsInfo.maxInvestment}
        </p>
      </div>
    </div>
  )
}

export default REITsCalculatorInfo

