import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'

/**
 * IPO Calculator Information Panel
 * Displays information about IPO/FPO investments including features, tax implications, and risks
 */
const IPOCalculatorInfo = () => {
  const ipoInfo = investmentInfo.ipo

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About IPO/FPO Investments
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {ipoInfo.description}
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
            <span><strong>High Risk:</strong> IPO investments are subject to market volatility. Listing prices can be highly volatile and may result in significant losses.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>No Guaranteed Returns:</strong> IPO investments do not offer guaranteed returns. You may lose your entire investment.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Listing Price Volatility:</strong> Listing prices can differ significantly from issue prices, both upward and downward.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Allotment Risk:</strong> There is no guarantee you will receive shares. Allotment depends on oversubscription and lot size.</span>
          </li>
        </ul>
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {ipoInfo.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* IPO Process */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          IPO Process Explained
        </h3>
        <ol className="space-y-2 text-blue-800 dark:text-blue-300 text-sm list-decimal list-inside">
          <li><strong>Application:</strong> Apply for shares during the IPO subscription period through ASBA or UPI.</li>
          <li><strong>Allotment:</strong> Shares are allotted based on oversubscription, lot size, and allocation policy.</li>
          <li><strong>Listing:</strong> Shares are listed on stock exchanges (typically BSE and NSE) after the IPO period ends.</li>
          <li><strong>Trading:</strong> Once listed, shares can be bought and sold on stock exchanges like regular stocks.</li>
        </ol>
      </div>

      {/* Tax Implications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Tax Implications
        </h3>
        <ul className="space-y-2">
          {ipoInfo.taxBenefits.map((benefit, index) => (
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
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Market Risk:</strong> Listing prices can fluctuate significantly based on market conditions, investor sentiment, and company performance.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Listing Loss Risk:</strong> Shares may list below issue price, resulting in immediate losses.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Allotment Risk:</strong> Popular IPOs may be oversubscribed, resulting in partial or no allotment.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Volatility:</strong> Newly listed stocks can be highly volatile in the initial trading days.</span>
          </li>
        </ul>
      </div>

      {/* Eligibility */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Eligibility
        </h3>
        <ul className="space-y-2">
          {ipoInfo.eligibility.map((item, index) => (
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
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Investment Strategy Tips
        </h3>
        <ul className="space-y-2 text-green-800 dark:text-green-300 text-sm">
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Research:</strong> Thoroughly research the company, its financials, business model, and growth prospects before applying.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Diversification:</strong> Don't invest all your capital in a single IPO. Diversify across multiple IPOs or other investments.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Long-term Perspective:</strong> Consider holding IPO shares for at least 1 year to qualify for LTCG tax benefits.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Demat Account:</strong> You need a Demat account to receive and hold IPO shares.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span><strong>Stay Informed:</strong> Monitor company performance, market conditions, and industry trends after listing.</span>
          </li>
        </ul>
      </div>

      {/* Lock-in Period */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Lock-in Period
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {ipoInfo.lockInPeriod}
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {ipoInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {ipoInfo.maxInvestment}
        </p>
      </div>
    </div>
  )
}

export default IPOCalculatorInfo

