import { Link } from 'react-router-dom'
import { routes } from '@/routes/routes'

/**
 * Terms of Service Page
 * Displays terms of service for WealthLab
 */
const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last Updated: January 2025
          </p>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using WealthLab ("the Service"), you accept and agree to be bound
                by the terms and provision of this agreement. If you do not agree to abide by the
                above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily access WealthLab for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of title,
                and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained on WealthLab</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                3. Disclaimer
              </h2>
              <p>
                The materials on WealthLab are provided on an 'as is' basis. WealthLab makes no
                warranties, expressed or implied, and hereby disclaims and negates all other
                warranties including without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
              <p className="mt-4">
                <strong className="text-gray-900 dark:text-white">
                  Financial Disclaimer:
                </strong> WealthLab provides financial calculators and educational tools for
                informational purposes only. The calculations and projections are estimates and
                should not be considered as financial advice. Always consult with a qualified
                financial advisor before making investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                4. Limitations
              </h2>
              <p>
                In no event shall WealthLab or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business
                interruption) arising out of the use or inability to use the materials on
                WealthLab, even if WealthLab or a WealthLab authorized representative has been
                notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                5. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on WealthLab could include technical, typographical, or
                photographic errors. WealthLab does not warrant that any of the materials on its
                website are accurate, complete, or current. WealthLab may make changes to the
                materials contained on its website at any time without notice.
              </p>
              <p className="mt-4">
                <strong className="text-gray-900 dark:text-white">Note:</strong> Tax rates,
                interest rates, and financial regulations are subject to change. While we strive to
                keep our calculators up-to-date, users should verify current rates and regulations
                independently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                6. Links
              </h2>
              <p>
                WealthLab has not reviewed all of the sites linked to its website and is not
                responsible for the contents of any such linked site. The inclusion of any link does
                not imply endorsement by WealthLab of the site. Use of any such linked website is
                at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                7. Modifications
              </h2>
              <p>
                WealthLab may revise these terms of service for its website at any time without
                notice. By using this website you are agreeing to be bound by the then current
                version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                8. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the
                laws of India and you irrevocably submit to the exclusive jurisdiction of the
                courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                9. User Responsibilities
              </h2>
              <p>Users agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to harm or disrupt the Service</li>
                <li>Provide accurate information when using calculators</li>
                <li>Understand that results are estimates, not guarantees</li>
                <li>Consult qualified professionals for financial advice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                10. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through
                our website.
              </p>
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

export default TermsOfService

