import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * POMIS Calculator Information Panel
 * Displays information about POMIS investments including expected returns, features, tax implications, and withdrawal rules
 */
const POMISCalculatorInfo = () => {
  const pomisInfo = investmentInfo.pomis
  const pomisRates = investmentRates.pomis

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About POMIS (Post Office Monthly Income Scheme)
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {pomisInfo.description}
        </p>
      </div>

      {/* Current Rate */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Current Interest Rate
        </h3>
        <p className="text-green-800 dark:text-green-300">
          <span className="font-bold text-xl">
            {formatPercentageValue(pomisRates.rate)}
          </span>
          {' '}per annum (paid monthly)
        </p>
        <p className="text-sm text-green-700 dark:text-green-400 mt-2">
          Last updated: {new Date(pomisRates.lastUpdated).toLocaleDateString('en-IN', {
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
          {pomisInfo.features.map((feature, index) => (
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
          {pomisInfo.taxBenefits.map((benefit, index) => (
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
          {pomisInfo.eligibility.map((item, index) => (
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
          {pomisInfo.lockInPeriod}
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {pomisInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {pomisInfo.maxInvestment}
        </p>
      </div>

      {/* Premature Withdrawal Rules */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-3">
          Premature Withdrawal Rules
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              1. Withdrawal Before 1 Year:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-2">
              <li>2% of deposit amount is deducted as penalty</li>
              <li>No interest is payable</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              2. Withdrawal After 1 Year but Before 5 Years:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-2">
              <li>1% of deposit amount is deducted as penalty</li>
              <li>Accrued interest (minus penalty) is paid</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              3. Death of Account Holder:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-2">
              <li>Nominee or legal heir can close the account without any penalty</li>
              <li>Principal amount along with accrued interest is paid</li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-700">
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              Important Notes:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-2">
              <li><strong>No Partial Withdrawals:</strong> POMIS does not permit partial withdrawals. Premature withdrawal entails closure of the entire account.</li>
              <li><strong>TDS on Interest:</strong> If total interest earned in a financial year exceeds ₹40,000, TDS is applicable. Submit Form 15G/15H to avoid TDS if total income is below taxable limit.</li>
              <li><strong>No Tax Deduction:</strong> Unlike PPF/NSC, POMIS does not qualify for Section 80C deduction.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default POMISCalculatorInfo

