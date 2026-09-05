/**
 * Engine PRD §4–6 — baseline pies and Chapter 2 modifier deltas (pp, pre-clamp).
 * Used by PI-26/27/34/35 unit contract tests. Renorm may shift absolute shares.
 */

export const OWNER_CASH_BASE = {
  food: 34,
  rent: 0,
  dwelling: 4,
  utilities: 8,
  help: 2,
  health_care: 6,
  health_prem: 0,
  motor_run: 6,
  passenger: 4,
  vehicles: 0,
  education: 5,
  restaurants: 4,
  pet: 0,
  residual: 27,
  jewellery: 0,
  motor_prem: 0,
}

export const RENTER_BASE = {
  food: 30,
  rent: 32,
  dwelling: 4,
  utilities: 7,
  help: 2,
  health_care: 5,
  health_prem: 0,
  motor_run: 3,
  passenger: 6,
  vehicles: 0,
  education: 4,
  restaurants: 4,
  pet: 0,
  residual: 3,
  jewellery: 0,
  motor_prem: 0,
}

/** §8.1 account caps (max %). */
export const ACCOUNT_CAPS = {
  food: 55,
  rent: 45,
  dwelling: 12,
  utilities: 18,
  help: 10,
  health_care: 14,
  motor_run: 18,
  passenger: 22,
  education: 22,
  restaurants: 14,
  pet: 25,
  residual: 45,
  jewellery: 0,
  health_prem: 4,
  motor_prem: 3,
}

/** Each §6 trigger: deltas on accounts (pp before clamp). */
export const CHAPTER2_TRIGGERS = [
  {
    id: 'school_1',
    persona: { who: { school: '1' } },
    deltas: { education: 4 },
    compareQuiet: (quiet, out) => out.w.education > quiet.w.education,
  },
  {
    id: 'school_2plus',
    persona: { who: { school: '2plus' } },
    deltas: { education: 8 },
    compareQuiet: (quiet, out) => out.w.education > quiet.w.education,
  },
  {
    id: 'coaching',
    persona: { who: { coaching: true } },
    deltas: { education: 3 },
    compareQuiet: (quiet, out) => out.w.education > quiet.w.education,
  },
  {
    id: 'elder',
    persona: { who: { elder: true } },
    deltas: { health_care: 3 },
    compareQuiet: (quiet, out) => out.w.health_care > quiet.w.health_care,
  },
  {
    id: 'help',
    persona: { who: { help: true } },
    deltas: { help: 4 },
    compareQuiet: (quiet, out) => out.w.help > quiet.w.help,
  },
  {
    id: 'pet',
    persona: { who: { pet: true } },
    deltas: { pet: 10, food: -10 },
    compareQuiet: (quiet, out) =>
      out.w.pet > quiet.w.pet &&
      out.w.food < quiet.w.food &&
      out.w.health_care === quiet.w.health_care &&
      out.pi_i_official.health_care === quiet.pi_i_official.health_care,
  },
  {
    id: 'car',
    persona: { commute: 'car' },
    deltas: { motor_run: 6, passenger: -3 },
    compareQuiet: (quiet, out) =>
      out.w.motor_run > quiet.w.motor_run && out.w.passenger < quiet.w.passenger,
  },
  {
    id: 'ridehail',
    persona: { commute: 'ridehail_transit' },
    deltas: { passenger: 8, motor_run: -4 },
    compareQuiet: (quiet, out) =>
      out.w.passenger > quiet.w.passenger && out.w.motor_run < quiet.w.motor_run,
  },
  {
    id: 'regular_out',
    persona: { dining: 'regular_out' },
    deltas: { restaurants: 4 },
    compareQuiet: (quiet, out) => out.w.restaurants > quiet.w.restaurants,
  },
  {
    id: 'out_and_travel',
    persona: { dining: 'out_and_travel' },
    deltas: { restaurants: 4, passenger: 3 },
    compareQuiet: (quiet, out) =>
      out.w.restaurants > quiet.w.restaurants && out.w.passenger > quiet.w.passenger,
  },
  {
    id: 'cam_yes',
    persona: { cam: 'yes' },
    deltas: { dwelling: 4 },
    compareQuiet: (quiet, out) => out.w.dwelling > quiet.w.dwelling,
  },
  {
    id: 'private_care',
    persona: { care: 'private' },
    deltas: { health_care: 2 },
    compareQuiet: (quiet, out) => out.w.health_care > quiet.w.health_care,
  },
]
