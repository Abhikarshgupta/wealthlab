import { useState } from 'react'

/**
 * Tax Education Panel Component
 * Explains tax approaches and their impact on different instruments
 * Expandable sections with detailed explanations and examples
 */
const TaxEducationPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedInstrument, setSelectedInstrument] = useState(null)

  const instruments = [
    { key: 'ppf', name: 'PPF' },
    { key: 'ssy', name: 'SSY' },
    { key: 'fd', name: 'FD' },
    { key: 'equity', name: 'Equity/Mutual Funds' },
    { key: 'elss', name: 'ELSS' },
    { key: 'nps', name: 'NPS' },
    { key: 'sgb', name: 'SGB' },
    { key: 'nsc', name: 'NSC' },
    { key: 'scss', name: 'SCSS' },
  ]

  const taxApproaches = [
    {
      id: 'withdrawal',
      title: 'Taxes on Withdrawal',
      what: 'Tax is calculated and paid only when you withdraw your corpus at maturity.',
      how: 'The entire corpus amount is considered, and tax is calculated based on the instrument type and applicable tax rules.',
      why: 'This is the most realistic scenario for most investors. For retirement planning, you typically withdraw the corpus at maturity, and tax is applied at that time.',
      when: 'Most suitable for: Equity investments, PPF, SSY, NPS, and other long-term investments where tax is deferred.',
      example: 'For equity investments, if you hold for more than 1 year, LTCG applies at 10% above ₹1L exemption when you sell.',
    },
    {
      id: 'accumulation',
      title: 'Taxes During Accumulation',
      what: 'Tax is calculated and paid annually during the investment period, reducing the compounding effect.',
      how: 'Interest or gains earned each year are taxed as per your income tax slab, and the remaining amount continues to compound.',
      why: 'Some instruments like FD and SCSS pay interest annually, which is taxable. This approach shows the realistic impact of annual tax payments.',
      when: 'Most suitable for: FD, NSC, SCSS, and other instruments where interest is taxable annually.',
      example: 'For FD, if you earn ₹50,000 interest per year and you\'re in the 30% tax bracket, you pay ₹15,000 tax annually, leaving ₹35,000 to compound.',
    },
    {
      id: 'comparison',
      title: 'Show Both (Comparison)',
      what: 'Calculate and display both scenarios side-by-side to understand the tax impact difference.',
      how: 'The calculator shows both withdrawal and accumulation tax scenarios, allowing you to compare the final post-tax corpus.',
      why: 'This helps you understand which approach is more beneficial for your specific situation and investment mix.',
      when: 'Useful when: You want to understand the tax impact difference or when planning for multiple instruments.',
      example: 'For a ₹10L FD at 7% for 10 years: Withdrawal tax might show ₹2.1L tax, while accumulation tax shows ₹3.5L total tax paid over 10 years.',
    },
  ]

  const instrumentTaxDetails = {
    ppf: {
      withdrawal: 'Tax-free (EEE - Exempt, Exempt, Exempt). No tax on contribution, interest, or withdrawal.',
      accumulation: 'Not applicable - PPF is tax-free throughout.',
      realistic: 'Withdrawal approach is most realistic since PPF is tax-free at all stages.',
      impact: 'PPF provides complete tax exemption, making it highly tax-efficient for long-term savings.',
    },
    ssy: {
      withdrawal: 'Tax-free (EEE - Exempt, Exempt, Exempt). No tax on contribution, interest, or withdrawal.',
      accumulation: 'Not applicable - SSY is tax-free throughout.',
      realistic: 'Withdrawal approach is most realistic since SSY is tax-free at all stages.',
      impact: 'SSY provides complete tax exemption, making it ideal for girl child education planning.',
    },
    fd: {
      withdrawal: 'Interest is taxable as per income tax slab when withdrawn. TDS applicable if interest > ₹40,000 (₹50,000 for senior citizens).',
      accumulation: 'Interest is taxed annually as per income tax slab. TDS deducted if applicable. This reduces compounding effect.',
      realistic: 'Accumulation approach is more realistic for FD since interest is taxable annually.',
      impact: 'Annual tax on FD interest reduces effective returns. For a 30% tax bracket, a 7% FD effectively yields ~4.9% after tax.',
    },
    equity: {
      withdrawal: 'LTCG: 10% above ₹1L exemption (held > 1 year). STCG: 15% (held < 1 year).',
      accumulation: 'Not applicable - Equity gains are taxed only on sale/withdrawal.',
      realistic: 'Withdrawal approach is most realistic since equity gains are taxed only when you sell.',
      impact: 'Equity investments benefit from tax deferral. LTCG tax is lower than income tax slab, making it tax-efficient.',
    },
    elss: {
      withdrawal: 'LTCG: 10% above ₹1L exemption (held > 3 years). STCG: 15% (held < 3 years). ELSS has 3-year lock-in.',
      accumulation: 'Not applicable - ELSS gains are taxed only on withdrawal after lock-in period.',
      realistic: 'Withdrawal approach is most realistic since ELSS gains are taxed only when you sell after 3-year lock-in.',
      impact: 'ELSS combines tax-saving (80C deduction) with tax-efficient growth. Post 3-year lock-in, gains are taxed at favorable LTCG rates.',
    },
    nps: {
      withdrawal: '60% of corpus is tax-free, 40% is taxable as per income tax slab. Annuity payments are taxable.',
      accumulation: 'Not applicable - NPS contributions qualify for 80C deduction, but withdrawals are taxed at maturity.',
      realistic: 'Withdrawal approach is most realistic since NPS tax is applied at withdrawal.',
      impact: 'NPS provides partial tax exemption. 60% tax-free portion is significant, but 40% taxable portion reduces overall tax benefit.',
    },
    sgb: {
      withdrawal: 'Capital gains exempt if held till maturity (5/8 years). Interest (2.5%) is taxable annually.',
      accumulation: 'Interest (2.5%) is taxed annually as per income tax slab. Capital gains exempt if held till maturity.',
      realistic: 'Hybrid approach: Interest taxed annually, capital gains exempt at maturity. Accumulation approach shows annual interest tax.',
      impact: 'SGB provides tax-free capital gains if held till maturity, making it tax-efficient for gold investments.',
    },
    nsc: {
      withdrawal: 'Interest is taxable as per income tax slab at maturity. Qualifies for 80C deduction on reinvested interest.',
      accumulation: 'Interest is taxable annually, but reinvested interest qualifies for 80C deduction.',
      realistic: 'Accumulation approach is more realistic since NSC interest is taxable, though reinvested qualifies for 80C.',
      impact: 'NSC provides 80C deduction, but interest is taxable. Reinvested interest also qualifies for deduction, providing double benefit.',
    },
    scss: {
      withdrawal: 'Interest is taxable quarterly as per income tax slab.',
      accumulation: 'Interest is taxed quarterly as per income tax slab. This reduces effective returns.',
      realistic: 'Accumulation approach is most realistic since SCSS pays quarterly interest which is taxable.',
      impact: 'SCSS quarterly interest payments are convenient but taxable, reducing effective returns for high tax bracket investors.',
    },
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setSelectedInstrument(null)
    }
  }

  const handleInstrumentSelect = (instrumentKey) => {
    setSelectedInstrument(selectedInstrument === instrumentKey ? null : instrumentKey)
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        className="
          w-full px-4 py-3 flex items-center justify-between
          bg-gray-50 dark:bg-gray-800/50
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        "
        aria-expanded={isExpanded}
        aria-controls="tax-education-content"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Tax Education & Impact
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Learn about tax approaches and their impact on different instruments
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div id="tax-education-content" className="p-4 bg-white dark:bg-gray-900 space-y-6">
          {/* Tax Approaches */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Understanding Tax Approaches
            </h4>
            <div className="space-y-4">
              {taxApproaches.map((approach) => (
                <div
                  key={approach.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {approach.title}
                  </h5>
                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">What:</strong>{' '}
                      {approach.what}
                    </div>
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">How:</strong>{' '}
                      {approach.how}
                    </div>
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">Why:</strong>{' '}
                      {approach.why}
                    </div>
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">When:</strong>{' '}
                      {approach.when}
                    </div>
                    <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                      <strong className="text-gray-700 dark:text-gray-300">Example:</strong>{' '}
                      {approach.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instrument-Specific Tax Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Tax Rules by Instrument
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Click on an instrument to see detailed tax implications:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {instruments.map((instrument) => {
                const isSelected = selectedInstrument === instrument.key

                return (
                  <button
                    key={instrument.key}
                    type="button"
                    onClick={() => handleInstrumentSelect(instrument.key)}
                    className={`
                      px-3 py-2 text-xs font-medium rounded-lg transition-colors
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                      ${
                        isSelected
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-2 border-green-500 dark:border-green-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-600'
                      }
                    `}
                  >
                    {instrument.name}
                  </button>
                )
              })}
            </div>

            {/* Selected Instrument Details */}
            {selectedInstrument && instrumentTaxDetails[selectedInstrument] && (
              <div className="p-4 rounded-lg border-2 border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {instruments.find((inst) => inst.key === selectedInstrument)?.name} Tax Details
                </h5>
                <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
                  <div>
                    <strong className="text-gray-900 dark:text-white">Withdrawal Approach:</strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {instrumentTaxDetails[selectedInstrument].withdrawal}
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Accumulation Approach:</strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {instrumentTaxDetails[selectedInstrument].accumulation}
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Most Realistic:</strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {instrumentTaxDetails[selectedInstrument].realistic}
                    </p>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    <strong className="text-gray-900 dark:text-white">Impact on Corpus:</strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {instrumentTaxDetails[selectedInstrument].impact}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* General Note */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-xs text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> Tax rules are based on Indian tax laws (FY 2024-25). Tax
                rates and exemptions may change. Always consult a tax advisor for personalized tax
                planning. The calculations shown are estimates and may vary based on your specific
                tax situation.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaxEducationPanel

