import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * ETF Calculator Information Panel
 * Displays information about ETF investments including types, features, tax implications
 */
const ETFCalculatorInfo = () => {
  const etfInfo = investmentInfo.etf
  const etfRates = investmentRates.etf

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About Exchange Traded Funds (ETFs)
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {etfInfo.description}
        </p>
      </div>

      {/* Important Warning */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-200 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Important Warning
        </h3>
        <ul className="space-y-2 text-orange-800 dark:text-orange-300 text-sm">
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Market-Linked Returns:</strong> ETF returns are subject to market volatility. Past performance does not guarantee future returns.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>No Guaranteed Returns:</strong> Unlike fixed deposits, ETFs do not offer guaranteed returns.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Expense Ratio:</strong> Although lower than mutual funds, ETFs still charge an expense ratio that reduces your returns.</span>
          </li>
        </ul>
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {etfInfo.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ETF Types */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          ETF Types
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-200">Equity ETFs</p>
            <p className="text-blue-800 dark:text-blue-300">Track equity indices like Nifty 50, Sensex, or sectoral indices. Expected returns: {formatPercentageValue(etfRates?.equity || 12)}% p.a.</p>
          </div>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-200">Debt ETFs</p>
            <p className="text-blue-800 dark:text-blue-300">Track government securities or corporate bonds. Expected returns: {formatPercentageValue(etfRates?.debt || 7)}% p.a.</p>
          </div>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-200">Gold ETFs</p>
            <p className="text-blue-800 dark:text-blue-300">Track gold prices. Expected returns: {formatPercentageValue(etfRates?.gold || 8)}% p.a.</p>
          </div>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-200">International ETFs</p>
            <p className="text-blue-800 dark:text-blue-300">Track international indices like S&P 500, NASDAQ. Expected returns: {formatPercentageValue(etfRates?.international || 10)}% p.a.</p>
          </div>
        </div>
      </div>

      {/* Expense Ratio Advantage */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Expense Ratio Advantage
        </h3>
        <p className="text-green-800 dark:text-green-300 text-sm mb-2">
          ETFs typically have significantly lower expense ratios compared to mutual funds:
        </p>
        <ul className="space-y-2 text-green-800 dark:text-green-300 text-sm">
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>ETF Expense Ratio:</strong> 0.05% - 0.50% (typically 0.20%)</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Mutual Fund Expense Ratio:</strong> 1% - 2%</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Impact:</strong> Lower expense ratio means more money stays invested and compounds over time.</span>
          </li>
        </ul>
      </div>

      {/* Tax Implications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Tax Implications
        </h3>
        <ul className="space-y-2">
          {etfInfo.taxBenefits.map((benefit, index) => (
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
          {etfInfo.eligibility.map((item, index) => (
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
            <span><strong>Diversification:</strong> Consider diversifying across different ETF types (equity, debt, gold) based on your risk profile.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Cost Efficiency:</strong> ETFs offer lower expense ratios, making them more cost-effective for long-term investing.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Liquidity:</strong> ETFs trade on stock exchanges like stocks, providing high liquidity.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Index Tracking:</strong> ETFs track underlying indices, providing broad market exposure.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Demat Account:</strong> You need a Demat account to invest in ETFs.</span>
          </li>
        </ul>
      </div>

      {/* Lock-in Period */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Lock-in Period
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {etfInfo.lockInPeriod}
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {etfInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {etfInfo.maxInvestment}
        </p>
      </div>
    </div>
  )
}

export default ETFCalculatorInfo

