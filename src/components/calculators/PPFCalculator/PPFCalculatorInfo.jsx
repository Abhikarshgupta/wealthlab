import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * PPF Calculator Information Panel
 * Displays information about PPF investments including expected returns, features, tax implications, and early withdrawal rules
 */
const PPFCalculatorInfo = () => {
  const ppfInfo = investmentInfo.ppf
  const ppfRates = investmentRates.ppf

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About PPF (Public Provident Fund)
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {ppfInfo.description}
        </p>
      </div>

      {/* Current Rate */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Current Interest Rate
        </h3>
        <p className="text-green-800 dark:text-green-300">
          <span className="font-bold text-xl">
            {formatPercentageValue(ppfRates.rate)}
          </span>
          {' '}per annum (compounded annually)
        </p>
        <p className="text-sm text-green-700 dark:text-green-400 mt-2">
          Last updated: {new Date(ppfRates.lastUpdated).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {ppfInfo.features.map((feature, index) => (
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
          Tax Benefits
        </h3>
        <ul className="space-y-2">
          {ppfInfo.taxBenefits.map((benefit, index) => (
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
          {ppfInfo.eligibility.map((item, index) => (
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
          Lock-in Period
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {ppfInfo.lockInPeriod}
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {ppfInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {ppfInfo.maxInvestment}
        </p>
      </div>

      {/* Early Withdrawal Rules */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          Early Withdrawal Rules (As per Indian Income Tax Rules)
        </h3>
        
        {/* Partial Withdrawals */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Partial Withdrawals
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Eligibility:</strong> Allowed after completion of 5 financial years from the end of the year in which the account was opened.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Frequency:</strong> Only one partial withdrawal is allowed per financial year.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Maximum Amount:</strong> The lesser of:</span>
            </li>
            <li className="flex items-start ml-4">
              <span className="mr-2">-</span>
              <span>50% of the balance at the end of the 4th financial year preceding the year of withdrawal, OR</span>
            </li>
            <li className="flex items-start ml-4">
              <span className="mr-2">-</span>
              <span>50% of the balance at the end of the immediately preceding financial year</span>
            </li>
          </ul>
        </div>

        {/* Premature Closure */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Premature Closure
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Eligibility:</strong> Allowed after the account has been active for at least 5 financial years.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Permissible Reasons:</strong></span>
            </li>
            <li className="flex items-start ml-4">
              <span className="mr-2">-</span>
              <span>Serious medical treatment for the account holder, spouse, dependent children, or parents</span>
            </li>
            <li className="flex items-start ml-4">
              <span className="mr-2">-</span>
              <span>Higher education expenses for the account holder or dependent children</span>
            </li>
            <li className="flex items-start ml-4">
              <span className="mr-2">-</span>
              <span>Change in residency status (becoming a Non-Resident Indian)</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Penalty:</strong> A penalty of 1% is deducted from the interest rate applicable for each year the account was held.</span>
            </li>
          </ul>
        </div>

        {/* Withdrawal After Maturity */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Withdrawal After Maturity
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Eligibility:</strong> Upon completion of the 15-year maturity period, the account holder can withdraw the entire balance without any penalties.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Options Post-Maturity:</strong></span>
            </li>
            <li className="flex items-start ml-4">
              <span className="mr-2">-</span>
              <span>Withdraw the full amount and close the account</span>
            </li>
            <li className="flex items-start ml-4">
              <span className="mr-2">-</span>
              <span>Extend the account in blocks of 5 years, with or without further contributions</span>
            </li>
          </ul>
        </div>

        {/* Tax Implications */}
        <div>
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Tax Implications for Withdrawals
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>All withdrawals from a PPF account (partial, premature, or upon maturity) are <strong>exempt from income tax</strong> under the Exempt-Exempt-Exempt (EEE) category.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>No TDS (Tax Deducted at Source) is applicable on PPF withdrawals.</span>
            </li>
          </ul>
        </div>

        {/* Important Note */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Important:</strong> The rules and regulations governing PPF accounts are subject to change. It is advisable to consult the latest guidelines from the Ministry of Finance or the official PPF scheme notifications for the most current information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PPFCalculatorInfo

