import { Link } from 'react-router-dom'
import { routes } from '@/routes/routes'

/**
 * Privacy Policy Page
 * Displays privacy policy information for WealthLab
 */
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last Updated: January 2025
          </p>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                1. Introduction
              </h2>
              <p>
                Welcome to WealthLab ("we," "our," or "us"). We are committed to protecting your
                privacy and ensuring the security of your personal information. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use
                our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                2.1 Personal Information
              </h3>
              <p>
                WealthLab is designed with privacy in mind. We do not collect personal information
                such as your name, email address, phone number, or financial details unless you
                explicitly provide it to us.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                2.2 Usage Data
              </h3>
              <p>
                We may collect anonymous usage data including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>IP address (anonymized)</li>
                <li>Operating system</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                2.3 Local Storage
              </h3>
              <p>
                WealthLab stores your calculation data locally in your browser's localStorage. This
                includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Saved calculations and simulations</li>
                <li>User preferences (theme, default settings)</li>
                <li>Session data</li>
              </ul>
              <p>
                This data never leaves your device and is not transmitted to our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our calculator services</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Ensure website security and prevent fraud</li>
                <li>Maintain your preferences and settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                4. Data Storage and Security
              </h2>
              <p>
                WealthLab operates primarily as a client-side application. All calculation data and
                preferences are stored locally in your browser's localStorage. We do not maintain
                centralized servers that store your personal financial data.
              </p>
              <p>
                We implement appropriate technical and organizational security measures to protect
                your information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>HTTPS encryption for all data transmission</li>
                <li>Local storage encryption where applicable</li>
                <li>Regular security audits and updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                5. Third-Party Services
              </h2>
              <p>
                We may use third-party services for analytics and website functionality. These
                services may collect anonymous usage data. We do not share your personal financial
                information with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                6. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your local data stored in your browser</li>
                <li>Delete your local data at any time by clearing browser storage</li>
                <li>Opt out of analytics tracking</li>
                <li>Request information about data we may have collected</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                7. Cookies and Tracking
              </h2>
              <p>
                We may use cookies and similar tracking technologies to enhance your experience.
                You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                8. Children's Privacy
              </h2>
              <p>
                WealthLab is not intended for users under the age of 18. We do not knowingly
                collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                9. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new Privacy Policy on this page and updating the "Last
                Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                10. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our
                website.
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

export default PrivacyPolicy

