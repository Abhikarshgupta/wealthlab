/**
 * Personal inflation engine — T3 RED.
 * Golden IDs + full Chapter-2 cartesian + lived×premJump cartesian.
 * Do not implement the engine to make these pass.
 */

import { describe, it, expect } from 'vitest'
import goldenCases from '../../tests/fixtures/golden/personal-inflation.json'
import adversarial from '../../tests/fixtures/adversarial/personal-inflation.json'
import { loadPiEngine } from '../../tests/fixtures/personal-inflation/loadEngine.js'
import {
  ACCOUNT_IDS,
  URBAN_OFFICIAL_PI,
  COMBINED_GROUP_PI,
  LIVED_SEEDS,
  STATE_URBAN_HEADLINE,
  sumW,
  basePersona,
} from '../../tests/fixtures/personal-inflation/ledger.js'
import {
  eachHouseholdMix,
  eachLivedAndPremCombo,
  MAX_UNLOCK_PERSONA,
  OVERLAY_SHARE_SAMPLES,
  OVERLAY_RATE_SAMPLES,
} from '../../tests/fixtures/personal-inflation/permutations.js'
import {
  CHAPTER2_TRIGGERS,
  ACCOUNT_CAPS,
  OWNER_CASH_BASE,
} from '../../tests/fixtures/personal-inflation/modifierExpectations.js'

const findGolden = (id) => goldenCases.find((row) => row.id === id)

const within = (actual, expected, tolerance) => Math.abs(actual - expected) <= tolerance

const assertLedger = (out, persona, label) => {
  expect(out, label).toBeTruthy()
  expect(sumW(out.w), `${label} Σw`).toBeCloseTo(100, 3)
  expect(out.w.jewellery).toBe(0)
  expect(out.w.vehicles).toBe(0)
  if (!persona.premJump?.length) {
    expect(out.w.health_prem).toBe(0)
  }
  if (persona.roof !== 'rent') {
    expect(out.w.rent, `${label} owner rent`).toBe(0)
  }
  expect(out.pi_i_official.food).toBe(URBAN_OFFICIAL_PI.food)
  expect(out.pi_i_official.food).not.toBe(COMBINED_GROUP_PI.food)
  expect(out.pi_i_official.rent).toBe(URBAN_OFFICIAL_PI.rent)
  expect(out.vintage.month).toBe('2026-07')
  expect(out.contrast.combined).toBe(4.45)
  expect(out.contrast.allIndiaUrban).toBe(3.96)
}

