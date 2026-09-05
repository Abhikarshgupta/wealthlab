import ChapterIntro from '../ChapterIntro'
import CitySelect from '../CitySelect'
import InterviewNav from '../InterviewNav'
import { CHAPTER_COPY } from '@/constants/personalInflationCopy'

const Chapter1Place = ({
  answers,
  onCity,
  onState,
  onNext,
  isValid,
  validationErrors,
}) => {
  const copy = CHAPTER_COPY[1]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <ChapterIntro {...copy} />
      <CitySelect
        cityId={answers.geo?.cityId}
        stateUt={answers.geo?.stateUt}
        onCity={onCity}
        onState={onState}
      />
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Saved on this device. No income, PAN, or rupee amounts.
      </p>
      <InterviewNav
        showPrevious={false}
        onNext={onNext}
        isValid={isValid}
        validationErrors={validationErrors}
        nextLabel="Continue to household"
      />
    </div>
  )
}

export default Chapter1Place
