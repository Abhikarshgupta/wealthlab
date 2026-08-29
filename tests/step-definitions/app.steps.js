import { createBdd } from 'playwright-bdd'

const { Given, Then } = createBdd()

Given('I am on the home page', async ({ page }) => {
  await page.goto('/')
})

Then('I should see the hero heading', async ({ page }) => {
  await page.getByRole('heading', {
    name: /unleash the power of intuitive finance/i,
  }).waitFor({ state: 'visible' })
})

Then('I should see a link to calculators', async ({ page }) => {
  await page.getByRole('link', { name: /explore calculators/i }).waitFor({
    state: 'visible',
  })
})
