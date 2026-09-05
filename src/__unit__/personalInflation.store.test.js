/**
 * Persona store: in-memory copy vs localStorage, hydrate, sync, reset.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import usePersonalInflationStore from '@/store/personalInflationStore'
import { PI_STORAGE_KEY } from '../../tests/fixtures/personal-inflation/ledger.js'

const readPersisted = () => {
  const raw = localStorage.getItem(PI_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

const resetStore = () => {
  localStorage.removeItem(PI_STORAGE_KEY)
  usePersonalInflationStore.getState().reset()
}

describe('personal inflation store — memory vs localStorage', () => {
  beforeEach(() => {
    resetStore()
  })

  afterEach(() => {
    resetStore()
  })

  it('PI-14: answering city writes the same persona to memory and localStorage', async () => {
    usePersonalInflationStore.getState().setCity('bangalore')
    expect(usePersonalInflationStore.getState().answers.geo).toEqual({
      cityId: 'bangalore',
      stateUt: 'Karnataka',
    })
    await waitFor(() => {
      const persisted = readPersisted()
      expect(persisted.state.answers.geo.cityId).toBe('bangalore')
      expect(persisted.state.answers.geo.stateUt).toBe('Karnataka')
    })
  })

  it('PI-SYS-01: persisted slice is only currentStep, answers, completedThrough', async () => {
    usePersonalInflationStore.getState().setCity('lucknow')
    usePersonalInflationStore.getState().setRoof('rent')
    await waitFor(() => expect(readPersisted()).toBeTruthy())
    const keys = Object.keys(readPersisted().state).sort()
    expect(keys).toEqual(['answers', 'completedThrough', 'currentStep'])
    expect(readPersisted().state).not.toHaveProperty('overlay')
    expect(readPersisted().state).not.toHaveProperty('pi_your_estimate')
  })

  it('PI-SYS-02: rehydrate from localStorage restores answers and step, not a second copy', async () => {
    const payload = {
      state: {
        currentStep: 2,
        completedThrough: 1,
        answers: {
          ...usePersonalInflationStore.getState().answers,
          geo: { cityId: 'guwahati', stateUt: 'Assam' },
          roof: 'rent',
          commute: 'mix',
          dining: 'home',
          cam: 'no',
        },
      },
      version: 0,
    }
    localStorage.setItem(PI_STORAGE_KEY, JSON.stringify(payload))
    await usePersonalInflationStore.persist.rehydrate()
    const state = usePersonalInflationStore.getState()
    expect(state.currentStep).toBe(2)
    expect(state.completedThrough).toBe(1)
    expect(state.answers.geo.cityId).toBe('guwahati')
    expect(state.answers.roof).toBe('rent')
  })

  it('PI-SYS-03: overlay API is session-only and must not land in localStorage (contract — RED until store ships setOverlay)', async () => {
    const setOverlay = usePersonalInflationStore.getState().setOverlay
    expect(typeof setOverlay).toBe('function')
    setOverlay({ w: { rent: 40 } })
    await waitFor(() => expect(readPersisted()).toBeTruthy())
    expect(readPersisted().state.overlay).toBeUndefined()
    expect(usePersonalInflationStore.getState().overlay).toEqual({ w: { rent: 40 } })
  })

  it('PI-08: school_1 and school_2plus are exclusive; sandwich with elder is allowed', () => {
    const { toggleWho } = usePersonalInflationStore.getState()
    toggleWho('school_1')
    toggleWho('school_2plus')
    expect(usePersonalInflationStore.getState().answers.who.school).toBe('2plus')
    toggleWho('elder_in_care')
    expect(usePersonalInflationStore.getState().answers.who.school).toBe('2plus')
    expect(usePersonalInflationStore.getState().answers.who.elder).toBe(true)
  })

  it('PI-13: changing roof/who/commute/cam nulls orphan lived keys in memory and storage', async () => {
    const store = usePersonalInflationStore.getState()
    store.setRoof('rent')
    store.setLived('rent', 'reset')
    store.setRoof('own_no_emi')
    expect(usePersonalInflationStore.getState().answers.lived.rent).toBeNull()
    await waitFor(() => {
      expect(readPersisted().state.answers.lived.rent).toBeNull()
    })
  })

  it('PI-SYS-04: reset clears memory and localStorage copy together', async () => {
    usePersonalInflationStore.getState().setCity('mumbai')
    await waitFor(() => expect(readPersisted()?.state.answers.geo.cityId).toBe('mumbai'))
    usePersonalInflationStore.getState().reset()
    expect(usePersonalInflationStore.getState().currentStep).toBe(1)
    expect(usePersonalInflationStore.getState().answers.geo.cityId).toBeNull()
    await waitFor(() => {
      const persisted = readPersisted()
      expect(persisted.state.answers.geo.cityId).toBeNull()
      expect(persisted.state.currentStep).toBe(1)
    })
  })

  it('PI-SYS-05: corrupt localStorage must not hang rehydrate', async () => {
    localStorage.setItem(PI_STORAGE_KEY, '{not-json')
    const hung = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('rehydrate hung on corrupt JSON')), 400)
    })
    await Promise.race([
      usePersonalInflationStore.persist.rehydrate().catch(() => null),
      hung,
    ])
    expect(usePersonalInflationStore.getState().currentStep).toBe(1)
  })
})
