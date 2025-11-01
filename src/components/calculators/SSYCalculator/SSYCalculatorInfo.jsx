import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * SSY Calculator Information Panel
 * Displays comprehensive information about SSY including government notifications, official links, features, tax benefits, and eligibility
 * 
 * Government References:
 * - Ministry of Finance Notification: Sukanya Samriddhi Yojana Rules, 2019
 * - India Post Official Website: https://www.indiapost.gov.in
 * - Department of Posts SSY Page: https://www.indiapost.gov.in/Financial/pages/content/sukanya-samriddhi-account.aspx
 * - RBI Notification: Various circulars on SSY interest rates
 */
const SSYCalculatorInfo = () => {
  const ssyInfo = investmentInfo.ssy
  const ssyRates = investmentRates.ssy

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About SSY (Sukanya Samriddhi Yojana)
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {ssyInfo.description}
        </p>
      </div>

      {/* Current Rate */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
          Current Interest Rate
        </h3>
        <p className="text-green-800 dark:text-green-300">
          <span className="font-bold text-xl">
            {formatPercentageValue(ssyRates.rate)}
          </span>
          {' '}per annum (compounded annually)
        </p>
        <p className="text-sm text-green-700 dark:text-green-400 mt-2">
          Last updated: {new Date(ssyRates.lastUpdated).toLocaleDateString('en-IN', {
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
          {ssyInfo.features.map((feature, index) => (
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
          {ssyInfo.taxBenefits.map((benefit, index) => (
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
          {ssyInfo.eligibility.map((item, index) => (
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
          {ssyInfo.lockInPeriod}
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {ssyInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {ssyInfo.maxInvestment}
        </p>
      </div>

      {/* Account Opening and Operations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          Account Opening and Operations (As per Government Rules)
        </h3>
        
        {/* Account Opening */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Account Opening
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Account can be opened by parents or legal guardians of a girl child below 10 years of age.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Only one account per girl child and maximum two accounts per parent/guardian (one for each girl child).</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Account can be opened at any authorized bank or post office.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Required documents: Birth certificate of girl child, identity and address proof of parent/guardian, and passport size photographs.</span>
            </li>
          </ul>
        </div>

        {/* Deposits */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Deposits
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Minimum deposit: ₹250 per financial year</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Maximum deposit: ₹1.5 lakh per financial year</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Deposits can be made in multiples of ₹100</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Minimum one deposit per financial year is mandatory</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Deposits can be made in cash, cheque, or online transfer</span>
            </li>
          </ul>
        </div>

        {/* Partial Withdrawal */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Partial Withdrawal
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Eligibility:</strong> Allowed after the girl child attains the age of 18 years or after completion of 10 years from the date of account opening, whichever is earlier.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Purpose:</strong> Only for higher education or marriage expenses of the girl child</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Maximum Amount:</strong> Up to 50% of the balance at the end of the preceding financial year</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Frequency:</strong> One withdrawal per financial year</span>
            </li>
          </ul>
        </div>

        {/* Maturity and Closure */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Maturity and Closure
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Maturity:</strong> Account matures when the girl child attains the age of 21 years</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Premature Closure:</strong> Allowed after the girl child attains the age of 18 years for marriage purposes (with required documentation)</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Transfer:</strong> Account can be transferred from one bank/post office to another</span>
            </li>
          </ul>
        </div>

        {/* Interest Rate Revision */}
        <div>
          <h4 className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Interest Rate
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Interest rate is reviewed and notified by the Government of India on a quarterly basis</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Interest is compounded annually and credited to the account at the end of each financial year</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Interest rate is linked to Government Security (G-Sec) rates with additional spread</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Government Notifications and Official Links */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
          Government Notifications & Official References
        </h3>
        
        {/* Primary Legislation */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            Primary Legislation & Rules
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="https://www.finmin.nic.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                Ministry of Finance - Sukanya Samriddhi Yojana Rules, 2019
              </a>
              <span className="text-yellow-700 dark:text-yellow-400 ml-2">(Notification G.S.R. 863(E) dated 02.12.2014)</span>
            </li>
            <li>
              <a 
                href="https://www.finmin.nic.in/notification/ssy-rules-2019" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                SSY Account Rules, 2019 (Latest Amendment)
              </a>
            </li>
          </ul>
        </div>

        {/* Official Websites */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            Official Websites
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="https://www.indiapost.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                India Post Official Website
              </a>
            </li>
            <li>
              <a 
                href="https://www.indiapost.gov.in/Financial/pages/content/sukanya-samriddhi-account.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                Department of Posts - SSY Account Information
              </a>
            </li>
            <li>
              <a 
                href="https://www.finmin.nic.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                Ministry of Finance - Small Savings Schemes
              </a>
            </li>
          </ul>
        </div>

        {/* Interest Rate Notifications */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            Interest Rate Notifications
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="https://www.finmin.nic.in/notification/ssy-interest-rates" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                Current SSY Interest Rate Notification (Ministry of Finance)
              </a>
            </li>
            <li>
              <a 
                href="https://www.rbi.org.in/Scripts/BS_ViewNotification.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                RBI Notifications on Small Savings Schemes
              </a>
            </li>
          </ul>
        </div>

        {/* Tax Benefits */}
        <div>
          <h4 className="text-base font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            Tax Benefits & Income Tax Rules
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="https://www.incometax.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                Income Tax Department - Section 80C Deduction
              </a>
            </li>
            <li>
              <a 
                href="https://www.incometax.gov.in/iec/foportal/help/assistant/return-filing/online-return-filing/return-filing-2022-23/section-80c" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
              >
                Section 80C - Tax Deduction Details
              </a>
            </li>
            <li className="text-yellow-700 dark:text-yellow-400">
              <strong>EEE Status:</strong> SSY enjoys Exempt-Exempt-Exempt (EEE) tax status:
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Investment eligible for deduction under Section 80C</li>
                <li>• Interest earned is tax-free</li>
                <li>• Maturity amount is completely tax-free</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Important Note */}
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 rounded">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Important:</strong> The rules, regulations, and interest rates governing SSY accounts are subject to change as per Government of India notifications. 
            It is advisable to refer to the latest notifications from the Ministry of Finance or consult with authorized banks/post offices for the most current information. 
            All calculations provided are estimates based on current rates and rules.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SSYCalculatorInfo

