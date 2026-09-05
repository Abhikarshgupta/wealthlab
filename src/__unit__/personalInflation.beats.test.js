import { describe, it, expect } from 'vitest'
import {
  getUnlockedBeats,
  getPremWhoRoles,
  isChapter1Valid,
  isChapter2Valid,
  isChapter3Valid,
  toPersona,
} from '@/utils/personalInflationBeats'

const quietAnswers = {
  geo: { cityId: 'bangalore', stateUt: 'Karnataka' },
  roof: 'own_no_emi',
  who: { school: 'none', coaching: false, elder: false, help: false, pet: false },
  commute: 'mix',
  dining: 'home',
  cam: 'no',
  care: 'care_public_esi',
  premRetail: false,
  premJump: [],
  lived: {
    rent: null,
    cam: null,
    schoolFees: null,
    coachingFees: null,
    elderCare: null,
    helpCosts: null,
    motorPrem: null,
  },
}

describe('personal inflation beats', () => {
  it('PI-09: quiet path unlocks only care and prem', () => {
    const ids = getUnlockedBeats(quietAnswers).map((beat) => beat.id)
    expect(ids).toEqual(['care', 'prem'])
  })

  it('PI-10: Chapter 2 unlocks the matching Chapter 3 beats', () => {
    const loaded = {
      ...quietAnswers,
      roof: 'rent',
      cam: 'yes',
      commute: 'car',
      who: { school: '1', coaching: true, elder: true, help: true, pet: true },
      premRetail: true,
    }
    const ids = getUnlockedBeats(loaded).map((beat) => beat.id)
    expect(ids).toEqual([
      'care',
      'prem',
      'premWho',
      'lease',
      'cam',
      'school',
      'coach',
      'elder',
      'help',
      'pet',
      'motor',
    ])
    expect(getUnlockedBeats({ ...quietAnswers, commute: 'mix' }).map((b) => b.id)).not.toContain(
      'motor'
    )
  })

  it('PI-11: premium roles come from Chapter 2 only', () => {
    const roles = getPremWhoRoles({
      who: { school: '1', coaching: false, elder: true, help: false, pet: false },
    }).map((role) => role.id)
    expect(roles).toEqual(['self', 'child', 'elder'])
    expect(getPremWhoRoles(quietAnswers).map((role) => role.id)).toEqual(['self'])
  })

  it('PI-05: continue is invalid until each chapter is complete', () => {
    expect(isChapter1Valid({ geo: {} })).toBe(false)
    expect(isChapter1Valid(quietAnswers)).toBe(true)
    expect(isChapter2Valid({ ...quietAnswers, roof: null })).toBe(false)
    expect(isChapter2Valid(quietAnswers)).toBe(true)
    expect(isChapter3Valid({ ...quietAnswers, care: null })).toBe(false)
    expect(isChapter3Valid({ ...quietAnswers, care: 'care_public_esi', premRetail: false })).toBe(true)
  })

  it('PI-13: toPersona emits engine ids (public_esi, not care_public_esi)', () => {
    const persona = toPersona(quietAnswers)
    expect(persona.care).toBe('public_esi')
    expect(persona.roof).toBe('own_no_emi')
    expect(persona.geo.stateUt).toBe('Karnataka')
  })
})
