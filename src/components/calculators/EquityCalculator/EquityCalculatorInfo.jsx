import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * Equity Calculator Information Panel
 * Displays information about equity investments including warnings, features, tax implications
 */
const EquityCalculatorInfo = () => {
  const equityInfo = investmentInfo.equity
  const equityRates = investmentRates.equity

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About Direct Equity Investments
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {equityInfo.description}
        </p>
      </div>

      {/* Important Warning */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Important Warning
        </h3>
        <ul className="space-y-2 text-red-800 dark:text-red-300 text-sm">
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>High Risk:</strong> Equity investments are subject to market volatility and can result in significant losses. Past performance does not guarantee future returns.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Market-Linked Returns:</strong> Returns shown are estimates based on expected CAGR. Actual returns may vary significantly and can be negative.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>No Guaranteed Returns:</strong> Unlike fixed deposits or government schemes, equity investments do not offer guaranteed returns.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Requires Research:</strong> Direct equity investing requires thorough research, analysis, and monitoring of company performance and market conditions.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Not Suitable for All:</strong> Only invest in equities if you have a high risk tolerance and can bear potential losses.</span>
          </li>
        </ul>
      </div>

      {/* Expected Returns */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Expected Returns
        </h3>
        <p className="text-green-800 dark:text-green-300">
          <span className="font-bold text-xl">
            {formatPercentageValue(equityRates.defaultExpectedReturn)}
          </span>
          {' '}per annum (market-linked, user-defined expected CAGR)
        </p>
        <p className="text-sm text-green-700 dark:text-green-400 mt-2">
          <strong>Note:</strong> This is a user-defined estimate. Historical equity market returns in India have averaged around 10-15% p.a. over long periods, but with significant volatility. Individual stocks may perform very differently.
        </p>
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {equityInfo.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
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
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Market Risk:</strong> Stock prices fluctuate based on market conditions, economic factors, and company performance.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Company-Specific Risk:</strong> Individual stocks can decline significantly if the company faces financial difficulties or business challenges.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Liquidity Risk:</strong> Some stocks may be difficult to sell quickly at desired prices, especially during market downturns.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Concentration Risk:</strong> Investing in individual stocks rather than diversified funds increases risk.</span>
          </li>
        </ul>
      </div>

      {/* Tax Implications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Tax Implications
        </h3>
        <ul className="space-y-2">
          {equityInfo.taxBenefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
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
          {equityInfo.eligibility.map((item, index) => (
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
            <span><strong>Diversification:</strong> Consider diversifying across different sectors and companies to reduce risk.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Long-term Perspective:</strong> Equity investments are best suited for long-term goals (5+ years) to ride out market volatility.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Research:</strong> Conduct thorough fundamental and technical analysis before investing in any stock.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Demat Account:</strong> You need a Demat account to buy and hold stocks.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Consider Alternatives:</strong> For diversification, consider equity mutual funds or ETFs instead of direct stock picking.</span>
          </li>
        </ul>
      </div>

      {/* Lock-in Period */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Lock-in Period
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {equityInfo.lockInPeriod}
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {equityInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {equityInfo.maxInvestment}
        </p>
      </div>
    </div>
  )
}

export default EquityCalculatorInfo

