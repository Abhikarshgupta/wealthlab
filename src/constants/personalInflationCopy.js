/**
 * User-facing copy for the personal inflation interview.
 * No MoSPI ids, no π, no overlay percents. Helpers stay short + example.
 */

export const INFLATION_STEPS = [
  { number: 1, shortTitle: 'Place', title: 'Where you live' },
  { number: 2, shortTitle: 'Household', title: 'This household' },
  { number: 3, shortTitle: 'Bills', title: 'What moved' },
  { number: 4, shortTitle: 'Your number', title: 'Your inflation' },
]

export const CHAPTER_COPY = {
  1: {
    kicker: 'Step 1 of 3',
    title: 'Where you live',
  },
  2: {
    kicker: 'Step 2 of 3',
    title: 'Your mix',
  },
  3: {
    kicker: 'Step 3 of 3',
    title: 'What jumped this year?',
  },
  4: {
    kicker: 'Your number',
    title: 'Your inflation',
  },
}

export const ROOF_OPTIONS = [
  { id: 'rent', label: 'Yes' },
  { id: 'own_no_emi', label: 'No' },
]

export const WHO_OPTIONS = [
  { id: 'school_1', label: 'One school-age child' },
  { id: 'school_2plus', label: 'Two or more school-age children' },
  { id: 'coaching_or_college', label: 'Coaching or college — you, a partner, or a child' },
  { id: 'elder_in_care', label: 'An elder we support' },
  { id: 'help_paid', label: 'Paid help, nanny, or creche' },
  { id: 'pet', label: 'A pet' },
]

export const COMMUTE_OPTIONS = [
  { id: 'car', label: 'Car' },
  { id: 'ridehail_transit', label: 'Cabs / metro / bus' },
  { id: 'mix', label: 'Mix' },
]

export const DINING_OPTIONS = [
  { id: 'home', label: 'Mostly cook at home' },
  { id: 'regular_out', label: 'Eat out / order in often' },
  { id: 'out_and_travel', label: 'Eating out and trips are a big part of the year' },
]

export const CAM_OPTIONS = [
  { id: 'cam_no', label: 'No' },
  { id: 'cam_yes', label: 'Yes' },
]

export const CARE_OPTIONS = [
  { id: 'care_public_esi', label: 'Public' },
  { id: 'care_private', label: 'Private' },
]

export const PREM_OPTIONS = [
  { id: 'prem_none', label: 'No' },
  { id: 'prem_retail', label: 'Yes' },
]

export const PREM_TOPUP_NOTE =
  'If you have a large super top-up (say ₹1 crore), big hospital bills for illness often sit on that cover. This number still does not include optional care that insurance usually skips — dental, cosmetics, and similar.'

export const USUAL_JUMPED = [
  { id: 'usual', label: 'No' },
  { id: 'jumped', label: 'Yes' },
]

export const HOME_INFLATION_POINTS = [
  {
    title: 'Your mix, not the national average',
    body: 'Published inflation is one basket. Yours depends on rent, school, and how you get around.',
  },
  {
    title: 'Three short pages, no rupees',
    body: 'City, household, then which bills jumped. We never ask income, PAN, or monthly spend.',
  },
  {
    title: 'Then use it in calculators',
    body: 'You can apply your number to SIPs and the rest — or keep the planning default.',
  },
]

export const PUBLISHED_INFLATION_LINKS = [
  {
    label: 'CPI press note (July 2026, provisional)',
    href: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298247',
    note: 'The all-India Combined headline we show as published inflation.',
  },
  {
    label: 'CPI tables (eSankhyiki)',
    href: 'https://esankhyiki.mospi.gov.in/',
    note: 'State urban and item tables used for category price changes.',
  },
  {
    label: 'Household consumption survey 2023–24',
    href: 'https://www.mospi.gov.in/sites/default/files/publication_reports/HCES%20FactSheet%202023-24.pdf',
    note: 'Typical spending shares to start the mix — not the published rate itself.',
  },
]

export const vintageMonthLabel = (month) => {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return 'July 2026'
  const [year, mm] = month.split('-')
  const names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${names[Number(mm) - 1]} ${year}`
}
