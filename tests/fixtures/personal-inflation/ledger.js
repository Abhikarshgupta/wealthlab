/** Chart of accounts — engine PRD §2. Used by permutation invariants. */

export const ACCOUNT_IDS = [
  'food',
  'rent',
  'dwelling',
  'utilities',
  'help',
  'health_care',
  'health_prem',
  'motor_run',
  'passenger',
  'vehicles',
  'education',
  'restaurants',
  'pet',
  'residual',
  'jewellery',
  'motor_prem',
]

export const URBAN_OFFICIAL_PI = {
  food: 5.05,
  rent: 1.96,
  dwelling: 3.18,
  utilities: 1.98,
  help: 1.77,
  health_care: 1.37,
  motor_run: 7.37,
  passenger: 3.01,
  education: 4.17,
  restaurants: 7.71,
  pet: 3.96,
  residual: 3.96,
}

/** Combined group YoYs must never appear as personal-mix official π_i (V0). */
export const COMBINED_GROUP_PI = {
  food: 5.52,
  rent: 2.11,
  dwelling: 3.4,
  utilities: 2.16,
  help: 1.87,
  health_care: 1.34,
  motor_run: 7.36,
  passenger: 2.9,
  education: 3.64,
  restaurants: 7.75,
}

export const LIVED_SEEDS = {
  rent: 12,
  cam: 8,
  education: 8,
  elderCare: 10.8,
  help: 8,
  health_prem: 10.8,
  motor_prem: 10,
  pet: 5,
}

export const STATE_URBAN_HEADLINE = {
  Karnataka: 4.37,
  'Uttar Pradesh': 3.62,
  Assam: 2.53,
}

export const PI_STORAGE_KEY = 'wealthlab-personal-inflation'
export const PI_HISTORY_KEY = 'wealthlab-personal-inflation-history'
export const PREFERENCES_STORAGE_KEY = 'user-preferences-storage'

export const sumW = (w = {}) =>
  ACCOUNT_IDS.reduce((sum, id) => sum + (Number(w[id]) || 0), 0)

export const quietLived = ({ roof, cam, who, commute }) => ({
  rent: roof === 'rent' || roof === 'rent_and_emi' ? 'usual' : null,
  cam: cam === 'yes' ? 'usual' : null,
  schoolFees: who?.school && who.school !== 'none' ? 'usual' : null,
  coachingFees: who?.coaching ? 'usual' : null,
  elderCare: who?.elder ? 'usual' : null,
  helpCosts: who?.help ? 'usual' : null,
  petCosts: who?.pet ? 'usual' : null,
  motorPrem: commute === 'car' ? 'usual' : null,
})

export const basePersona = (overrides = {}) => {
  const who = {
    school: 'none',
    coaching: false,
    elder: false,
    help: false,
    pet: false,
    ...overrides.who,
  }
  const roof = overrides.roof ?? 'own_no_emi'
  const cam = overrides.cam ?? 'no'
  const commute = overrides.commute ?? 'mix'
  return {
    geo: { cityId: 'lucknow', stateUt: 'Uttar Pradesh' },
    roof,
    who,
    commute,
    dining: overrides.dining ?? 'home',
    cam,
    care: overrides.care ?? 'public_esi',
    premRetail: overrides.premRetail ?? false,
    premJump: overrides.premJump ?? [],
    lived: overrides.lived ?? quietLived({ roof, cam, who, commute }),
    ...omit(overrides, ['who', 'lived']),
  }
}

function omit(obj, keys) {
  const next = { ...obj }
  keys.forEach((key) => {
    delete next[key]
  })
  return next
}
