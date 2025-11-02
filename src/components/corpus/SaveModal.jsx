/**
 * Save Modal Component
 * Modal for saving current calculation and starting fresh
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the modal
 * @param {string} props.calculationName - Current calculation name input value
 * @param {Function} props.onNameChange - Handler for name input change
 * @param {Function} props.onSave - Handler for save button
 * @param {Function} props.onCancel - Handler for cancel button
 */
const SaveModal = ({ show, calculationName, onNameChange, onSave, onCancel }) => {
  if (!show) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="
            bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full
            border border-gray-200 dark:border-gray-700
          "
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Save Current Session
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Save your current calculation with a name, then start fresh. You can load it later from Saved Calculations.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Calculation Name
              </label>
              <input
                type="text"
                value={calculationName}
                onChange={(e) => onNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onSave()
                  } else if (e.key === 'Escape') {
                    e.preventDefault()
                    onCancel()
                  }
                }}
                placeholder="e.g., Retirement Plan 2025"
                className="
                  w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="
                  px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg
                  hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors
                "
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={!calculationName.trim()}
                className="
                  px-4 py-2 bg-green-500 text-white rounded-lg font-semibold
                  hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                Save & Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SaveModal

