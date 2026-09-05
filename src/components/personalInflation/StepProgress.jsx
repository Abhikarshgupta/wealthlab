import { INFLATION_STEPS } from '@/constants/personalInflationCopy'

/**
 * Four-step progress, corpus-style: numbered circles, green when done.
 */
const StepProgress = ({ currentStep, completedThrough, onStepClick, canOpenResults }) => {
  return (
    <nav aria-label="Interview progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {INFLATION_STEPS.map((stepConfig, index) => {
          const step = stepConfig.number
          const isCompleted = completedThrough >= step || currentStep > step
          const isCurrent = currentStep === step
          const isClickable =
            step <= currentStep ||
            step <= completedThrough + 1 ||
            (step === 4 && canOpenResults)

          return (
            <li key={step} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step)}
                  className={`
                    w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-all
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    ${
                      isCurrent
                        ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                    ${isClickable && !isCurrent ? 'hover:scale-105 cursor-pointer' : ''}
                    disabled:opacity-60 disabled:cursor-not-allowed
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${step}: ${stepConfig.shortTitle}`}
                >
                  {isCompleted && !isCurrent ? '✓' : step}
                </button>
                <span
                  className={`mt-2 text-[11px] md:text-xs font-medium truncate max-w-full ${
                    currentStep >= step
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {stepConfig.shortTitle}
                </span>
              </div>
              {index < INFLATION_STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-1 md:mx-2 rounded ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default StepProgress
