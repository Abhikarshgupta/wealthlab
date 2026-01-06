import { useState, useEffect } from 'react'
import useUserPreferencesStore from '@/store/userPreferencesStore'
import InflationOverlay from './InflationOverlay'
import NotificationToast from './NotificationToast'

/**
 * InflationToggle Component
 * Global inflation adjustment toggle for header
 * Shows icon, badge with rate, and handles progressive disclosure
 */
const InflationToggle = () => {
  const {
    adjustInflation,
    defaultInflationRate,
    inflationToggleClicks,
    inflationOverlayDismissed,
    lastInflationRateChange,
    setAdjustInflation,
  } = useUserPreferencesStore()

  const [showOverlay, setShowOverlay] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showRatePopover, setShowRatePopover] = useState(false)

  // Determine what to show based on usage
  const shouldShowOverlay = () => {
    if (inflationOverlayDismissed) return false
    if (inflationToggleClicks === 0) return true
    if (inflationToggleClicks <= 2) return true
    return false
  }

  const shouldShowNotification = () => {
    if (inflationOverlayDismissed) return false
    if (inflationToggleClicks >= 3 && inflationToggleClicks <= 4) return true
    return false
  }

  const handleToggle = (enabled) => {
    setAdjustInflation(enabled)

    // Close popover if toggle is turned OFF
    if (!enabled && showRatePopover) {
      setShowRatePopover(false)
    }

    // Show overlay for first 2 clicks
    if (shouldShowOverlay() && !inflationOverlayDismissed) {
      setShowOverlay(true)
    }
    // Show notification for clicks 3-4
    else if (shouldShowNotification()) {
      setShowNotification(true)
    }
  }

  const handleRateClick = (e) => {
    e.stopPropagation()
    setShowRatePopover(!showRatePopover)
  }

  // Show notification when rate changes
  useEffect(() => {
    if (lastInflationRateChange && adjustInflation) {
      const timeSinceChange = Date.now() - lastInflationRateChange
      // Show notification if rate changed in last 2 seconds
      if (timeSinceChange < 2000) {
        setShowNotification(true)
      }
    }
  }, [lastInflationRateChange, adjustInflation])

  return (
    <>
      <div className="relative flex items-center gap-2">
        {/* Toggle Container */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {/* Icon */}
              <svg
                className={`w-5 h-5 transition-colors ${
                  adjustInflation
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              {/* Rate Badge (shown when ON) */}
              {adjustInflation && (
                <button
                  onClick={handleRateClick}
                  className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  title="Click to change inflation rate"
                >
                  {defaultInflationRate}%
                </button>
              )}

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={adjustInflation}
                onClick={() => handleToggle(!adjustInflation)}
                aria-label={
                  adjustInflation
                    ? `Inflation adjustment: ON (${defaultInflationRate}%)`
                    : 'Inflation adjustment: OFF'
                }
                className={`
                  relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  ${adjustInflation ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                    ${adjustInflation ? 'translate-x-5' : 'translate-x-0.5'}
                  `}
                />
              </button>
            </div>

            {/* Tooltip on hover - positioned at bottom */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {adjustInflation
                ? `Inflation adjustment: ON (${defaultInflationRate}%)`
                : 'Inflation adjustment: OFF'}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0">
                <div className="border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Adjustment Popover */}
        {showRatePopover && (
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 min-w-[200px]">
            <RateAdjustmentPopover
              currentRate={defaultInflationRate}
              onClose={() => setShowRatePopover(false)}
            />
          </div>
        )}
      </div>

      {/* Overlay for first-time users */}
      {showOverlay && (
        <InflationOverlay
          onClose={() => {
            setShowOverlay(false)
          }}
        />
      )}

      {/* Notification Toast */}
      {showNotification && (
        <NotificationToast
          message={`Inflation adjustment: ${adjustInflation ? 'ON' : 'OFF'} | Rate: ${defaultInflationRate}%`}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  )
}

/**
 * Rate Adjustment Popover
 * Quick rate adjustment dropdown
 */
const RateAdjustmentPopover = ({ currentRate, onClose }) => {
  const { setDefaultInflationRate } = useUserPreferencesStore()
  const [customRate, setCustomRate] = useState(currentRate.toString())

  const presetRates = [4, 5, 6, 7, 8]

  const handlePresetClick = (rate) => {
    setDefaultInflationRate(rate)
    onClose()
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const rate = parseFloat(customRate)
    if (!isNaN(rate) && rate >= 0 && rate <= 20) {
      setDefaultInflationRate(rate)
      onClose()
    }
  }

  return (
    <div>
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Inflation Rate
      </div>
      <div className="space-y-2">
        {/* Preset Rates */}
        <div className="flex flex-wrap gap-2">
          {presetRates.map((rate) => (
            <button
              key={rate}
              onClick={() => handlePresetClick(rate)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentRate === rate
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {rate}%
            </button>
          ))}
        </div>

        {/* Custom Rate Input */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-3">
          <input
            type="number"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            min="0"
            max="20"
            step="0.1"
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Custom %"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  )
}

export default InflationToggle

