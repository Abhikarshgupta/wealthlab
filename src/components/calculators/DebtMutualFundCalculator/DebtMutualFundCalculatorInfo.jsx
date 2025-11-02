import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * Debt Mutual Fund Calculator Information Panel
 * Displays information about debt mutual fund investments including expected returns, features, tax implications
 */
const DebtMutualFundCalculatorInfo = () => {
  const debtMFInfo = investmentInfo.debtMutualFund
  const debtMFRates = investmentRates.debtMutualFund || {}

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About Debt Mutual Funds
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {debtMFInfo?.description || 'Debt mutual funds invest in fixed-income securities like government bonds, corporate bonds, and money market instruments, offering lower risk than equity funds with steady returns.'}
        </p>
      </div>

      {/* Expected Returns by Fund Type */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Expected Returns by Fund Type
        </h3>
        <div className="space-y-2 text-sm">
          {debtMFRates.liquid && (
            <p className="text-green-800 dark:text-green-300">
              <span className="font-medium">Liquid Funds:</span> {formatPercentageValue(debtMFRates.liquid)} p.a.
            </p>
          )}
          {debtMFRates.shortTerm && (
            <p className="text-green-800 dark:text-green-300">
              <span className="font-medium">Short-term Debt:</span> {formatPercentageValue(debtMFRates.shortTerm)} p.a.
            </p>
          )}
          {debtMFRates.longTerm && (
            <p className="text-green-800 dark:text-green-300">
              <span className="font-medium">Long-term Debt:</span> {formatPercentageValue(debtMFRates.longTerm)} p.a.
            </p>
          )}
          {debtMFRates.gilt && (
            <p className="text-green-800 dark:text-green-300">
              <span className="font-medium">Gilt Funds:</span> {formatPercentageValue(debtMFRates.gilt)} p.a.
            </p>
          )}
          {debtMFRates.corporateBond && (
            <p className="text-green-800 dark:text-green-300">
              <span className="font-medium">Corporate Bond Funds:</span> {formatPercentageValue(debtMFRates.corporateBond)} p.a.
            </p>
          )}
        </div>
        <p className="text-xs text-green-700 dark:text-green-400 mt-2">
          Returns are market-linked and may vary. Last updated: {debtMFRates.lastUpdated ? new Date(debtMFRates.lastUpdated).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A'}
        </p>
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {(debtMFInfo?.features || []).map((feature, index) => (
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
          {(debtMFInfo?.taxBenefits || []).map((benefit, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tax Efficiency vs FD */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Tax Efficiency Advantage
        </h3>
        <p className="text-blue-800 dark:text-blue-300 text-sm mb-2">
          Debt mutual funds are more tax-efficient than Fixed Deposits:
        </p>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300 ml-4 list-disc">
          <li>
            <strong>Indexation Benefit:</strong> For investments held &gt;3 years, you can use indexation to reduce tax liability on capital gains
          </li>
          <li>
            <strong>Lower Effective Tax:</strong> With indexation, effective tax rate can be much lower than FD interest tax (which is taxed as per income slab)
          </li>
          <li>
            <strong>No TDS:</strong> Unlike FDs, debt mutual funds don't have TDS on redemption
          </li>
          <li>
            <strong>Short-term:</strong> If held &lt;3 years, gains are taxed as per your income tax slab
          </li>
        </ul>
      </div>

      {/* Eligibility */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Eligibility
        </h3>
        <ul className="space-y-2">
          {(debtMFInfo?.eligibility || []).map((item, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fund Categories Explained */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Fund Categories Explained
        </h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-medium mb-1">Liquid Funds (0-90 days)</p>
            <p className="text-xs">Highest liquidity, lowest risk, suitable for parking short-term funds</p>
          </div>
          <div>
            <p className="font-medium mb-1">Short-term Debt (1-3 years)</p>
            <p className="text-xs">Moderate risk, higher returns than liquid funds, suitable for 1-3 year goals</p>
          </div>
          <div>
            <p className="font-medium mb-1">Long-term Debt (3+ years)</p>
            <p className="text-xs">Higher returns, indexation benefit for tax efficiency, suitable for long-term goals</p>
          </div>
          <div>
            <p className="font-medium mb-1">Gilt Funds</p>
            <p className="text-xs">Invest in government securities only, lowest credit risk</p>
          </div>
          <div>
            <p className="font-medium mb-1">Corporate Bond Funds</p>
            <p className="text-xs">Invest in corporate bonds, higher returns than gilt funds, moderate credit risk</p>
          </div>
        </div>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {debtMFInfo?.minInvestment || '₹500 per month (SIP) or ₹1,000 (Lumpsum)'}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {debtMFInfo?.maxInvestment || 'No limit'}
        </p>
      </div>
    </div>
  )
}

export default DebtMutualFundCalculatorInfo