describe('personal inflation engine — golden freeze', () => {
  it('PI-20: quiet owner estimate equals official-weighted 4.2689', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = findGolden('PI-20')
    const out = computePersonalInflation(row.inputs)
    expect(within(out.pi_official_weighted, row.expected.pi_official_weighted, row.expected.tolerance)).toBe(
      true
    )
    expect(within(out.pi_your_estimate, row.expected.pi_your_estimate, row.expected.tolerance)).toBe(true)
    expect(out.w.rent).toBe(0)
    expect(out.w.jewellery).toBe(0)
    expect(out.contrast.stateUrbanHeadline).toBe(row.expected.contrast.stateUrbanHeadline)
    expect(out.vintage.month).toBe(row.expected.vintageMonth)
  })

  it('PI-21: contrast uses Combined, all-India Urban, and this State Urban headline', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const guwahati = computePersonalInflation(
      basePersona({ geo: { cityId: 'guwahati', stateUt: 'Assam' } })
    )
    expect(guwahati.contrast.combined).toBe(4.45)
    expect(guwahati.contrast.allIndiaUrban).toBe(3.96)
    expect(guwahati.contrast.stateUrbanHeadline).toBe(STATE_URBAN_HEADLINE.Assam)
    expect(guwahati.pi_i_official.food).toBe(URBAN_OFFICIAL_PI.food)
  })

  it('PI-22: quiet renter sitting — both books 3.3686 and rent π 1.96', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = findGolden('PI-22')
    const out = computePersonalInflation(row.inputs)
    expect(within(out.pi_official_weighted, row.expected.pi_official_weighted, row.expected.tolerance)).toBe(
      true
    )
    expect(within(out.pi_your_estimate, row.expected.pi_your_estimate, row.expected.tolerance)).toBe(true)
    expect(out.pi_i_official.rent).toBe(row.expected.pi_i_official_rent)
    expect(out.pi_i_estimate.rent).toBe(row.expected.pi_i_estimate_rent)
    expect(out.w.rent).toBe(32)
  })

  it('PI-23: lease reset changes estimate only; official 04.1 stays 1.96', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = findGolden('PI-23')
    const out = computePersonalInflation(row.inputs)
    expect(within(out.pi_official_weighted, row.expected.pi_official_weighted, row.expected.tolerance)).toBe(
      true
    )
    expect(within(out.pi_your_estimate, row.expected.pi_your_estimate, row.expected.tolerance)).toBe(true)
    expect(out.pi_i_official.rent).toBe(1.96)
    expect(out.pi_i_estimate.rent).toBe(12)
    expect(out.flags_applied.rent).toBe('jumped')
  })

  it('PI-24: emi clone of own_no_emi for w and both πs', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const owner = computePersonalInflation(findGolden('PI-20').inputs)
    const emi = computePersonalInflation(findGolden('PI-24').inputs)
    ACCOUNT_IDS.forEach((id) => {
      expect(emi.w[id]).toBeCloseTo(owner.w[id], 4)
    })
    expect(emi.pi_official_weighted).toBeCloseTo(owner.pi_official_weighted, 4)
    expect(emi.pi_your_estimate).toBeCloseTo(owner.pi_your_estimate, 4)
  })

  it('rent + home loan uses the renter mix, not the owner mix', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const renter = computePersonalInflation(findGolden('PI-22').inputs)
    const both = computePersonalInflation({
      ...findGolden('PI-22').inputs,
      roof: 'rent_and_emi',
    })
    expect(both.w.rent).toBe(renter.w.rent)
    expect(both.pi_official_weighted).toBeCloseTo(renter.pi_official_weighted, 4)
    expect(both.pi_official_imputed).toBeNull()
  })

  it('PI-25: Variant A imputed is owners-only and never the apply default', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const owner = computePersonalInflation(findGolden('PI-20').inputs)
    const renter = computePersonalInflation(findGolden('PI-22').inputs)
    expect(owner.pi_official_imputed).not.toBeNull()
    expect(renter.pi_official_imputed).toBeNull()
    expect(owner.pi_your_estimate).not.toBe(owner.pi_official_imputed)
  })

  it('PI-28: retail premium with no jump does not create health_prem slice', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = findGolden('PI-28')
    const out = computePersonalInflation(row.inputs)
    expect(within(out.pi_official_weighted, row.expected.pi_official_weighted, row.expected.tolerance)).toBe(
      true
    )
    expect(out.w.health_prem).toBe(0)
    expect(out.pi_official_weighted).toBeCloseTo(out.pi_your_estimate, 3)
  })

  it('PI-42: jewellery and 07.1 vehicles stay 0', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(findGolden('PI-20').inputs)
    expect(out.w.jewellery).toBe(0)
    expect(out.w.vehicles).toBe(0)
  })
})

describe('personal inflation engine — every household mix (no jumps)', () => {
  it(
    'PI-49: all 10368 Chapter-2 combinations keep Σw=100, jewellery 0, books equal',
    async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const personas = eachHouseholdMix()
    expect(personas.length).toBe(10368)
    const failures = []
    for (const persona of personas) {
      try {
        const out = computePersonalInflation(persona)
        assertLedger(out, persona, JSON.stringify({ roof: persona.roof, who: persona.who, commute: persona.commute }))
        expect(Math.abs(out.pi_your_estimate - out.pi_official_weighted)).toBeLessThan(0.001)
        expect(out.w.health_prem).toBe(0)
        expect(out.w.motor_prem).toBe(0)
      } catch (error) {
        failures.push({ persona, message: error.message })
        if (failures.length >= 12) break
      }
    }
    expect(failures, failures.slice(0, 3).map((f) => f.message).join('\n')).toEqual([])
  },
    30000
  )

  it('PI-24-matrix: every emi household matches the own_no_emi twin', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const failures = []
    for (const persona of eachHouseholdMix()) {
      if (persona.roof !== 'own_no_emi') continue
      const emi = { ...persona, roof: 'emi' }
      try {
        const a = computePersonalInflation(persona)
        const b = computePersonalInflation(emi)
        ACCOUNT_IDS.forEach((id) => expect(a.w[id]).toBeCloseTo(b.w[id], 4))
        expect(a.pi_official_weighted).toBeCloseTo(b.pi_official_weighted, 4)
        expect(a.pi_your_estimate).toBeCloseTo(b.pi_your_estimate, 4)
      } catch (error) {
        failures.push(error.message)
        if (failures.length >= 8) break
      }
    }
    expect(failures).toEqual([])
  }, 30000)
})

