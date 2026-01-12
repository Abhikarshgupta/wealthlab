import { useEffect } from 'react'
import InputField from '@/components/common/InputField/InputField'
import { investmentRates } from '@/constants/investmentRates'

/**
 * SIP Investment Input Form
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID ('sip')
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const SIPInput = ({ instrumentId, instrumentData, updateInvestment }) => {
  // Ensure tenureUnit is set to 'years' by default if not set
  useEffect(() => {
    if (!instrumentData.tenureUnit) {
      updateInvestment(instrumentId, {
        ...instrumentData,
        tenureUnit: 'years',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount
  
  const tenureUnit = instrumentData.tenureUnit || 'years'
  
  return (
    <div className="space-y-4">
      <InputField
        label="Monthly SIP Amount"
        type="number"
        value={instrumentData.monthlySIP || 5000}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            monthlySIP: parseFloat(e.target.value) || 0,
          })
        }
        showCurrency
        placeholder="5000"
        min={500}
      />
      <InputField
        label="Tenure"
        type="number"
        value={instrumentData.tenure || 10}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            tenure: parseFloat(e.target.value) || 0,
          })
        }
        min={1}
      />
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name={`${instrumentId}-tenureUnit`}
            checked={tenureUnit === 'years'}
            onChange={() =>
              updateInvestment(instrumentId, {
                ...instrumentData,
                tenureUnit: 'years',
              })
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Years</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name={`${instrumentId}-tenureUnit`}
            checked={tenureUnit === 'months'}
            onChange={() =>
              updateInvestment(instrumentId, {
                ...instrumentData,
                tenureUnit: 'months',
              })
            }
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Months</span>
        </label>
      </div>
      <InputField
        label="Expected Return (%)"
        type="number"
        value={instrumentData.expectedReturn || investmentRates.sip?.expectedReturn || 0}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            expectedReturn: parseFloat(e.target.value) || 0,
          })
        }
        step={0.1}
        min={0.1}
        max={30}
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={instrumentData.stepUpEnabled || false}
          onChange={(e) =>
            updateInvestment(instrumentId, {
              ...instrumentData,
              stepUpEnabled: e.target.checked,
            })
          }
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Enable Step-Up SIP</span>
      </label>
      {instrumentData.stepUpEnabled && (
        <InputField
          label="Step-Up Percentage (%)"
          type="number"
          value={instrumentData.stepUpPercentage || 10}
          onChange={(e) =>
            updateInvestment(instrumentId, {
              ...instrumentData,
              stepUpPercentage: parseFloat(e.target.value) || 0,
            })
          }
          min={0}
          max={50}
        />
      )}
    </div>
  )
}

export default SIPInput

