import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * SGB Calculator Information Panel
 * Displays information about SGB investments including fixed rate, features, tax implications
 */
const SGBCalculatorInfo = () => {
  const sgbInfo = investmentInfo.sgb
  const sgbRates = investmentRates.sgb

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About SGB (Sovereign Gold Bonds)
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {sgbInfo.description}
        </p>
      </div>

      {/* Fixed Interest Rate */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Fixed Interest Rate
        </h3>
        <p className="text-green-800 dark:text-green-300">
          <span className="font-bold text-xl">
            {formatPercentageValue(sgbRates.fixedRate)}
          </span>
          {' '}per annum (paid semi-annually)
        </p>
        <p className="text-sm text-green-700 dark:text-green-400 mt-2">
          Last updated: {new Date(sgbRates.lastUpdated).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Gold Appreciation */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
          Gold Appreciation
        </h3>
        <p className="text-yellow-800 dark:text-yellow-300">
          In addition to fixed interest, SGB returns also include capital appreciation 
          linked to gold prices. The final redemption value depends on the prevailing 
          gold price at maturity.
        </p>
        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">
          The calculator uses your expected gold appreciation rate (default: {formatPercentageValue(sgbRates.goldAppreciation)}).
        </p>
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {sgbInfo.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tax Benefits */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Tax Implications
        </h3>
        <ul className="space-y-2">
          {sgbInfo.taxBenefits.map((benefit, index) => (
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
          {sgbInfo.eligibility.map((item, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lock-in Period */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Lock-in Period & Exit Option
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {sgbInfo.lockInPeriod}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          You can choose to exit after 5 years or hold until maturity (8 years). 
          Exit after 5 years allows you to redeem at prevailing gold prices.
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {sgbInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {sgbInfo.maxInvestment}
        </p>
      </div>
    </div>
  )
}

export default SGBCalculatorInfo