describe('personal inflation engine — lived × premJump cartesian', () => {
  it('PI-33: every unlocked jump combo on max household; official frozen vs all-usual twin', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const combos = eachLivedAndPremCombo(MAX_UNLOCK_PERSONA)
    expect(combos.length).toBeGreaterThan(200)
    const baseline = computePersonalInflation({
      ...MAX_UNLOCK_PERSONA,
      premJump: [],
      lived: {
        rent: 'usual',
        cam: 'usual',
        schoolFees: 'usual',
        coachingFees: 'usual',
        elderCare: 'usual',
        helpCosts: 'usual',
        motorPrem: 'usual',
      },
    })
    const failures = []
    for (const persona of combos) {
      try {
        const out = computePersonalInflation(persona)
        assertLedger(out, persona, 'lived combo')
        expect(out.pi_official_weighted).toBeCloseTo(baseline.pi_official_weighted, 3)
        expect(out.pi_i_official.rent).toBe(URBAN_OFFICIAL_PI.rent)
        expect(out.pi_i_official.education).toBe(URBAN_OFFICIAL_PI.education)
        if (persona.lived.rent === 'jumped') {
          expect(out.pi_i_estimate.rent).toBe(LIVED_SEEDS.rent)
        }
        if (persona.lived.schoolFees === 'jumped' || persona.lived.coachingFees === 'jumped') {
          expect(out.pi_i_estimate.education).toBe(LIVED_SEEDS.education)
        }
        if (persona.premJump.length > 0) {
          expect(out.w.health_prem).toBeCloseTo(2, 3)
          expect(out.pi_i_estimate.health_prem).toBe(LIVED_SEEDS.health_prem)
          expect(out.pi_i_official.health_prem ?? 0).toBe(0)
        }
      } catch (error) {
        failures.push(error.message)
        if (failures.length >= 12) break
      }
    }
    expect(failures, failures.slice(0, 5).join('\n')).toEqual([])
  }, 20000)

  it('PI-31: school + coaching both jumped is still one education lived rate', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const persona = basePersona({
      roof: 'own_no_emi',
      who: { school: '1', coaching: true },
      lived: {
        rent: null,
        cam: null,
        schoolFees: 'jumped',
        coachingFees: 'jumped',
        elderCare: null,
        helpCosts: null,
        motorPrem: null,
      },
    })
    const out = computePersonalInflation(persona)
    expect(out.pi_i_estimate.education).toBe(8)
    expect(out.pi_i_official.education).toBe(4.17)
  })

  it('PI-29 / PI-30: premia slices only on estimate; motor_run stays 7.37 official', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const persona = basePersona({
      commute: 'car',
      premRetail: true,
      premJump: ['self'],
      lived: {
        rent: null,
        cam: null,
        schoolFees: null,
        coachingFees: null,
        elderCare: null,
        helpCosts: null,
        motorPrem: 'jumped',
      },
    })
    const out = computePersonalInflation(persona)
    expect(out.pi_i_official.motor_run).toBe(7.37)
    expect(out.pi_i_estimate.motor_run).toBe(7.37)
    expect(out.w.motor_prem).toBeCloseTo(1.5, 3)
    expect(out.pi_i_estimate.motor_prem).toBe(10)
    expect(out.w.health_prem).toBeCloseTo(2, 3)
  })
})

