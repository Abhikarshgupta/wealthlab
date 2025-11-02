import { Link } from 'react-router-dom'
import { routes } from '@/routes/routes'

/**
 * Disclaimer Page
 * Displays disclaimer information for WealthLab
 */
const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Disclaimer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last Updated: January 2025
          </p>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-gray-900 dark:text-white font-semibold">
                  ⚠️ Important: This disclaimer applies to all calculators, tools, and content
                  provided by WealthLab.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                1. Not Financial Advice
              </h2>
              <p>
                WealthLab provides financial calculators, educational tools, and informational
                content for educational and illustrative purposes only. The calculations,
                projections, and recommendations provided are estimates and should not be considered
                as professional financial, investment, tax, or legal advice.
              </p>
              <p className="mt-4">
                <strong className="text-gray-900 dark:text-white">
                  Always consult with qualified professionals:
                </strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Certified Financial Planner (CFP) or Financial Advisor</li>
                <li>Chartered Accountant (CA) for tax matters</li>
                <li>Legal advisor for legal implications</li>
                <li>Investment advisors registered with SEBI (for India)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                2. Accuracy of Calculations
              </h2>
              <p>
                While we strive to ensure accuracy, WealthLab makes no warranties or representations
                regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The accuracy of calculations or projections</li>
                <li>The completeness of financial information</li>
                <li>The applicability of results to your specific situation</li>
                <li>The timeliness of tax rates, interest rates, and regulations</li>
              </ul>
              <p className="mt-4">
                Financial markets, tax laws, and regulations change frequently. Rates and rules
                used in our calculators are based on publicly available information and may not
                reflect the most current rates or regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                3. Tax Calculations
              </h2>
              <p>
                Tax calculations are estimates based on Indian tax laws (as of the date of
                calculation). Tax laws are complex and subject to change. Actual tax liability may
                vary based on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your specific tax bracket and income level</li>
                <li>Applicable deductions and exemptions</li>
                <li>Changes in tax laws between calculation and actual filing</li>
                <li>Your individual tax situation and filing status</li>
                <li>Regime selection (Old vs New Tax Regime)</li>
              </ul>
              <p className="mt-4">
                Always consult a Chartered Accountant (CA) or tax advisor for accurate tax planning
                and filing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                4. Investment Risks
              </h2>
              <p>
                All investments carry risk. Past performance does not guarantee future results.
                Projections and calculations assume certain rates of return, which may not be
                achieved. Actual returns may be higher or lower than projected.
              </p>
              <p className="mt-4">
                <strong className="text-gray-900 dark:text-white">Key Risks:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Market volatility and potential losses</li>
                <li>Inflation eroding purchasing power</li>
                <li>Interest rate fluctuations</li>
                <li>Tax law changes affecting returns</li>
                <li>Liquidity constraints</li>
                <li>Default risk (for debt instruments)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                5. No Guarantees
              </h2>
              <p>
                WealthLab does not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>That you will achieve projected returns</li>
                <li>That calculations will match actual results</li>
                <li>That recommendations are suitable for your situation</li>
                <li>The availability or accuracy of third-party information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                6. Limitations of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, WealthLab and its operators shall not be
                liable for any direct, indirect, incidental, special, consequential, or punitive
                damages resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use or inability to use the Service</li>
                <li>Decisions made based on calculations or recommendations</li>
                <li>Financial losses or damages</li>
                <li>Errors or omissions in calculations</li>
                <li>Technical issues or service interruptions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                7. Assumptions and Limitations
              </h2>
              <p>
                Calculators make various assumptions, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Constant interest rates and returns</li>
                <li>Regular contributions (where applicable)</li>
                <li>No withdrawals or early closures</li>
                <li>Current tax rates remaining constant</li>
                <li>Inflation rates as input by the user</li>
              </ul>
              <p className="mt-4">
                Real-world scenarios may differ significantly from these assumptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                8. Regulatory Compliance
              </h2>
              <p>
                WealthLab is an educational tool and is not registered as a financial advisor,
                investment advisor, or broker. We do not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide personalized investment advice</li>
                <li>Execute trades or transactions</li>
                <li>Recommend specific securities or investment products</li>
                <li>Act as a fiduciary</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                9. User Responsibility
              </h2>
              <p>
                You are solely responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verifying the accuracy of calculations</li>
                <li>Consulting qualified professionals before making financial decisions</li>
                <li>Understanding the risks associated with investments</li>
                <li>Compliance with applicable laws and regulations</li>
                <li>Your investment decisions and their consequences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                10. Acknowledgment
              </h2>
              <p>
                By using WealthLab, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have read and understood this disclaimer</li>
                <li>You understand that calculations are estimates only</li>
                <li>You will consult qualified professionals for financial advice</li>
                <li>You assume all risks associated with your financial decisions</li>
                <li>WealthLab is not liable for any losses or damages</li>
              </ul>
            </section>

            <section>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mt-6">
                <p className="text-gray-900 dark:text-white">
                  <strong>Remember:</strong> This tool is designed to help you understand financial
                  concepts and estimate potential outcomes. It is not a substitute for professional
                  financial advice tailored to your specific situation.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to={routes.home}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer

