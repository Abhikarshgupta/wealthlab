import InputField from '@/components/common/InputField/InputField'
import { CitySelector, CategoryInflationSettings, TaxMethodSelector, TaxEducationPanel, TaxBracketSelector } from '@/components/corpus'
import StepNavigationButtons from '../StepNavigationButtons'

/**
 * Step 3: Settings & Options Component
 * @param {Object} props
 * @param {Object} props.settings - Current settings
 * @param {Function} props.updateSettings - Function to update settings
 * @param {Function} props.onPrevious - Handler for previous button
 * @param {Function} props.onCalculate - Handler for calculate button
 * @param {boolean} props.isValid - Whether all steps up to Step 3 are valid
 * @param {string[]} props.validationErrors - Validation error messages for all steps
 */
const Step3Settings = ({
  settings,
  updateSettings,
  onPrevious,
  onCalculate,
  isValid,
  validationErrors,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Step 3: Settings & Options
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Configure inflation rates, tax method, and other settings
      </p>

      <div className="space-y-6">
        {/* General Inflation Rate */}
        <div>
          <InputField
            label="General Inflation Rate (%)"
            type="number"
            value={settings.generalInflationRate || 6}
            onChange={(e) =>
              updateSettings({
                generalInflationRate: parseFloat(e.target.value) || 6,
              })
            }
            step={0.1}
            min={0}
            max={20}
            required
          />
        </div>

        {/* Time Horizon */}
        <div>
          <InputField
            label="Time Horizon (Years until corpus withdrawal)"
            type="number"
            value={settings.timeHorizon || 10}
            onChange={(e) =>
              updateSettings({
                timeHorizon: parseFloat(e.target.value) || 10,
              })
            }
            min={1}
            max={50}
            required
          />
        </div>

        {/* Category Inflation Settings */}
        <CategoryInflationSettings />

        {/* Tax Bracket Selector */}
        <TaxBracketSelector />

        {/* Tax Method Selector */}
        <TaxMethodSelector />

        {/* Tax Education Panel */}
        <TaxEducationPanel />

        {/* City Selector */}
        <CitySelector />
      </div>

      <StepNavigationButtons
        onPrevious={onPrevious}
        onNext={onCalculate}
        isValid={isValid}
        validationErrors={validationErrors}
        nextLabel="Simulate Corpus →"
      />
    </div>
  )
}

export default Step3Settings

