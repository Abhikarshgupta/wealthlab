import { createBdd } from 'playwright-bdd'
import { setPendingPreferences, reloadWithPendingPreferences } from './helpers/preferences.js'

const { Given } = createBdd()

Given('the default tax slab is {int} percent', async ({ page }, percent) => {
  setPendingPreferences({ taxSlab: percent / 100 })
  if (page.url().includes('/calculators/')) {
    await reloadWithPendingPreferences(page)
  }
})

Given('inflation adjustment is off', async ({ page }) => {
  setPendingPreferences({ adjustInflation: false })
  if (page.url().includes('/calculators/')) {
    await reloadWithPendingPreferences(page)
  }
})

Given('inflation adjustment is on', async ({ page }) => {
  setPendingPreferences({ adjustInflation: true })
  if (page.url().includes('/calculators/')) {
    await reloadWithPendingPreferences(page)
  }
})
