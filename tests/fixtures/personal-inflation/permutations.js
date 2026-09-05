import { basePersona, quietLived } from './ledger.js'

export const ROOFS = ['rent', 'own_no_emi', 'emi']
export const SCHOOLS = ['none', '1', '2plus']
export const BOOLS = [false, true]
export const COMMUTES = ['car', 'ridehail_transit', 'mix']
export const DININGS = ['home', 'regular_out', 'out_and_travel']
export const CAMS = ['no', 'yes']
export const CARES = ['public_esi', 'private']

/**
 * Every Chapter 2 discrete combination (lived = usual / null, no prem jump).
 * 3×3×2^4×3×3×2×2×2 = 10,368 personas.
 */
export function eachHouseholdMix() {
  const personas = []
  for (const roof of ROOFS) {
    for (const school of SCHOOLS) {
      for (const coaching of BOOLS) {
        for (const elder of BOOLS) {
          for (const help of BOOLS) {
            for (const pet of BOOLS) {
              for (const commute of COMMUTES) {
                for (const dining of DININGS) {
                  for (const cam of CAMS) {
                    for (const care of CARES) {
                      for (const premRetail of BOOLS) {
                        const who = { school, coaching, elder, help, pet }
                        personas.push(
                          basePersona({
                            roof,
                            who,
                            commute,
                            dining,
                            cam,
                            care,
                            premRetail,
                            premJump: [],
                            lived: quietLived({ roof, cam, who, commute }),
                          })
                        )
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return personas
}

function powerSet(items) {
  const out = [[]]
  for (const item of items) {
    const next = out.map((subset) => [...subset, item])
    out.push(...next)
  }
  return out
}

export function premJumpSubsets(persona) {
  if (!persona.premRetail) return [[]]
  const roles = ['self']
  if (persona.who.school !== 'none' || persona.who.coaching) roles.push('child')
  if (persona.who.elder) roles.push('elder')
  return powerSet(roles)
}

const LIVED_BITS = [
  { key: 'rent', usual: 'usual', jumped: 'jumped', when: (p) => p.roof === 'rent' || p.roof === 'rent_and_emi' },
  { key: 'cam', usual: 'usual', jumped: 'jumped', when: (p) => p.cam === 'yes' },
  { key: 'schoolFees', usual: 'usual', jumped: 'jumped', when: (p) => p.who.school !== 'none' },
  { key: 'coachingFees', usual: 'usual', jumped: 'jumped', when: (p) => p.who.coaching },
  { key: 'elderCare', usual: 'usual', jumped: 'jumped', when: (p) => p.who.elder },
  { key: 'helpCosts', usual: 'usual', jumped: 'jumped', when: (p) => p.who.help },
  { key: 'motorPrem', usual: 'usual', jumped: 'jumped', when: (p) => p.commute === 'car' },
]

/** All lived-flag × valid premJump combinations for one household. */
export function eachLivedAndPremCombo(persona) {
  const bits = LIVED_BITS.filter((bit) => bit.when(persona))
  const n = bits.length
  const total = 1 << n
  const premSets = premJumpSubsets(persona)
  const out = []
  for (let mask = 0; mask < total; mask += 1) {
    const lived = { ...quietLived(persona) }
    for (let i = 0; i < n; i += 1) {
      const on = (mask >> i) & 1
      lived[bits[i].key] = on ? bits[i].jumped : bits[i].usual
    }
    for (const premJump of premSets) {
      out.push({ ...persona, lived, premJump })
    }
  }
  return out
}

export const MAX_UNLOCK_PERSONA = basePersona({
  geo: { cityId: 'lucknow', stateUt: 'Uttar Pradesh' },
  roof: 'rent',
  who: { school: '2plus', coaching: true, elder: true, help: true, pet: true },
  commute: 'car',
  dining: 'out_and_travel',
  cam: 'yes',
  care: 'private',
  premRetail: true,
  premJump: [],
})

export const OVERLAY_SHARE_SAMPLES = [12, 20, 32, 40, 45]
export const OVERLAY_RATE_SAMPLES = [1, 8, 12, 25]