describe('personal inflation engine — overlay permutations', () => {
  it('PI-40: rent share samples re-sum to 100; flags and official π_i frozen', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const persona = findGolden('PI-23').inputs
    const seeded = computePersonalInflation(persona)
    for (const rentShare of OVERLAY_SHARE_SAMPLES) {
      const out = computePersonalInflation(persona, { w: { rent: rentShare } })
      expect(sumW(out.w)).toBeCloseTo(100, 3)
      expect(out.w.rent).toBeCloseTo(rentShare, 3)
      expect(out.flags_applied.rent).toBe('jumped')
      expect(out.pi_i_official.rent).toBe(1.96)
      expect(out.w_source).toBe('user_overlay')
      expect(out.pi_your_estimate).not.toBe(seeded.pi_your_estimate)
    }
  })

  it('PI-41: went-up samples 1–25 on rent; official book unchanged; 26 rejected to band', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const persona = findGolden('PI-23').inputs
    const seeded = computePersonalInflation(persona)
    for (const rate of OVERLAY_RATE_SAMPLES) {
      const out = computePersonalInflation(persona, { pi_i_estimate: { rent: rate } })
      expect(out.pi_i_estimate.rent).toBe(rate)
      expect(out.pi_i_official.rent).toBe(seeded.pi_i_official.rent)
      expect(out.pi_official_weighted).toBeCloseTo(seeded.pi_official_weighted, 3)
      expect(out.pi_source).toBe('user_rate_overlay')
    }
    const clamped = computePersonalInflation(persona, { pi_i_estimate: { rent: 26 } })
    expect(clamped.pi_i_estimate.rent).toBeLessThanOrEqual(25)
    expect(clamped.pi_i_estimate.rent).toBeGreaterThanOrEqual(1)
  })

  it('PI-43: owner overlay cannot raise rent share', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(findGolden('PI-20').inputs, { w: { rent: 20 } })
    expect(out.w.rent).toBe(0)
  })
})

describe('personal inflation engine — repair, caps, apply', () => {
  it('PI-46: orphan lived keys are ignored', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(
      basePersona({
        roof: 'own_no_emi',
        lived: {
          rent: 'reset',
          schoolFees: 'jumped',
          cam: 'jumped',
          coachingFees: null,
          elderCare: null,
          helpCosts: null,
          motorPrem: null,
        },
      })
    )
    expect(out.pi_i_estimate.rent).toBe(out.pi_i_official.rent)
    expect(out.pi_i_estimate.education).toBe(out.pi_i_official.education)
  })

  it('PI-47: sanity warnings do not clamp π to the 6% planning default', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(findGolden('PI-23').inputs, {
      pi_i_estimate: { food: 25, rent: 25, residual: 25 },
    })
    expect(out.pi_your_estimate).not.toBe(6)
    expect(Array.isArray(out.warnings)).toBe(true)
  })

  it('PI-80: applyYourEstimate writes estimate only into InflationToggle prefs', async () => {
    const { computePersonalInflation, applyYourEstimate } = await loadPiEngine()
    const result = computePersonalInflation(findGolden('PI-23').inputs)
    const prefs = applyYourEstimate(result)
    expect(prefs.defaultInflationRate).toBe(6.7)
    expect(prefs.adjustInflation).toBe(true)
    expect(prefs.defaultInflationRate).not.toBeCloseTo(result.pi_official_weighted, 2)
    expect(prefs.defaultInflationRate).not.toBe(result.pi_official_imputed)
  })

  it(`${adversarial[0].id}: null persona does not throw a raw TypeError`, async () => {
    const { computePersonalInflation } = await loadPiEngine()
    expect(() => computePersonalInflation(null)).not.toThrow(TypeError)
  })
})

describe('personal inflation engine — PI-26 Chapter 2 modifiers', () => {
  it('PI-26: each §6 trigger tilts the expected account vs quiet owner', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const quiet = computePersonalInflation(basePersona())
    for (const trigger of CHAPTER2_TRIGGERS) {
      const persona = basePersona(trigger.persona)
      const out = computePersonalInflation(persona)
      expect(sumW(out.w)).toBeCloseTo(100, 3)
      expect(out.w.jewellery).toBe(0)
      expect(trigger.compareQuiet(quiet, out), trigger.id).toBe(true)
    }
  })

  it('PI-26: school_2plus education share exceeds school_1 (not stacked +12)', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const one = computePersonalInflation(basePersona({ who: { school: '1' } }))
    const two = computePersonalInflation(basePersona({ who: { school: '2plus' } }))
    expect(two.w.education).toBeGreaterThan(one.w.education)
    expect(two.w.education - one.w.education).toBeLessThan(8)
  })
})

