/**
 * PI-03 — hardcoded geography (questionnaire PRD §4).
 */

import { describe, it, expect } from 'vitest'
import {
  INFLATION_CITIES,
  INFLATION_STATES,
  getInflationCity,
} from '@/constants/personalInflationGeo'
import { STATE_URBAN_HEADLINE } from '../../tests/fixtures/personal-inflation/ledger.js'

const PRD_CITY_IDS = [
  'new-delhi',
  'mumbai',
  'chennai',
  'kolkata',
  'bangalore',
  'pune',
  'hyderabad',
  'ahmedabad',
  'indore',
  'guwahati',
  'kochi',
  'chandigarh',
  'jammu',
  'lucknow',
  'kota',
  'vadodara',
]

describe('personal inflation geography — PI-03', () => {
  it('PI-03: ships all PRD-listed cities with stateUt', () => {
    const ids = INFLATION_CITIES.map((city) => city.id)
    PRD_CITY_IDS.forEach((id) => expect(ids).toContain(id))
    expect(INFLATION_CITIES.length).toBeGreaterThanOrEqual(PRD_CITY_IDS.length)
  })

  it('PI-03: Bengaluru maps to Karnataka', () => {
    const city = getInflationCity('bangalore')
    expect(city).toEqual({ id: 'bangalore', name: 'Bengaluru', stateUt: 'Karnataka' })
  })

  it('PI-03: Guwahati maps to Assam (contrast headline 2.53 in engine)', () => {
    const city = getInflationCity('guwahati')
    expect(city?.stateUt).toBe('Assam')
    expect(STATE_URBAN_HEADLINE.Assam).toBe(2.53)
  })

  it('PI-03: state fallback list has no rest bucket', () => {
    expect(INFLATION_STATES).not.toContain('rest')
    expect(INFLATION_STATES.length).toBeGreaterThan(30)
  })
})
