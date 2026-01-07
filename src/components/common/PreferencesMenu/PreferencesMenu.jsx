import { useState, useEffect } from 'react'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import { useTheme } from '@/contexts/ThemeContext'
import TaxSlabSelector from '@/components/common/TaxSlabSelector/TaxSlabSelector'
import InflationToggle from '@/components/common/InflationToggle/InflationToggle'

/**
 * PreferencesMenu Component
 * Consolidated menu for Tax Slab, Inflation, and Theme controls
 * Mobile/Tablet: Single menu button with badge
 * Desktop: Individual controls (handled in Header)
 */
const PreferencesMenu = () => {
  const { incomeTaxSlab, adjustInflation, defaultInflationRate } = useUserPreferencesStore()
  const { theme, toggleTheme } = useTheme()
  const [showMenu, setShowMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
    }
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  // Calculate badge count (non-default preferences)
  const getBadgeCount = () => {
    let count = 0
    if (incomeTaxSlab !== 0.30) count++ // Default is 30%
    if (adjustInflation) {
      count++ // Inflation is ON (default is OFF)
      if (defaultInflationRate !== 6) {
        // If rate is also non-default, don't count separately (already counted inflation ON)
        // This keeps badge count simpler: max 2 (tax + inflation)
      }
    }
    return count
  }

  // Determine badge color based on active preferences
  const getBadgeColor = () => {
    if (adjustInflation) return 'bg-green-500' // Green for inflation ON
    if (incomeTaxSlab !== 0.30) return 'bg-blue-500' // Blue for tax slab
    return 'bg-gray-400' // Gray for defaults
  }

  const badgeCount = getBadgeCount()
  const badgeColor = getBadgeColor()

  // Only show menu on mobile/tablet
  const shouldShowMenu = isMobile || isTablet

  if (!shouldShowMenu) {
    // Desktop: Return null, controls handled separately in Header
    return null
  }

  return (
    <>
      <div className="relative">
        {/* Preferences Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Preferences"
          aria-expanded={showMenu}
        >
          {/* Icon Container (for badge positioning) */}
          <div className="relative">
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {/* Badge */}
            {badgeCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 ${badgeColor} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}
              >
                {badgeCount}
              </span>
            )}
          </div>

          {/* Label */}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline-block">
            Preferences
          </span>
        </button>

        {/* Menu Dropdown */}
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
              aria-hidden="true"
            />
            {/* Menu Content */}
            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-[55] min-w-[280px]">
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Preferences
              </div>

              <div className="space-y-4">
                {/* Tax Slab Section */}
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Tax Slab
                  </label>
                  <div onClick={(e) => e.stopPropagation()}>
                    <TaxSlabSelector />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Inflation Section */}
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Inflation Adjustment
                  </label>
                  <div onClick={(e) => e.stopPropagation()}>
                    <InflationToggle />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Theme Section */}
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Theme
                  </label>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Toggle theme"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    {theme === 'light' ? (
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PreferencesMenu

