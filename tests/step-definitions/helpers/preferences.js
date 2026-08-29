export const PREFERENCES_STORAGE_KEY = 'user-preferences-storage'

const DEFAULT_PREFS = {
  taxSlab: 0.3,
  adjustInflation: false,
  inflationRate: 6,
}

let pendingPreferences = { ...DEFAULT_PREFS }

export function setPendingPreferences(prefs = {}) {
  pendingPreferences = { ...pendingPreferences, ...prefs }
}

export function getPendingPreferences() {
  return { ...pendingPreferences }
}

export function resetPendingPreferences() {
  pendingPreferences = { ...DEFAULT_PREFS }
}

function buildStoragePayload(prefs) {
  return {
    state: {
      incomeTaxSlab: prefs.taxSlab,
      adjustInflation: prefs.adjustInflation,
      defaultInflationRate: prefs.inflationRate,
      inflationToggleClicks: 0,
      inflationOverlayDismissed: false,
      lastInflationRateChange: null,
    },
    version: 0,
  }
}

export async function primeUserPreferences(page, prefs = {}) {
  const merged = { ...pendingPreferences, ...prefs }
  await page.addInitScript(
    ({ key, payload }) => {
      localStorage.setItem(key, JSON.stringify(payload))
    },
    { key: PREFERENCES_STORAGE_KEY, payload: buildStoragePayload(merged) }
  )
  return merged
}

export async function applyUserPreferences(page, prefs = {}) {
  const merged = { ...pendingPreferences, ...prefs }
  await page.evaluate(
    ({ key, payload }) => {
      localStorage.setItem(key, JSON.stringify(payload))
    },
    { key: PREFERENCES_STORAGE_KEY, payload: buildStoragePayload(merged) }
  )
}

export async function gotoWithPreferences(page, url, prefs = {}) {
  const merged = await primeUserPreferences(page, prefs)
  await page.goto(url)
  await page.waitForLoadState('networkidle')
  resetPendingPreferences()
  return merged
}

export async function reloadWithPendingPreferences(page) {
  const merged = await primeUserPreferences(page, {})
  await page.reload()
  await page.waitForLoadState('networkidle')
  resetPendingPreferences()
  return merged
}
