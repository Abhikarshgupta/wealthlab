import InputField from '@/components/common/InputField/InputField'

/**
 * SGB Investment Input Form
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID ('sgb')
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const SGBInput = ({ instrumentId, instrumentData, updateInvestment }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Investment Amount (Principal)"
        type="number"
        value={instrumentData.principal ?? ''}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            principal: parseFloat(e.target.value) || 0,
          })
        }
        showCurrency
        placeholder="100000"
        min={1000}
      />
      <InputField
        label="Tenure (Years)"
        type="number"
        value={instrumentData.tenure ?? ''}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            tenure: parseFloat(e.target.value) || 0,
          })
        }
        min={5}
        max={8}
      />
      <InputField
        label="Gold Appreciation Rate (%)"
        type="number"
        value={instrumentData.goldAppreciationRate ?? ''}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            goldAppreciationRate: parseFloat(e.target.value) || 0,
          })
        }
        step={0.1}
        min={0}
        max={30}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Note: SGB provides 2.5% fixed interest + gold appreciation. Fixed interest is paid semi-annually.
      </p>
    </div>
  )
}

export default SGBInput

