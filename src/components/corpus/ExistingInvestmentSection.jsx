import InputField from '@/components/common/InputField/InputField'
import { checkTenureLimit, calculateExistingInvestmentCurrentValue } from '@/utils/existingInvestmentUtils'

/**
 * Existing Investment Section Component
 * Reusable component for displaying and editing existing investment details
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 * @param {Object} props.instrument - Instrument info object (name, fullName, etc.)
 */
const ExistingInvestmentSection = ({ instrumentId, instrumentData, updateInvestment, instrument: _instrument }) => {
  const hasExistingInvestment = instrumentData.hasExistingInvestment || false
  const existingData = instrumentData.existingInvestment || {}
  const yearsInvested = existingData.yearsInvested || 0
  const tenureCheck = checkTenureLimit(instrumentId, yearsInvested)
  
  // Calculate current value if not provided
  let calculatedCurrentValue = existingData.currentValue || 0
  if (!existingData.currentValue && yearsInvested > 0) {
    calculatedCurrentValue = calculateExistingInvestmentCurrentValue(instrumentId, {
      ...existingData,
      yearsInvested: yearsInvested,
      yearlyContribution: instrumentData.yearlyInvestment || 0,
      monthlySIP: instrumentData.monthlySIP || 0,
      initialInvestment: existingData.initialInvestment || 0,
      rate: existingData.rate || instrumentData.rate || 0,
    })
  }

  if (!hasExistingInvestment) return null

  return (
    <div className="ml-7 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        Existing Investment Details
      </h4>

      {/* Tenure Warning */}
      {tenureCheck.exceeds && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Maximum Tenure Reached
              </p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                {tenureCheck.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <InputField
        label="Current Investment Value"
        type="number"
        value={existingData.currentValue || calculatedCurrentValue || ''}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value) || 0
          updateInvestment(instrumentId, {
            ...instrumentData,
            existingInvestment: {
              ...existingData,
              currentValue: newValue,
              rate: existingData.rate || instrumentData.rate || 0,
              yearsInvested: existingData.yearsInvested || 0,
            },
          })
        }}
        showCurrency
        placeholder="0"
        min={0}
        disabled={tenureCheck.exceeds}
        required
      />

      {/* Display calculated value helper */}
      {!existingData.currentValue && calculatedCurrentValue > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
          <span className="font-medium">💡 Tip:</span> The value shown is estimated based on years invested and rate. 
          You can enter your actual current value if you know it.
        </div>
      )}

      <InputField
        label="Years Already Invested"
        type="number"
        value={existingData.yearsInvested || ''}
        onChange={(e) => {
          const newYearsInvested = parseFloat(e.target.value) || 0
          const tenureCheck = checkTenureLimit(instrumentId, newYearsInvested)

          // Update tenure for fixed-term investments (PPF, SSY)
          let updatedTenure = instrumentData.tenure
          if (['ppf', 'ssy'].includes(instrumentId) && tenureCheck.maxTenure) {
            const remainingTenure = Math.max(0, tenureCheck.maxTenure - newYearsInvested)
            if (remainingTenure > 0 && instrumentData.tenure) {
              updatedTenure = Math.min(instrumentData.tenure, remainingTenure)
            } else if (remainingTenure > 0) {
              updatedTenure = remainingTenure
            } else {
              updatedTenure = 0
            }
          }

          updateInvestment(instrumentId, {
            ...instrumentData,
            tenure: updatedTenure,
            existingInvestment: {
              ...existingData,
              yearsInvested: newYearsInvested,
              currentValue: existingData.currentValue || 0,
              rate: existingData.rate || instrumentData.rate || 0,
            },
          })
        }}
        placeholder="0"
        min={0}
        max={tenureCheck.maxTenure || 100}
        disabled={tenureCheck.exceeds}
        required
      />
      
      {/* Show remaining tenure helper for fixed-term investments */}
      {['ppf', 'ssy'].includes(instrumentId) && tenureCheck.maxTenure && yearsInvested > 0 && !tenureCheck.exceeds && (
        <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-200 dark:border-green-800">
          <span className="font-medium">Remaining tenure:</span>{' '}
          {tenureCheck.maxTenure - yearsInvested} years available for future investments
        </div>
      )}
      
      <InputField
        label="Current Return Rate (%)"
        type="number"
        value={existingData.currentReturnRate || existingData.rate || instrumentData.rate || ''}
        onChange={(e) => {
          const newRate = parseFloat(e.target.value) || 0
          updateInvestment(instrumentId, {
            ...instrumentData,
            existingInvestment: {
              ...existingData,
              currentReturnRate: newRate,
              rate: newRate, // Keep for backward compatibility
              currentValue: existingData.currentValue || 0,
              yearsInvested: existingData.yearsInvested || 0,
            },
          })
        }}
        step={0.1}
        min={0}
        max={30}
        disabled={tenureCheck.exceeds}
        required
      />
      
      {/* Show Expected Return Rate only if NOT planning to invest more */}
      {!instrumentData.planToInvestMore && (
        <InputField
          label="Expected Return Rate (for projection) (%)"
          type="number"
          value={existingData.expectedReturnRate || existingData.currentReturnRate || existingData.rate || instrumentData.rate || ''}
          onChange={(e) => {
            const newRate = parseFloat(e.target.value) || 0
            updateInvestment(instrumentId, {
              ...instrumentData,
              existingInvestment: {
                ...existingData,
                expectedReturnRate: newRate,
              },
            })
          }}
          step={0.1}
          min={0}
          max={30}
          disabled={tenureCheck.exceeds}
          required
        />
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {tenureCheck.exceeds
          ? 'Maximum tenure reached. Please extend or close this investment.'
          : instrumentData.planToInvestMore
            ? 'Current return rate is used to calculate your current value. Future projection will use the expected return rate from future investments.'
            : 'This will calculate the future value of your existing investment based on the time horizon you set in Step 3.'}
      </p>
    </div>
  )
}

export default ExistingInvestmentSection

