import { investmentInfo } from '@/constants/investmentInfo'
import { investmentRates } from '@/constants/investmentRates'
import { formatPercentageValue } from '@/utils/formatters'

/**
 * NPS Calculator Information Panel
 * Displays comprehensive information about NPS including asset allocation rules, tax benefits, and official references
 * 
 * References:
 * - PFRDA Official Website: https://www.pfrda.org.in
 * - NPS Scheme Information: https://enps.nsdl.com/eNPS/getSchemeInfo.html
 * - Investment Guidelines: PFRDA Investment Guidelines
 */
const NPSCalculatorInfo = () => {
  const npsInfo = investmentInfo.nps
  const npsRates = investmentRates.nps

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About NPS (National Pension System)
      </h2>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {npsInfo.description}
        </p>
      </div>

      {/* Expected Returns */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
          Expected Returns (Market-linked)
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-green-800 dark:text-green-300">Equity:</span>
            <span className="font-bold text-green-900 dark:text-green-100">
              {formatPercentageValue(npsRates.equity)} p.a.
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-800 dark:text-green-300">Corporate Bonds:</span>
            <span className="font-bold text-green-900 dark:text-green-100">
              {formatPercentageValue(npsRates.corporateBonds)} p.a.
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-800 dark:text-green-300">Government Bonds:</span>
            <span className="font-bold text-green-900 dark:text-green-100">
              {formatPercentageValue(npsRates.debt || 8)} p.a.
            </span>
          </div>
        </div>
        <p className="text-sm text-green-700 dark:text-green-400 mt-3">
          <strong>Note:</strong> Returns are market-linked and vary based on fund performance. 
          Historical returns are provided for reference only.
        </p>
        <p className="text-xs text-green-700 dark:text-green-400 mt-2">
          Last updated: {new Date(npsRates.lastUpdated).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Asset Allocation Rules */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          Asset Allocation Rules (Updated October 1, 2025)
        </h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <div>
            <strong>Equity (E):</strong> 
            <ul className="list-disc list-inside ml-2 mt-1">
              <li>Age ≤35: Up to <strong>100%</strong> equity allowed (NEW!)</li>
              <li>Age 36-50: Decreases by 2.5% annually (starts at 97.5% at age 36, reaches 75% at age 50)</li>
              <li>Age 51-60: Continues decreasing by 2.5% annually (reaches 50% at age 60)</li>
              <li>Age 60+: Maximum 50% equity</li>
            </ul>
          </div>
          <div>
            <strong>Corporate Bonds (C):</strong> Up to 100%
          </div>
          <div>
            <strong>Government Bonds (G):</strong> Up to 100%
          </div>
          <div>
            <strong>Alternative Investments (A):</strong> Up to 5% (CMBS, MBS, REITs, AIFs, InvITs)
          </div>
          <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
            <strong>Total Allocation:</strong> Must equal 100%
          </div>
        </div>
        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <p className="text-xs text-green-800 dark:text-green-300">
            ✅ <strong>New Rule Effective October 1, 2025:</strong> Subscribers up to age 35 can now allocate up to 100% of their contributions to equity, providing greater growth potential for younger investors.
          </p>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">
          <a 
            href="https://enps.nsdl.com/eNPS/getSchemeInfo.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-blue-900 dark:hover:text-blue-200"
          >
            Reference: PFRDA Investment Guidelines (Updated October 2025)
          </a>
        </p>
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {npsInfo.features.map((feature, index) => (
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
          {npsInfo.taxBenefits.map((benefit, index) => (
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
          {npsInfo.eligibility.map((item, index) => (
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
          {npsInfo.lockInPeriod}
        </p>
      </div>

      {/* Investment Limits */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Investment Limits
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Minimum:</span> {npsInfo.minInvestment}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Maximum:</span> {npsInfo.maxInvestment}
        </p>
      </div>

      {/* Calculation Methodology */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-3">
          How We Calculate
        </h3>
        <div className="space-y-2 text-sm text-indigo-800 dark:text-indigo-300">
          <p>
            <strong>Weighted Return:</strong> Calculated based on asset allocation percentages and expected returns per asset class.
          </p>
          <p>
            <strong>Formula:</strong> Weighted Return = (Equity% × Equity Return) + (Corporate Bonds% × Corporate Bonds Return) + (Government Bonds% × Government Bonds Return) + (Alternative% × Alternative Return)
          </p>
          <p>
            <strong>Future Value:</strong> Uses SIP formula with weighted average return: 
            FV = Monthly Contribution × [(1 + weightedMonthlyRate)^months - 1] / weightedMonthlyRate × (1 + weightedMonthlyRate)
          </p>
          <p>
            <strong>Age-based Caps:</strong> When enabled, equity allocation automatically adjusts based on age as per PFRDA regulations (Updated October 1, 2025). 
            Age ≤35: 100% equity allowed. Age 36-50: Decreases by 2.5% annually. Age 51-60: Continues decreasing, reaching 50% at age 60+.
          </p>
        </div>
      </div>

      {/* Official References */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
          Official References
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a 
              href="https://www.pfrda.org.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
            >
              PFRDA Official Website
            </a>
          </li>
          <li>
            <a 
              href="https://enps.nsdl.com/eNPS/getSchemeInfo.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
            >
              NPS Scheme Information (NSDL)
            </a>
          </li>
          <li>
            <a 
              href="https://www.pfrda.org.in/index.php?lang=en&id=250" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
            >
              PFRDA Investment Guidelines
            </a>
          </li>
          <li>
            <a 
              href="https://www.business-standard.com/finance/personal-finance/nps-gets-major-overhaul-100-equity-option-shorter-lock-ins-more-choice-125100300076_1.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200"
            >
              NPS New Rules (October 1, 2025) - Business Standard
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NPSCalculatorInfo

