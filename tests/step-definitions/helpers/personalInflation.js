import { findGolden } from './golden.js'

export const PI_STORAGE_KEY = 'wealthlab-personal-inflation'

export function answersFromEnginePersona(inputs) {
  const care =
    inputs.care === 'public_esi'
      ? 'care_public_esi'
      : inputs.care === 'private'
        ? 'care_private'
        : inputs.care
  return {
    geo: inputs.geo,
    roof: inputs.roof,
    who: inputs.who,
    commute: inputs.commute,
    dining: inputs.dining,
    cam: inputs.cam,
    care,
    premRetail: inputs.premRetail,
    premJump: inputs.premJump || [],
    lived: inputs.lived,
  }
}

export function persistPayloadFromGolden(id, { currentStep = 4, completedThrough = 3 } = {}) {
  const row = findGolden('personal-inflation', id)
  return {
    state: {
      currentStep,
      completedThrough,
      answers: answersFromEnginePersona(row.inputs),
    },
    version: 0,
  }
}

export async function primePersonalInflation(page, payload) {
  await page.addInitScript(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { key: PI_STORAGE_KEY, value: payload }
  )
}

export async function gotoPersonalInflation(page) {
  await page.goto('/personal-inflation')
  await page.waitForLoadState('domcontentloaded')
  const loading = page.getByText('Loading...')
  if (await loading.isVisible().catch(() => false)) {
    await loading.waitFor({ state: 'hidden', timeout: 30000 })
  }
  await page.getByRole('heading', { name: /what’s my inflation/i }).waitFor({ state: 'visible' })
}

export async function hydrateGoldenOnResults(page, id) {
  const payload = persistPayloadFromGolden(id)
  await primePersonalInflation(page, payload)
  await gotoPersonalInflation(page)
}