describe('personal inflation engine — PI-27 education cap', () => {
  it('PI-27: school_2plus + coaching keeps education ≤ 22 and jewellery 0', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = findGolden('PI-27')
    const out = computePersonalInflation(row.inputs)
    expect(out.w.education).toBeLessThanOrEqual(row.expected.education_w_max)
    expect(out.w.jewellery).toBe(row.expected.jewellery_w)
    expect(sumW(out.w)).toBeCloseTo(row.expected.sum_w, 3)
  })

  it('PI-27: overlay cannot push education above cap', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const persona = findGolden('PI-27').inputs
    const out = computePersonalInflation(persona, { w: { education: 30 } })
    expect(out.w.education).toBeLessThanOrEqual(ACCOUNT_CAPS.education)
    expect(out.w.jewellery).toBe(0)
  })
})

describe('personal inflation engine — PI-32 lived usual', () => {
  it('PI-32: sitting lease keeps rent π official on both books', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const sitting = computePersonalInflation(findGolden('PI-22').inputs)
    expect(sitting.pi_i_estimate.rent).toBe(sitting.pi_i_official.rent)
    expect(sitting.pi_your_estimate).toBeCloseTo(sitting.pi_official_weighted, 3)
  })

  it('PI-32: usual CAM keeps dwelling π official on both books', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const persona = basePersona({
      cam: 'yes',
      lived: {
        rent: null,
        cam: 'usual',
        schoolFees: null,
        coachingFees: null,
        elderCare: null,
        helpCosts: null,
        motorPrem: null,
      },
    })
    const out = computePersonalInflation(persona)
    expect(out.pi_i_estimate.dwelling).toBe(out.pi_i_official.dwelling)
    expect(out.pi_your_estimate).toBeCloseTo(out.pi_official_weighted, 3)
  })
})

describe('personal inflation engine — PI-34 / PI-35', () => {
  it('PI-34: pet is a visible 10% slice at 5%, not a silent health or residual bump', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const quiet = computePersonalInflation(basePersona())
    const pet = computePersonalInflation(basePersona({ who: { pet: true } }))
    expect(pet.w.pet).toBeGreaterThanOrEqual(9)
    expect(pet.w.food).toBeLessThan(quiet.w.food)
    expect(pet.pi_i_estimate.pet).toBe(pet.pi_i_official.pet)
    const jumped = computePersonalInflation(
      basePersona({
        who: { pet: true },
        lived: {
          rent: null,
          cam: null,
          schoolFees: null,
          coachingFees: null,
          elderCare: null,
          helpCosts: null,
          petCosts: 'jumped',
          motorPrem: null,
        },
      })
    )
    expect(jumped.pi_i_estimate.pet).toBe(5)
    expect(jumped.pi_i_official.pet).toBe(3.96)
    expect(pet.pi_i_official.health_care).toBe(quiet.pi_i_official.health_care)
    expect(pet.pi_i_estimate.health_care).toBe(quiet.pi_i_estimate.health_care)
    expect(quiet.w.pet).toBe(0)
  })

  it('PI-35: ride-hail raises passenger share vs quiet owner-car template', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const car = computePersonalInflation(basePersona({ commute: 'car' }))
    const ride = computePersonalInflation(basePersona({ commute: 'ridehail_transit' }))
    expect(ride.w.passenger).toBeGreaterThan(car.w.passenger)
    expect(ride.pi_i_official.passenger).toBe(URBAN_OFFICIAL_PI.passenger)
    expect(ride.pi_i_official.passenger).not.toBe(COMBINED_GROUP_PI.passenger)
  })
})

