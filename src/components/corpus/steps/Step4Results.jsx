import {
  CorpusResults,
  InstrumentBreakdownTable,
  CorpusVisualizations,
  PurchasingPowerPanel,
} from '@/components/corpus'

/**
 * Step 4: Results View Component
 * @param {Object} props
 * @param {Object} props.results - Calculation results
 * @param {Object} props.purchasingPower - Purchasing power results
 * @param {Object} props.settings - Current settings
 * @param {Object} props.investments - Investment data by instrument ID
 * @param {Array<string>} props.selectedInstruments - Selected instruments
 * @param {Function} props.onPrevious - Handler for previous button
 * @param {Function} props.onStartOver - Handler for start over button
 */
const Step4Results = ({
  results,
  purchasingPower,
  settings,
  investments,
  selectedInstruments,
  onPrevious,
  onStartOver,
}) => {
  // If no results are available, show a message and prevent rendering
  if (!results) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Results Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please complete Steps 1-3 and click "Calculate Corpus" to view your results.
          </p>
          <button
            type="button"
            onClick={onPrevious}
            className="
              px-6 py-3 bg-green-500 text-white rounded-lg font-semibold
              hover:bg-green-600 transition-colors
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            "
          >
            ← Go Back to Settings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <CorpusResults
          results={results}
          settings={settings}
          investments={investments}
          instruments={selectedInstruments}
        />
      </div>

      {/* Instrument Breakdown */}
      {results && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <InstrumentBreakdownTable
            results={results}
            investments={investments}
            instruments={selectedInstruments}
            settings={settings}
          />
        </div>
      )}

      {/* Visualizations */}
      {results && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <CorpusVisualizations results={results} settings={settings} />
        </div>
      )}

      {/* Purchasing Power Panel */}
      {purchasingPower && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <PurchasingPowerPanel
            purchasingPowerResults={purchasingPower}
            selectedCity={settings.selectedCity}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="
            px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold
            hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
          "
        >
          ← Back to Settings
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="
            px-6 py-3 bg-green-500 text-white rounded-lg font-semibold
            hover:bg-green-600 transition-colors
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          "
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

export default Step4Results

