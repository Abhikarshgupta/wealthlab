import { useState, useEffect } from 'react'
import useCorpusCalculatorStore from '@/store/corpusCalculatorStore'
import {
  getAllSavedCalculations,
  saveCurrentState,
  deleteCalculation,
  updateCalculation,
  isStorageAvailable,
} from '@/utils/corpusCalculatorStorage'
import { formatCurrency, formatDate } from '@/utils/formatters'

/**
 * Saved Calculations Panel Component
 * Shows list of saved simulations and allows loading/deleting
 */
const SavedCalculationsPanel = ({ onLoadCalculation }) => {
  const [savedCalculations, setSavedCalculations] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const loadSavedCalculations = () => {
    const saved = getAllSavedCalculations()
    setSavedCalculations(saved)
  }

  useEffect(() => {
    if (isOpen) {
      loadSavedCalculations()
    }
  }, [isOpen])

  const handleLoad = (calculationId) => {
    const calculation = savedCalculations.find((calc) => calc.id === calculationId)
    if (calculation && onLoadCalculation) {
      onLoadCalculation(calculation.data)
    }
    setIsOpen(false)
  }

  const handleDelete = (calculationId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this saved calculation?')) {
      deleteCalculation(calculationId)
      loadSavedCalculations()
    }
  }

  const handleStartEdit = (calculation, e) => {
    e.stopPropagation()
    setEditingId(calculation.id)
    setEditName(calculation.name)
  }

  const handleSaveEdit = (calculationId, e) => {
    e.stopPropagation()
    updateCalculation(calculationId, { name: editName })
    setEditingId(null)
    setEditName('')
    loadSavedCalculations()
  }

  const handleCancelEdit = (e) => {
    e.stopPropagation()
    setEditingId(null)
    setEditName('')
  }

  if (!isStorageAvailable()) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          Local storage is not available. Calculations cannot be saved.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          px-4 py-2 flex items-center space-x-2
          bg-gray-50 dark:bg-gray-800/50
          hover:bg-gray-100 dark:hover:bg-gray-800
          border border-gray-300 dark:border-gray-600 rounded-lg
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        "
      >
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Saved Calculations
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {savedCalculations.length} saved
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Overlay Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80">
          <div className="
            bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
            overflow-hidden
          ">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Saved Calculations
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {savedCalculations.length} saved calculation{savedCalculations.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Content - Max 2 items visible, then scroll */}
            <div className="p-2 max-h-[200px] overflow-y-auto">
              {savedCalculations.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No saved calculations yet.</p>
                  <p className="text-xs mt-2">Save your current calculation to see it here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedCalculations.map((calculation) => (
                    <div
                      key={calculation.id}
                      className="
                        p-3 rounded-lg border border-gray-200 dark:border-gray-700
                        hover:border-green-500 dark:hover:border-green-500
                        hover:bg-gray-50 dark:hover:bg-gray-800/50
                        transition-colors cursor-pointer
                      "
                      onClick={() => handleLoad(calculation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {editingId === calculation.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEdit(calculation.id, e)
                                  } else if (e.key === 'Escape') {
                                    handleCancelEdit(e)
                                  }
                                }}
                                className="
                                  flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600
                                  rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                  focus:outline-none focus:ring-2 focus:ring-green-500
                                "
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={(e) => handleSaveEdit(calculation.id, e)}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {calculation.name}
                            </h4>
                          )}
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(new Date(calculation.timestamp))}
                          </div>
                          {calculation.data?.results?.nominalCorpus && (
                            <div className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                              Corpus: {formatCurrency(calculation.data.results.nominalCorpus)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                          {editingId !== calculation.id && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => handleStartEdit(calculation, e)}
                                className="
                                  p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400
                                  transition-colors
                                "
                                title="Rename"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDelete(calculation.id, e)}
                                className="
                                  p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400
                                  transition-colors
                                "
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Save Simulation Button Component
 * Allows saving current simulation with a custom name
 */
const SaveCalculationButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [calculationName, setCalculationName] = useState('')
  const store = useCorpusCalculatorStore()

  const handleSave = () => {
    if (!calculationName.trim()) {
      alert('Please enter a name for this calculation')
      return
    }

    try {
      const state = {
        selectedInstruments: store.selectedInstruments,
        investments: store.investments,
        settings: store.settings,
        results: store.results,
        purchasingPower: store.purchasingPower,
        currentStep: store.currentStep,
      }

      saveCurrentState(state, calculationName.trim())
      setIsOpen(false)
      setCalculationName('')
      alert('Calculation saved successfully!')
    } catch (error) {
      console.error('Error saving calculation:', error)
      alert('Failed to save calculation. Please try again.')
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setCalculationName('')
  }

  if (!isStorageAvailable()) {
    return null
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={!store.selectedInstruments || store.selectedInstruments.length === 0}
        className="
          px-4 py-2 bg-blue-500 text-white rounded-lg font-medium
          hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        "
      >
        💾 Save Calculation
      </button>

      {/* Save Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCancel}
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
                Save Calculation
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Calculation Name
                  </label>
                  <input
                    type="text"
                    value={calculationName}
                    onChange={(e) => setCalculationName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSave()
                      } else if (e.key === 'Escape') {
                        handleCancel()
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
                    onClick={handleCancel}
                    className="
                      px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg
                      hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors
                    "
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!calculationName.trim()}
                    className="
                      px-4 py-2 bg-green-500 text-white rounded-lg font-semibold
                      hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                      transition-colors
                    "
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export { SavedCalculationsPanel, SaveCalculationButton }

