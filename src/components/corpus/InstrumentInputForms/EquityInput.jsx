import InputField from '@/components/common/InputField/InputField'

/**
 * Equity/ELSS Investment Input Form
 * @param {Object} props
 * @param {string} props.instrumentId - Instrument ID ('equity' or 'elss')
 * @param {Object} props.instrumentData - Current investment data
 * @param {Function} props.updateInvestment - Function to update investment data
 */
const EquityInput = ({ instrumentId, instrumentData, updateInvestment }) => {
  const isELSS = instrumentId === 'elss'
  const investmentType = instrumentData.investmentType || 'sip'

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Investment Type
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name={`${instrumentId}-investmentType`}
              checked={investmentType === 'sip'}
              onChange={() =>
                updateInvestment(instrumentId, {
                  ...instrumentData,
                  investmentType: 'sip',
                })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">SIP</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={`${instrumentId}-investmentType`}
              checked={investmentType === 'lumpsum'}
              onChange={() =>
                updateInvestment(instrumentId, {
                  ...instrumentData,
                  investmentType: 'lumpsum',
                })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Lumpsum</span>
          </label>
        </div>
      </div>
      {investmentType === 'sip' ? (
        <>
          <InputField
            label="Monthly SIP Amount"
            type="number"
            value={instrumentData.amount ?? ''}
            onChange={(e) =>
              updateInvestment(instrumentId, {
                ...instrumentData,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            showCurrency
            placeholder="5000"
            min={500}
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
        </>
      ) : (
        <InputField
          label="Lumpsum Amount"
          type="number"
          value={instrumentData.amount || 100000}
          onChange={(e) =>
            updateInvestment(instrumentId, {
              ...instrumentData,
              amount: parseFloat(e.target.value) || 0,
            })
          }
          showCurrency
          placeholder="100000"
          min={1000}
        />
      )}
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
        min={isELSS ? 3 : 1}
        max={50}
      />
      <InputField
        label="Expected Return (%)"
        type="number"
        value={instrumentData.expectedReturn || instrumentData.expectedCAGR || ''}
        onChange={(e) =>
          updateInvestment(instrumentId, {
            ...instrumentData,
            expectedReturn: parseFloat(e.target.value) || 0,
            expectedCAGR: parseFloat(e.target.value) || 0,
          })
        }
        step={0.1}
        min={0.1}
        max={30}
      />
      {isELSS && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Note: ELSS has a 3-year lock-in period
        </p>
      )}
    </div>
  )
}

export default EquityInput

