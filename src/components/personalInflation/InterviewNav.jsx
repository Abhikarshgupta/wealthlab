/**
 * Previous / next for the interview. Mirrors corpus button language.
 */
const InterviewNav = ({
  onPrevious,
  onNext,
  isValid,
  validationErrors = [],
  showPrevious = true,
  nextLabel = 'Continue',
}) => (
  <div className="mt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
    {showPrevious ? (
      <button
        type="button"
        onClick={onPrevious}
        className="px-5 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        ← Back
      </button>
    ) : (
      <span />
    )}
    <div className="relative group sm:ml-auto">
      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className="
          w-full sm:w-auto px-6 py-3 rounded-lg font-semibold bg-green-500 text-white
          hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600
          disabled:cursor-not-allowed transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        "
      >
        {nextLabel}
      </button>
      {!isValid && validationErrors.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 sm:text-right">
          {validationErrors[0]}
        </p>
      )}
    </div>
  </div>
)

export default InterviewNav
