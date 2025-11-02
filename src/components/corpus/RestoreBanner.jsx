import { isStorageAvailable } from '@/utils/corpusCalculatorStorage'

/**
 * Restore Banner Component
 * Displays a banner when previous session is detected
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the banner
 * @param {Function} props.onDismiss - Handler for dismiss button
 * @param {Function} props.onSaveAndStartFresh - Handler for save & start fresh button
 */
const RestoreBanner = ({ show, onDismiss, onSaveAndStartFresh }) => {
  if (!show) return null

  return (
    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Previous session detected
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Your previous calculation has been restored. You can continue where you left off or save and start fresh.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {isStorageAvailable() && (
            <button
              type="button"
              onClick={onSaveAndStartFresh}
              className="
                px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300
                bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50
                rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              💾 Save & Start Fresh
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            className="
              px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300
              hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
            title="Dismiss banner"
            aria-label="Close banner"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestoreBanner

