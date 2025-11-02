/**
 * Step Navigation Buttons Component
 * Reusable navigation buttons with validation tooltip
 * @param {Object} props
 * @param {Function} props.onPrevious - Handler for previous button
 * @param {Function} props.onNext - Handler for next button
 * @param {boolean} props.isValid - Whether current step is valid
 * @param {string[]} props.validationErrors - Array of validation error messages
 * @param {boolean} props.showPrevious - Whether to show previous button
 * @param {string} props.nextLabel - Label for next button (default: "Next →")
 */
const StepNavigationButtons = ({
  onPrevious,
  onNext,
  isValid,
  validationErrors = [],
  showPrevious = true,
  nextLabel = 'Next →',
}) => {
  return (
    <div className="mt-6 flex justify-between">
      {showPrevious && (
        <button
          type="button"
          onClick={onPrevious}
          className="
            px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold
            hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
          "
        >
          ← Previous
        </button>
      )}
      <div className={`relative group ${showPrevious ? '' : 'ml-auto'}`}>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="
            px-6 py-3 bg-green-500 text-white rounded-lg font-semibold
            hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          "
        >
          {nextLabel}
        </button>
        {!isValid && validationErrors.length > 0 && (
          <div
            className="
              absolute bottom-full right-0 mb-2 w-80 p-3 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg shadow-xl z-50
              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
              border border-gray-700 dark:border-gray-600
            "
          >
            <div className="font-semibold mb-2">Missing Required Fields:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-xs">{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default StepNavigationButtons

