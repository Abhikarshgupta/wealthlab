import ChapterIntro from '../ChapterIntro'
import ChipGroup from '../ChipGroup'
import InterviewNav from '../InterviewNav'
import RadioCardGroup from '../RadioCardGroup'
import {
  CARE_OPTIONS,
  CHAPTER_COPY,
  PREM_OPTIONS,
  PREM_TOPUP_NOTE,
  USUAL_JUMPED,
} from '@/constants/personalInflationCopy'
import { getPremWhoRoles, getUnlockedBeats } from '@/utils/personalInflationBeats'

const BEAT_COPY = {
  lease: {
    legend: 'Did rent jump this year?',
    hint: 'No = about 2% (published). Yes = about 12% on rent only. A cheaper new lease is still No.',
  },
  cam: {
    legend: 'Did society or maintenance jump this year?',
    hint: 'No = about 3%. Yes = about 8% on that slice.',
  },
  school: {
    legend: 'Did school fees jump this year?',
    hint: 'A normal yearly hike is No (about 4%). A clear extra jump is Yes (about 8% on education).',
  },
  coach: {
    legend: 'Did coaching or college fees jump this year?',
    hint: 'Same education line as school — about 4% usual, about 8% if it jumped.',
  },
  elder: {
    legend: 'Did elder-care bills jump this year?',
    hint: 'Clinic inflation in the index is about 1.4%. A jump year about 11% on that slice.',
  },
  help: {
    legend: 'Did help, nanny, or creche costs jump this year?',
    hint: 'No = about 2%. Yes = about 8% on that slice.',
  },
  motor: {
    legend: 'Did car insurance jump this year?',
    hint: 'The policy premium, not petrol. A jump is about 10% on a small premium slice.',
  },
  pet: {
    legend: 'Did pet costs jump this year?',
    hint: 'Food, vet, insurance. We count pet care as about 10% of living costs. No = leftover inflation on that slice (~4%). Yes = about 5% on pet care. You can change both on the next page.',
  },
}

const livedKey = {
  lease: 'rent',
  cam: 'cam',
  school: 'schoolFees',
  coach: 'coachingFees',
  elder: 'elderCare',
  help: 'helpCosts',
  pet: 'petCosts',
  motor: 'motorPrem',
}

const Chapter3WhatMoved = ({
  answers,
  onCare,
  onPremRetail,
  onTogglePremJump,
  onClearPremJump,
  onLived,
  onPrevious,
  onNext,
  isValid,
  validationErrors,
}) => {
  const copy = CHAPTER_COPY[3]
  const beats = getUnlockedBeats(answers)
  const roles = getPremWhoRoles(answers)
  const livedBeats = beats.filter(
    (beat) => beat.id !== 'care' && beat.id !== 'prem' && beat.id !== 'premWho'
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <ChapterIntro {...copy} />

      <RadioCardGroup
        legend="Where do you usually get treated?"
        hint="Private care is a bigger slice of the year. Clinic inflation in the index is about 1.4%; a jump year we use about 11% on that slice."
        name="care"
        options={CARE_OPTIONS}
        value={answers.care}
        onChange={onCare}
        columns={2}
      />

      <RadioCardGroup
        legend="Do you have a health policy you pay for?"
        hint="A policy from work does not count. Premiums are not in the published index; if yours jumped we use about 11% on a small premium slice."
        name="prem"
        options={PREM_OPTIONS}
        value={
          answers.premRetail === true
            ? 'prem_retail'
            : answers.premRetail === false
              ? 'prem_none'
              : null
        }
        onChange={(id) => onPremRetail(id === 'prem_retail')}
        columns={2}
      />

      {answers.premRetail && (
        <p className="text-sm text-gray-600 dark:text-gray-400 -mt-4 mb-8 leading-relaxed">
          {PREM_TOPUP_NOTE}
        </p>
      )}

      {answers.premRetail && (
        <ChipGroup
          legend="Whose premium jumped this year?"
          hint="Leave empty if none jumped."
          options={[...roles, { id: 'none', label: 'None jumped' }]}
          selectedIds={
            answers.premJump?.length === 0
              ? ['none']
              : answers.premJump || []
          }
          onToggle={(id) => {
            if (id === 'none') onClearPremJump()
            else onTogglePremJump(id)
          }}
        />
      )}

      {livedBeats.map((beat) => {
        const key = livedKey[beat.id]
        const meta = BEAT_COPY[beat.id]
        const options = USUAL_JUMPED
        return (
          <RadioCardGroup
            key={beat.id}
            legend={meta.legend}
            hint={meta.hint}
            name={beat.id}
            options={options}
            value={answers.lived?.[key]}
            onChange={(id) => onLived(key, id)}
            columns={2}
          />
        )
      })}

      <InterviewNav
        onPrevious={onPrevious}
        onNext={onNext}
        isValid={isValid}
        validationErrors={validationErrors}
        nextLabel="See your inflation"
      />
    </div>
  )
}

export default Chapter3WhatMoved