describe('personal inflation engine — PI-40 golden overlay', () => {
  it('PI-40: golden overlay rent 40 re-sums and freezes official rent π', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = findGolden('PI-40')
    const persona = findGolden('PI-23').inputs
    const seeded = computePersonalInflation(persona)
    const out = computePersonalInflation(persona, row.overlay)
    expect(sumW(out.w)).toBeCloseTo(row.expected.sum_w, 3)
    expect(out.w.rent).toBeCloseTo(row.expected.w_rent, 2)
    expect(out.flags_applied.rent).toBe(row.expected.flags_applied_rent)
    expect(out.pi_i_official.rent).toBe(row.expected.pi_i_official_rent)
    if (row.expected.pi_moves) {
      expect(out.pi_your_estimate).not.toBeCloseTo(seeded.pi_your_estimate, 2)
    }
  })
})

describe('personal inflation engine — PI-44 / PI-45 clamp repair', () => {
  it('PI-44: clamp surplus flows to residual, never jewellery', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const stacked = computePersonalInflation(
      basePersona({
        who: { school: '2plus', coaching: true, elder: true, help: true, pet: true },
        commute: 'car',
        dining: 'out_and_travel',
        cam: 'yes',
        care: 'private',
      })
    )
    expect(stacked.w.jewellery).toBe(0)
    expect(stacked.w.residual).toBeGreaterThan(OWNER_CASH_BASE.residual)
    expect(sumW(stacked.w)).toBeCloseTo(100, 3)
  })

  it('PI-45: extreme overlay triggers warnings when residual would break floor', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(basePersona({ roof: 'rent' }), {
      w: {
        rent: 45,
        food: 45,
        education: 10,
      },
    })
    expect(sumW(out.w)).toBeCloseTo(100, 3)
    expect(Array.isArray(out.warnings)).toBe(true)
    expect(out.warnings.length).toBeGreaterThan(0)
    expect(out.w.residual).toBeGreaterThanOrEqual(0)
    Object.values(out.w).forEach((share) => {
      expect(share).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(share)).toBe(true)
    })
  })

  it('mix overlay keeps integer shares, never negatives, and dumps pet last', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const persona = basePersona({
      roof: 'rent',
      who: { school: 'none', coaching: false, elder: false, help: false, pet: true },
    })
    const seeded = computePersonalInflation(persona)
    const out = computePersonalInflation(persona, { w: { rent: 45 } })
    expect(sumW(out.w)).toBe(100)
    expect(out.w.residual).toBeGreaterThanOrEqual(0)
    expect(out.w.pet).toBeGreaterThan(0)
    expect(out.w.pet).toBeGreaterThanOrEqual(seeded.w.pet)
    expect(out.w.food).toBeGreaterThanOrEqual(6)
    Object.values(out.w).forEach((share) => {
      expect(Number.isInteger(share)).toBe(true)
      expect(share).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('personal inflation engine — PI-48 vintage', () => {
  it('PI-48: ratesVintage month surfaces in output without changing account ids', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(basePersona(), { ratesVintage: '2026-08' })
    expect(out.vintage.month).toBe('2026-08')
    ACCOUNT_IDS.forEach((id) => {
      expect(out.w).toHaveProperty(id)
      expect(out.pi_i_official).toHaveProperty(id)
      expect(out.pi_i_estimate).toHaveProperty(id)
    })
  })
})

describe('personal inflation engine — PI-50 classification refuse', () => {
  it('PI-50: overlay cannot assign jewellery or vehicle purchase weight', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(basePersona(), {
      w: { jewellery: 10, vehicles: 5 },
    })
    expect(out.w.jewellery).toBe(0)
    expect(out.w.vehicles).toBe(0)
    expect(sumW(out.w)).toBeCloseTo(100, 3)
  })

  it('PI-50: w ledger has no EMI / SIP / gold account ids', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(basePersona({ roof: 'emi' }))
    const forbidden = ['emi', 'sip', 'gold', 'home_loan', 'mutual_fund']
    forbidden.forEach((key) => {
      expect(out.w).not.toHaveProperty(key)
    })
  })
})

