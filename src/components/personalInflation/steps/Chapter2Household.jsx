import ChapterIntro from '../ChapterIntro'
import ChipGroup from '../ChipGroup'
import InterviewNav from '../InterviewNav'
import RadioCardGroup from '../RadioCardGroup'
import {
  CAM_OPTIONS,
  CHAPTER_COPY,
  COMMUTE_OPTIONS,
  DINING_OPTIONS,
  ROOF_OPTIONS,
  WHO_OPTIONS,
} from '@/constants/personalInflationCopy'
import { isRenterRoof } from '@/utils/personalInflationBeats'

const whoToIds = (who) => {
  const ids = []
  if (who.school === '1') ids.push('school_1')
  if (who.school === '2plus') ids.push('school_2plus')
  if (who.coaching) ids.push('coaching_or_college')
  if (who.elder) ids.push('elder_in_care')
  if (who.help) ids.push('help_paid')
  if (who.pet) ids.push('pet')
  return ids
}

const roofValue = (roof) => {
  if (!roof) return null
  return isRenterRoof(roof) ? 'rent' : 'own_no_emi'
}

const Chapter2Household = ({
  answers,
  onRoof,
  onWhoToggle,
  onCommute,
  onDining,
  onCam,
  onPrevious,
  onNext,
  isValid,
  validationErrors,
}) => {
  const copy = CHAPTER_COPY[2]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <ChapterIntro {...copy} />

      <RadioCardGroup
        legend="Do you pay rent?"
        hint="Rent is a large slice of a renter’s year. Published rent inflation is about 2%; a jump year we count about 12% on rent only. EMI is loan repayment, not a price."
        name="roof"
        options={ROOF_OPTIONS}
        value={roofValue(answers.roof)}
        onChange={onRoof}
        columns={2}
      />

      {answers.roof && (
        <RadioCardGroup
          legend="Do you pay society or maintenance?"
          hint="Society, parking, tanker. Published about 3%; a jump year about 8% on that slice."
          name="cam"
          options={CAM_OPTIONS}
          value={answers.cam === 'yes' ? 'cam_yes' : answers.cam === 'no' ? 'cam_no' : null}
          onChange={(id) => onCam(id === 'cam_yes' ? 'yes' : 'no')}
          columns={2}
        />
      )}

      <ChipGroup
        legend="Who else is in this mix?"
        hint="Tick every chip that fits. School: pick one count. A pet is food, vet, and insurance — we ask if those jumped (about 5% on about 10% of living). Skip chips if it is just you or a partner."
        options={WHO_OPTIONS}
        selectedIds={whoToIds(answers.who)}
        onToggle={onWhoToggle}
      />

      <RadioCardGroup
        legend="How do you get around?"
        hint="Running a car (fuel, service) is about 7% in the index this year. Cabs and metro are about 3%."
        name="commute"
        options={COMMUTE_OPTIONS}
        value={answers.commute}
        onChange={onCommute}
        columns={3}
      />

      <RadioCardGroup
        legend="Eating out?"
        hint="Restaurants in the index are about 8% this year. More eating out gives that line a bigger slice of your number."
        name="dining"
        options={DINING_OPTIONS}
        value={answers.dining}
        onChange={onDining}
      />

      <InterviewNav
        onPrevious={onPrevious}
        onNext={onNext}
        isValid={isValid}
        validationErrors={validationErrors}
        nextLabel="Continue to bills"
      />
    </div>
  )
}

export default Chapter2Household
