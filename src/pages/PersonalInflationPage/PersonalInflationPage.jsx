import { useEffect } from 'react'
import usePersonalInflationStore from '@/store/personalInflationStore'
import StepProgress from '@/components/personalInflation/StepProgress'
import Chapter1Place from '@/components/personalInflation/steps/Chapter1Place'
import Chapter2Household from '@/components/personalInflation/steps/Chapter2Household'
import Chapter3WhatMoved from '@/components/personalInflation/steps/Chapter3WhatMoved'
import Chapter4ResultsStub from '@/components/personalInflation/steps/Chapter4ResultsStub'
import {
  chapterValidationErrors,
  isChapter1Valid,
  isChapter2Valid,
  isChapter3Valid,
} from '@/utils/personalInflationBeats'

const PersonalInflationPage = () => {
  const {
    currentStep,
    answers,
    completedThrough,
    setCurrentStep,
    setCity,
    setStateUt,
    setRoof,
    toggleWho,
    setCommute,
    setDining,
    setCam,
    setCare,
    setPremRetail,
    togglePremJump,
    clearPremJump,
    setLived,
    markChapterComplete,
    reset,
  } = usePersonalInflationStore()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const ch1 = isChapter1Valid(answers)
  const ch2 = isChapter2Valid(answers)
  const ch3 = isChapter3Valid(answers)

  const go = (step) => {
    if (step === 1) setCurrentStep(1)
    if (step === 2 && (currentStep >= 2 || ch1)) setCurrentStep(2)
    if (step === 3 && (currentStep >= 3 || (ch1 && ch2))) setCurrentStep(3)
    if (step === 4 && ch1 && ch2 && ch3 && (currentStep >= 3 || completedThrough >= 3)) {
      setCurrentStep(4)
    }
  }

  const handleNextFrom1 = () => {
    if (!ch1) return
    markChapterComplete(1)
    setCurrentStep(2)
  }

  const handleNextFrom2 = () => {
    if (!ch2) return
    markChapterComplete(2)
    setCurrentStep(3)
  }

  const handleNextFrom3 = () => {
    if (!ch3) return
    markChapterComplete(3)
    setCurrentStep(4)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        className={`mx-auto px-4 sm:px-6 pt-6 pb-16 ${
          currentStep === 4 ? 'max-w-2xl lg:max-w-6xl' : 'max-w-2xl'
        }`}
      >
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            What’s my inflation?
          </h1>
        </header>

        <StepProgress
          currentStep={currentStep}
          completedThrough={completedThrough}
          onStepClick={go}
          canOpenResults={ch1 && ch2 && ch3 && (currentStep >= 3 || completedThrough >= 3)}
        />

        {currentStep === 1 && (
          <Chapter1Place
            answers={answers}
            onCity={(id) => (id ? setCity(id) : setCity(null))}
            onState={setStateUt}
            onNext={handleNextFrom1}
            isValid={ch1}
            validationErrors={chapterValidationErrors(1, answers)}
          />
        )}

        {currentStep === 2 && (
          <Chapter2Household
            answers={answers}
            onRoof={setRoof}
            onWhoToggle={toggleWho}
            onCommute={setCommute}
            onDining={setDining}
            onCam={setCam}
            onPrevious={() => setCurrentStep(1)}
            onNext={handleNextFrom2}
            isValid={ch2}
            validationErrors={chapterValidationErrors(2, answers)}
          />
        )}

        {currentStep === 3 && (
          <Chapter3WhatMoved
            answers={answers}
            onCare={setCare}
            onPremRetail={setPremRetail}
            onTogglePremJump={togglePremJump}
            onClearPremJump={clearPremJump}
            onLived={setLived}
            onPrevious={() => setCurrentStep(2)}
            onNext={handleNextFrom3}
            isValid={ch3}
            validationErrors={chapterValidationErrors(3, answers)}
          />
        )}

        {currentStep === 4 && (
          <Chapter4ResultsStub
            onPrevious={() => setCurrentStep(3)}
            onStartOver={() => {
              reset()
              setCurrentStep(1)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default PersonalInflationPage
