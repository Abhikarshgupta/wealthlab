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
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>PPF Calculator</li>
              <li>FD Calculator</li>
              <li>SIP Calculator</li>
              <li>NPS Calculator</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Goal Planning</li>
              <li>Corpus Simulator</li>
              <li>Investment Guides</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Disclaimer</li>
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