describe('personal inflation engine — PI-69 results band golden', () => {
  it('PI-69: Lucknow renter reset + school jumped lands in results PRD §5 band', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = findGolden('PI-69')
    const out = computePersonalInflation(row.inputs)
    expect(within(out.pi_your_estimate, row.expected.pi_your_estimate, row.expected.tolerance)).toBe(
      true
    )
    expect(out.pi_i_estimate.rent).toBe(row.expected.pi_i_estimate_rent)
    expect(out.pi_i_estimate.education).toBe(row.expected.pi_i_estimate_education)
    expect(out.pi_i_official.rent).toBe(row.expected.pi_i_official_rent)
    expect(within(out.pi_official_weighted, row.expected.pi_official_weighted, row.expected.tolerance)).toBe(
      true
    )
  })
})

describe('personal inflation engine — adversarial fixtures', () => {
  it('PI-ADV-EMPTY: empty persona returns structured failure, not TypeError', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = adversarial.find((item) => item.id === 'PI-ADV-EMPTY')
    expect(() => computePersonalInflation(row.payload)).not.toThrow(TypeError)
  })

  it('PI-ADV-NAN-OVERLAY: invalid overlay rates are repaired', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = adversarial.find((item) => item.id === 'PI-ADV-NAN-OVERLAY')
    const persona = findGolden('PI-23').inputs
    const out = computePersonalInflation(persona, row.overlay)
    expect(Number.isFinite(out.pi_i_estimate.rent)).toBe(true)
    expect(sumW(out.w)).toBeCloseTo(100, 3)
  })

  it('PI-ADV-ORPHAN-RENT: rent flag ignored when roof is own', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const out = computePersonalInflation(
      basePersona({
        roof: 'own_no_emi',
        lived: {
          rent: 'reset',
          cam: null,
          schoolFees: null,
          coachingFees: null,
          elderCare: null,
          helpCosts: null,
          motorPrem: null,
        },
      })
    )
    expect(out.pi_i_estimate.rent).toBe(out.pi_i_official.rent)
  })

  it('PI-ADV-WENT-UP-0: overlay rate 0 clamps into 1–25 band', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = adversarial.find((item) => item.id === 'PI-ADV-WENT-UP-0')
    const persona = findGolden('PI-23').inputs
    const out = computePersonalInflation(persona, { pi_i_estimate: { rent: row.pi } })
    expect(out.pi_i_estimate.rent).toBeGreaterThanOrEqual(1)
    expect(out.pi_i_estimate.rent).toBeLessThanOrEqual(25)
  })

  it('PI-ADV-WENT-UP-26: overlay rate 26 clamps into 1–25 band', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const row = adversarial.find((item) => item.id === 'PI-ADV-WENT-UP-26')
    const persona = findGolden('PI-23').inputs
    const out = computePersonalInflation(persona, { pi_i_estimate: { rent: row.pi } })
    expect(out.pi_i_estimate.rent).toBeLessThanOrEqual(25)
    expect(out.pi_i_estimate.rent).toBeGreaterThanOrEqual(1)
  })
})

describe('personal inflation engine — PI-47 extended warnings', () => {
  it('PI-47: overlay moving any account >15pp adds a warning chip', async () => {
    const { computePersonalInflation } = await loadPiEngine()
    const persona = findGolden('PI-23').inputs
    const seeded = computePersonalInflation(persona)
    const out = computePersonalInflation(persona, { w: { rent: 45 } })
    expect(out.warnings.some((w) => /overlay|15|moved/i.test(w))).toBe(true)
    expect(out.pi_your_estimate).not.toBe(6)
    expect(out.pi_official_weighted).toBeCloseTo(seeded.pi_official_weighted, 3)
  })

  it('PI-82: applyYourEstimate does not write CII / DA / Residex keys', async () => {
    const { computePersonalInflation, applyYourEstimate } = await loadPiEngine()
    const result = computePersonalInflation(findGolden('PI-23').inputs)
    const prefs = applyYourEstimate(result)
    expect(prefs).not.toHaveProperty('ciiRate')
    expect(prefs).not.toHaveProperty('daRate')
    expect(prefs).not.toHaveProperty('residex')
    expect(prefs).not.toHaveProperty('capitalGainsInflation')
  })
})
