import { useEffect, useState } from 'react'
import useCorpusCalculatorStore from '@/store/corpusCalculatorStore'
import {
  RestoreBanner,
  SaveModal,
  Step1InstrumentSelection,
  Step2InvestmentDetails,
  Step3Settings,
  Step4Results,
  SavedCalculationsPanel,
  SaveCalculationButton,
} from '@/components/corpus'
import ScrollToTop from '@/components/common/ScrollToTop/ScrollToTop'
import useCorpusCalculator from '@/hooks/useCorpusCalculator'
import useCorpusPersistence from '@/hooks/useCorpusPersistence'
import { availableInstruments, corpusSteps } from '@/constants/instruments'
import {
  isCurrentStepValid,
  getValidationErrors,
  getAllStepsValidationErrors,
  areAllStepsValidUpTo,
} from '@/utils/corpusValidation'
import {
  initializeDefaultsForInstruments,
} from '@/utils/corpusDefaults'

/**
 * Corpus Simulator Page
 * Multi-step form for simulating corpus from multiple investment instruments
 */
const CorpusCalculatorPage = () => {
  const {
    selectedInstruments,
    investments,
    settings,
    results,
    purchasingPower,
    currentStep,
    setSelectedInstruments,
    updateInvestment,
    updateSettings,
    setResults,
    setPurchasingPower,
    setCurrentStep,
    loadCalculation,
    reset,
  } = useCorpusCalculatorStore()

  // Use custom hooks for calculations and persistence
  useCorpusCalculator({
    selectedInstruments,
    investments,
    settings,
    setResults,
    setPurchasingPower,
  })

  const persistence = useCorpusPersistence({
    selectedInstruments,
    investments,
    settings,
    results,
    purchasingPower,
    currentStep,
    setResults,
    setPurchasingPower,
    loadCalculation,
    reset,
    setCurrentStep,
    setShowRestoreBanner: null, // We'll handle this separately
  })

  // Local state for restore banner and save modal
  const [showRestoreBanner, setShowRestoreBanner] = useState(persistence.showRestoreBanner)
  const [showSaveModal, setShowSaveModal] = useState(persistence.showSaveModal)
  const [saveCalculationName, setSaveCalculationName] = useState(persistence.saveCalculationName)

  // Handle save and start fresh
  const handleSaveAndStartFresh = () => {
    persistence.handleSaveAndStartFresh()
  }

  // Available instruments - using constant
  const instruments = availableInstruments

  // Handle instrument selection
  const handleInstrumentToggle = (instrumentId) => {
    const current = selectedInstruments || []
    if (current.includes(instrumentId)) {
      setSelectedInstruments(current.filter((id) => id !== instrumentId))
      // Remove investment data when instrument is deselected
      const newInvestments = { ...investments }
      delete newInvestments[instrumentId]
      // Note: We can't directly update investments in store, but the form will handle it
    } else {
      setSelectedInstruments([...current, instrumentId])
      // Don't initialize defaults here - let user fill in Step 2
      // Defaults will be initialized when user navigates to Step 2 or starts editing
    }
  }

  // Initialize defaults when user navigates to Step 2
  useEffect(() => {
    if (currentStep === 2 && selectedInstruments.length > 0) {
      // Initialize defaults for instruments that don't have data yet
      selectedInstruments.forEach((instrumentId) => {
        const instrumentData = investments[instrumentId] || {}
        // Only initialize if instrument has no investment data at all
        // (meaning user hasn't interacted with it yet)
        if (Object.keys(instrumentData).length === 0 || 
            (!instrumentData.hasExistingInvestment && 
             !instrumentData.yearlyInvestment && 
             !instrumentData.principal && 
             !instrumentData.monthlySIP && 
             !instrumentData.monthlyContribution && 
             !instrumentData.amount)) {
          initializeDefaultsForInstruments([instrumentId], investments, updateInvestment)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]) // Run when currentStep changes

  // Validation functions - using extracted utilities
  const isCurrentStepValidWrapper = () => isCurrentStepValid(currentStep, selectedInstruments, investments, settings)
  const getValidationErrorsWrapper = () => getValidationErrors(currentStep, selectedInstruments, investments, settings)
  const getAllStepsValidationErrorsWrapper = (targetStep) => getAllStepsValidationErrors(targetStep, selectedInstruments, investments, settings)
  const areAllStepsValidUpToWrapper = (targetStep) => areAllStepsValidUpTo(targetStep, selectedInstruments, investments, settings)

  // Step navigation handlers
  const handleNext = () => {
    if (currentStep < 4) {
      // Only allow moving forward if current step is valid
      if (isCurrentStepValidWrapper()) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepNumber) => {
    // Only allow navigation to:
    // 1. Completed steps (can always go back)
    // 2. Current step (no-op, but allow it)
    // 3. Next step (only if current step is valid)
    // 4. Future steps beyond next (only if ALL previous steps including current are valid)
    // 5. Step 4 can ONLY be accessed if user has completed Steps 1-3 via normal flow
    
    if (stepNumber <= currentStep) {
      // Can navigate to any completed step or current step
      setCurrentStep(stepNumber)
    } else if (stepNumber === 4) {
      // Step 4 (Results) can only be accessed if:
      // - All steps 1-3 are valid AND
      // - User has progressed through steps normally (currentStep >= 3)
      if (areAllStepsValidUpToWrapper(3) && currentStep >= 3) {
        setCurrentStep(4)
      }
      // Otherwise, don't allow navigation (silently fail)
    } else if (stepNumber > currentStep) {
      // For future steps (2 or 3), check that all steps up to target step are valid
      if (areAllStepsValidUpToWrapper(stepNumber - 1)) {
        setCurrentStep(stepNumber)
      }
      // Otherwise, don't allow navigation (silently fail)
    }
  }

  const handleCalculate = () => {
    // Only allow calculation if all steps are valid
    if (areAllStepsValidUpToWrapper(3)) {
      // Calculation is already done via useEffect
      setCurrentStep(4)
    }
  }

  // Handle loading a saved calculation
  const handleLoadCalculation = persistence.handleLoadCalculation

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Multi-Instrument Corpus Simulator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
              Simulate your future corpus across multiple investment instruments with tax and inflation adjustments
        </p>
      </div>
          <div className="flex items-center space-x-3">
            <SavedCalculationsPanel onLoadCalculation={handleLoadCalculation} />
            {(currentStep === 3 || currentStep === 4) && <SaveCalculationButton />}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* Restore Banner */}
        <RestoreBanner
          show={showRestoreBanner}
          onDismiss={() => setShowRestoreBanner(false)}
          onSaveAndStartFresh={() => setShowSaveModal(true)}
        />

        {/* Save Modal */}
        <SaveModal
          show={showSaveModal}
          calculationName={saveCalculationName}
          onNameChange={setSaveCalculationName}
          onSave={handleSaveAndStartFresh}
          onCancel={() => {
            setShowSaveModal(false)
            setSaveCalculationName('')
          }}
        />

        <div className="flex items-center justify-between">
          {corpusSteps.map((stepConfig) => {
            const step = stepConfig.number
            const isCompleted = currentStep > step
            const isCurrent = currentStep === step
            // Step is clickable if:
            // 1. It's a completed step (can always go back)
            // 2. It's the current step (no-op, but allow it)
            // 3. It's Step 4 - only clickable if currentStep >= 3 AND all steps are valid
            // 4. It's a future step (2 or 3) AND all previous steps including current are valid
            const isClickable = step <= currentStep || 
              (step === 4 && currentStep >= 3 && areAllStepsValidUpToWrapper(3)) ||
              (step > currentStep && step < 4 && areAllStepsValidUpToWrapper(currentStep))
            
            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    type="button"
                    onClick={() => handleStepClick(step)}
                    disabled={!isClickable}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      transition-all duration-200
                      ${
                        isCurrent
                          ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2'
                          : isCompleted
                          ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                      ${
                        isClickable && !isCurrent
                          ? 'hover:scale-110 cursor-pointer'
                          : 'cursor-default'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    `}
                    aria-label={`Go to step ${step}: ${stepConfig.shortTitle}`}
                    title={
                      isClickable
                        ? `Go to step ${step}`
                        : 'Complete previous steps first'
                    }
                  >
                    {isCompleted ? '✓' : step}
                  </button>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {stepConfig.shortTitle}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Step 1: Instrument Selection */}
        {currentStep === 1 && (
          <Step1InstrumentSelection
            availableInstruments={instruments}
            selectedInstruments={selectedInstruments}
            onInstrumentToggle={handleInstrumentToggle}
            onNext={handleNext}
            isValid={isCurrentStepValidWrapper()}
            validationErrors={getValidationErrorsWrapper()}
          />
        )}

        {/* Step 2: Investment Details */}
        {currentStep === 2 && (
          <Step2InvestmentDetails
            availableInstruments={instruments}
            selectedInstruments={selectedInstruments}
            investments={investments}
            updateInvestment={updateInvestment}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isValid={isCurrentStepValidWrapper()}
            validationErrors={getValidationErrorsWrapper()}
          />
        )}

        {/* Step 3: Settings & Options */}
        {currentStep === 3 && (
          <Step3Settings
            settings={settings}
            updateSettings={updateSettings}
            onPrevious={handlePrevious}
            onCalculate={handleCalculate}
            isValid={areAllStepsValidUpToWrapper(3)}
            validationErrors={getAllStepsValidationErrorsWrapper(3)}
          />
        )}

        {/* Step 4: Results View */}
        {currentStep === 4 && (
          <Step4Results
            results={results}
            purchasingPower={purchasingPower}
            settings={settings}
            investments={investments}
            selectedInstruments={selectedInstruments}
            onPrevious={handlePrevious}
            onStartOver={() => {
              reset()
              setCurrentStep(1)
              setShowRestoreBanner(false)
            }}
          />
        )}
      </div>
      <ScrollToTop />
    </div>
  )
}

export default CorpusCalculatorPage
