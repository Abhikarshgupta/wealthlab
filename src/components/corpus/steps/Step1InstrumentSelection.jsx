import { investmentInfo } from '@/constants/investmentInfo'
import StepNavigationButtons from '../StepNavigationButtons'

/**
 * Step 1: Instrument Selection Component
 * @param {Object} props
 * @param {Array} props.availableInstruments - List of available instruments
 * @param {Array<string>} props.selectedInstruments - Currently selected instruments
 * @param {Function} props.onInstrumentToggle - Handler for instrument selection
 * @param {Function} props.onNext - Handler for next button
 * @param {boolean} props.isValid - Whether step is valid
 * @param {string[]} props.validationErrors - Validation error messages
 */
const Step1InstrumentSelection = ({
  availableInstruments,
  selectedInstruments,
  onInstrumentToggle,
  onNext,
  isValid,
  validationErrors,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Step 1: Select Investment Instruments
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Select one or more investment instruments to include in your corpus calculation
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {availableInstruments.map((instrument) => {
          const isSelected = selectedInstruments.includes(instrument.id)
          const info = investmentInfo[instrument.id] || {}

          return (
            <button
              key={instrument.id}
              type="button"
              onClick={() => onInstrumentToggle(instrument.id)}
              className={`
                p-6 rounded-xl border-2 transition-all text-left
                ${
                  isSelected
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-600'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{instrument.icon}</div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-5 h-5 text-green-600 rounded"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {instrument.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {instrument.fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {info.description || 'Investment instrument'}
              </p>
            </button>
          )
        })}
      </div>

      {selectedInstruments.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-300">
            {selectedInstruments.length} instrument{selectedInstruments.length > 1 ? 's' : ''}{' '}
            selected. Click "Next" to proceed.
          </p>
        </div>
      )}

      <StepNavigationButtons
        onNext={onNext}
        isValid={isValid}
        validationErrors={validationErrors}
        showPrevious={false}
      />
    </div>
  )
}

export default Step1InstrumentSelection

