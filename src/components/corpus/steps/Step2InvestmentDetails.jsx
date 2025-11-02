import InputField from '@/components/common/InputField/InputField'
import { getExistingInvestmentDefaults, checkTenureLimit, getDefaultPlanToInvestMore } from '@/utils/existingInvestmentUtils'
import { InstrumentInputForm } from '@/components/corpus'
import ExistingInvestmentSection from '../ExistingInvestmentSection'
import StepNavigationButtons from '../StepNavigationButtons'

/**
 * Step 2: Investment Details Component
 * @param {Object} props
 * @param {Array} props.availableInstruments - List of available instruments
 * @param {Array<string>} props.selectedInstruments - Currently selected instruments
 * @param {Object} props.investments - Investment data by instrument ID
 * @param {Function} props.updateInvestment - Function to update investment data
 * @param {Function} props.onPrevious - Handler for previous button
 * @param {Function} props.onNext - Handler for next button
 * @param {boolean} props.isValid - Whether step is valid
 * @param {string[]} props.validationErrors - Validation error messages
 */
const Step2InvestmentDetails = ({
  availableInstruments,
  selectedInstruments,
  investments,
  updateInvestment,
  onPrevious,
  onNext,
  isValid,
  validationErrors,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Step 2: Investment Details
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter details for existing investments (if any) and future investments for each selected instrument
      </p>

      <div className="space-y-6">
        {selectedInstruments.map((instrumentId) => {
          const instrument = availableInstruments.find((inst) => inst.id === instrumentId)
          const instrumentData = investments[instrumentId] || {}
          const hasExistingInvestment = instrumentData.hasExistingInvestment || false

          return (
            <div
              key={instrumentId}
              className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {instrument?.fullName || instrumentId.toUpperCase()}
              </h3>

              {/* Existing Investment Section */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hasExistingInvestment}
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      const defaults = getExistingInvestmentDefaults(instrumentId)
                      const currentRate = instrumentData.rate || defaults.rate

                      // For fixed-term investments, update tenure based on years invested
                      if (isChecked && ['ppf', 'ssy', 'nsc'].includes(instrumentId)) {
                        const existingYears = instrumentData.existingInvestment?.yearsInvested || defaults.yearsInvested
                        const tenureCheck = checkTenureLimit(instrumentId, existingYears)
                        if (tenureCheck.maxTenure) {
                          const remainingTenure = Math.max(0, tenureCheck.maxTenure - existingYears)
                          // Only update tenure if we have a valid remaining tenure
                          if (remainingTenure > 0) {
                            // Set tenure to remaining tenure if not already set or if current is invalid
                            const currentTenure = instrumentData.tenure || 0
                            if (!currentTenure || currentTenure > remainingTenure) {
                              updateInvestment(instrumentId, {
                                ...instrumentData,
                                tenure: remainingTenure,
                                hasExistingInvestment: isChecked,
                                planToInvestMore: isChecked 
                                  ? (instrumentData.planToInvestMore !== undefined 
                                      ? instrumentData.planToInvestMore 
                                      : getDefaultPlanToInvestMore(instrumentId))
                                  : undefined,
                                existingInvestment: {
                                  currentValue: defaults.currentValue,
                                  yearsInvested: existingYears,
                                  currentReturnRate: currentRate,
                                  rate: currentRate, // Backward compatibility
                                },
                              })
                              return // Exit early to avoid double update
                            }
                          }
                        }
                      }
                      
                      // Default update if no tenure adjustment needed
                      updateInvestment(instrumentId, {
                        ...instrumentData,
                        hasExistingInvestment: isChecked,
                        planToInvestMore: isChecked 
                          ? (instrumentData.planToInvestMore !== undefined 
                              ? instrumentData.planToInvestMore 
                              : getDefaultPlanToInvestMore(instrumentId))
                          : undefined,
                        existingInvestment: isChecked
                          ? {
                              currentValue: instrumentData.existingInvestment?.currentValue || defaults.currentValue,
                              yearsInvested: instrumentData.existingInvestment?.yearsInvested || defaults.yearsInvested,
                              currentReturnRate: instrumentData.existingInvestment?.currentReturnRate || currentRate,
                              rate: instrumentData.existingInvestment?.rate || currentRate, // Backward compatibility
                            }
                          : undefined,
                      })
                    }}
                    className="w-5 h-5 text-green-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    I have existing investments in {instrument?.name || instrumentId}
                  </span>
                </label>

                {hasExistingInvestment && (
                  <ExistingInvestmentSection
                    instrumentId={instrumentId}
                    instrumentData={instrumentData}
                    updateInvestment={updateInvestment}
                    instrument={instrument}
                  />
                )}
              </div>

              {/* Plan to Invest More Toggle */}
              {hasExistingInvestment && (
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={instrumentData.planToInvestMore !== false}
                      onChange={(e) => {
                        const newValue = e.target.checked
                        updateInvestment(instrumentId, {
                          ...instrumentData,
                          planToInvestMore: newValue,
                        })
                      }}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Plan to invest more in {instrument?.name || instrumentId}?
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                    {instrumentData.planToInvestMore !== false
                      ? 'The expected return rate from future investments will also be used to project your existing investment forward.'
                      : 'Only your existing investment will be projected forward using the expected return rate you specify above.'}
                  </p>
                </div>
              )}

              {/* Divider */}
              {(hasExistingInvestment || instrumentData.planToInvestMore !== false) && (
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
              )}

              {/* Future Investment Section - Only show if planning to invest more OR no existing investment */}
              {(!hasExistingInvestment || instrumentData.planToInvestMore !== false) && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Future Investment Details
                  </h4>
                  <InstrumentInputForm
                    instrumentId={instrumentId}
                    instrumentData={instrumentData}
                    updateInvestment={updateInvestment}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <StepNavigationButtons
        onPrevious={onPrevious}
        onNext={onNext}
        isValid={isValid}
        validationErrors={validationErrors}
      />
    </div>
  )
}

export default Step2InvestmentDetails

