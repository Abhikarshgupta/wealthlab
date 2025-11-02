import { Link } from 'react-router-dom'
import { routes } from '@/routes/routes'

/**
 * Footer Component
 * Displays footer with functional links and upcoming badges
 */
const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive wealth management calculators for Indian retail investors.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={routes.calculators.ppf}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  PPF Calculator
                </Link>
              </li>
              <li>
                <Link
                  to={routes.calculators.fd}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  FD Calculator
                </Link>
              </li>
              <li>
                <Link
                  to={routes.calculators.sip}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  SIP Calculator
                </Link>
              </li>
              <li>
                <Link
                  to={routes.calculators.nps}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  NPS Calculator
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={routes.goalPlanning}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors inline-flex items-center gap-2"
                >
                  Goal Planning
                  <span className="px-1.5 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded">
                    Coming Soon
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={routes.corpusCalculator}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  Corpus Simulator
                </Link>
              </li>
              <li className="text-gray-400 dark:text-gray-500 inline-flex items-center gap-2">
                Investment Guides
                <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  Upcoming
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={routes.legal.privacy}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to={routes.legal.terms}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to={routes.legal.disclaimer}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 WealthLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
