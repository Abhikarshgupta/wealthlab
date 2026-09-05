import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'
import { findGolden } from './helpers/golden.js'
import { PREFERENCES_STORAGE_KEY } from './helpers/preferences.js'
import {
  PI_STORAGE_KEY,
  hydrateGoldenOnResults,
  gotoPersonalInflation,
} from './helpers/personalInflation.js'

const { Given, When, Then } = createBdd()

Given('I am on the personal inflation page', async ({ page }) => {
  await gotoPersonalInflation(page)
})

Given('I hydrate the interview from golden {string} at the results step', async ({ page }, id) => {
  await hydrateGoldenOnResults(page, id)
})

When('I pick the inflation city {string}', async ({ page }, cityName) => {
  const input = page.getByLabel(/which city do you live in/i)
  await input.fill(cityName)
  await page.getByRole('button', { name: new RegExp(cityName, 'i') }).first().click()
})

When('I choose an unlisted city and pick state {string}', async ({ page }, stateName) => {
  await page.getByRole('button', { name: /my city isn’t listed/i }).click()
  await page.getByLabel(/which state or ut/i).selectOption(stateName)
})

When('I complete place with city {string}', async ({ page }, cityName) => {
  await page.getByLabel(/which city do you live in/i).fill(cityName)
  await page.getByRole('button', { name: new RegExp(cityName, 'i') }).first().click()
})

When('I open the household chapter', async ({ page }) => {
  await page.getByRole('button', { name: /continue to household/i }).click()
})

When('I complete a loaded renter household through Chapter 2', async ({ page }) => {
  await page.getByRole('radio', { name: /^do you pay rent\? yes$/i }).click()
  await page.getByRole('radio', { name: /society or maintenance\? yes$/i }).click()
  await page.getByRole('button', { name: /one school-age child/i }).click()
  await page.getByRole('button', { name: /^a pet$/i }).click()
  await page.getByRole('button', { name: /coaching or college/i }).click()
  await page.getByRole('radio', { name: /get around\? car$/i }).click()
  await page.getByRole('radio', { name: /mostly cook at home/i }).click()
  await page.getByRole('button', { name: /continue to bills/i }).click()
})

When('I toggle who chip {string}', async ({ page }, label) => {
  await page.getByRole('button', { name: new RegExp(label, 'i') }).click()
})

When('I navigate to the home page', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
})

When('I start over the personal inflation interview', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('wealthlab-personal-inflation')
  })
  await page.reload()
  await page.getByRole('heading', { name: /what’s my inflation/i }).waitFor({ state: 'visible' })
})

When('I click start over on results', async ({ page }) => {
  await page.getByRole('button', { name: /start over/i }).click()
})

When('I open the after tax nested section', async ({ page }) => {
  await page.getByRole('button', { name: /^after tax$/i }).click()
})

When('I choose the tax slab {int} percent', async ({ page }, value) => {
  await page.getByRole('radio', { name: new RegExp(`tax slab ${value}%`, 'i') }).click()
})

When('I open the after-tax calculation', async ({ page }) => {
  await page.getByRole('button', { name: /how we calculated this/i }).click()
})

When('I complete a quiet owner household through Chapter 2', async ({ page }) => {
  await page.getByLabel(/which city do you live in/i).fill('Bengaluru')
  await page.getByRole('button', { name: /bengaluru/i }).first().click()
  await page.getByRole('button', { name: /continue to household/i }).click()
  await page.getByRole('radio', { name: /do you pay rent\? no$/i }).click()
  await page.getByRole('radio', { name: /society or maintenance\? no$/i }).click()
  await page.getByRole('radio', { name: /get around\? mix$/i }).click()
  await page.getByRole('radio', { name: /mostly cook at home/i }).click()
  await page.getByRole('button', { name: /continue to bills/i }).click()
})

When('I follow the personal inflation CTA', async ({ page }) => {
  await page.getByRole('link', { name: /what’s my inflation/i }).first().click()
})

When('I reload the personal inflation page', async ({ page }) => {
  await page.reload()
  await page.getByRole('heading', { name: /what’s my inflation/i }).waitFor({ state: 'visible' })
})

When('I set the salary increase to {int} percent', async ({ page }, hike) => {
  const field = page.getByLabel(/salary increase|what the letter/i)
  await field.fill(String(hike))
})

When('I open the bills drawer', async ({ page }) => {
  await page.getByText(/change this/i).click()
})

When('I open the SIP drawer', async ({ page }) => {
  await page.getByText(/corpus projection/i).click()
})

When('I apply my inflation to calculators', async ({ page }) => {
  await page.getByRole('button', { name: /use .* in calculators/i }).click()
})

Then('I should see the personal inflation heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /what’s my inflation/i })).toBeVisible()
})

Then('the interview stepper should include {string}', async ({ page }, label) => {
  await expect(page.getByText(label, { exact: true })).toBeVisible()
})

Then('I should see text {string}', async ({ page }, text) => {
  await expect(page.getByText(text, { exact: false })).toBeVisible()
})

Then('the personal inflation continue button should be disabled', async ({ page }) => {
  await expect(page.getByRole('button', { name: /continue to household/i })).toBeDisabled()
})

Then('the personal inflation interview should have no range sliders', async ({ page }) => {
  await expect(page.locator('input[type="range"]')).toHaveCount(0)
})

Then('the personal inflation interview should have no rupee fields', async ({ page }) => {
  await expect(page.locator('input[inputmode="numeric"]')).toHaveCount(0)
  await expect(page.getByLabel(/₹|rupee/i)).toHaveCount(0)
})

Then('Chapter 3 should ask about rent', async ({ page }) => {
  await expect(page.getByText(/did rent jump this year/i)).toBeVisible()
})

Then('Chapter 3 should ask about school fees', async ({ page }) => {
  await expect(page.getByText(/did school fees jump this year/i)).toBeVisible()
})

Then('Chapter 3 should ask about pet costs', async ({ page }) => {
  await expect(page.getByText(/did pet costs jump this year/i)).toBeVisible()
})

Then('Chapter 3 should ask about car insurance', async ({ page }) => {
  await expect(page.getByText(/did car insurance jump this year/i)).toBeVisible()
})

Then('only one school chip should be selected', async ({ page }) => {
  const one = page.getByRole('button', { name: /one school-age child/i })
  const two = page.getByRole('button', { name: /two or more school-age children/i })
  const oneSelected = await one.getAttribute('aria-pressed')
  const twoSelected = await two.getAttribute('aria-pressed')
  const selectedCount = [oneSelected, twoSelected].filter((v) => v === 'true').length
  expect(selectedCount).toBe(1)
})

Then('I should be on chapter 1 place', async ({ page }) => {
  await expect(page.getByLabel(/which city do you live in/i)).toBeVisible()
  await expect(page.getByLabel(/step 1: place/i)).toHaveAttribute('aria-current', 'step')
})

Then('the mix table should show columns A and B', async ({ page }) => {
  await expect(page.getByTestId('pi-col-a')).toBeVisible()
  await expect(page.getByTestId('pi-col-b')).toBeVisible()
})

Then('the mix formula should be I = A × (B / 100)', async ({ page }) => {
  await expect(page.getByTestId('pi-mix-formula')).toHaveText(/I = A × \(B \/ 100\)/)
})

Then('rent bill row visibility should be {word}', async ({ page }, state) => {
  const rent = page.getByText(/^rent$/i)
  if (state === 'visible') {
    await expect(rent).toBeVisible()
  } else {
    await expect(rent).toHaveCount(0)
  }
})

Then('the results shell should use a single column layout', async ({ page }) => {
  await expect(page.locator('.max-w-2xl')).toBeVisible()
})

Then('the SIP drawer should be closed', async ({ page }) => {
  await expect(page.getByText(/corpus projection/i)).toBeVisible()
  await expect(page.getByRole('img', { name: /corpus projection|sip|buying power/i })).toHaveCount(0)
})

Then('the bills drawer should be closed', async ({ page }) => {
  const bills = page.locator('details').filter({ hasText: /change this/i })
  await expect(bills).not.toHaveAttribute('open')
})

Then('preferences storage must not contain CII or Residex keys', async ({ page }) => {
  const raw = await page.evaluate((key) => localStorage.getItem(key), PREFERENCES_STORAGE_KEY)
  expect(raw ?? '').not.toMatch(/cii|residex|daRate/i)
})

Then('Chapter 3 should not ask about rent', async ({ page }) => {
  await expect(page.getByText(/did rent jump/i)).toHaveCount(0)
})

Then('Chapter 3 should not ask about school fees', async ({ page }) => {
  await expect(page.getByText(/did school fees jump/i)).toHaveCount(0)
})

Then('I should not be on the results step', async ({ page }) => {
  await expect(page.getByRole('button', { name: /use .* in calculators/i })).toHaveCount(0)
})

Then('the results stepper control should be disabled', async ({ page }) => {
  await expect(page.getByLabel(/step 4: your number/i)).toBeDisabled()
})

Then('my inflation hero should be {float} percent', async ({ page }, display) => {
  await expect(page.getByText(`${display}%`)).toBeVisible()
})

Then('my inflation hero should match golden {string}', async ({ page }, id) => {
  const row = findGolden('personal-inflation', id)
  await expect(page.getByText(`${row.expected.display}%`)).toBeVisible()
})

Then('official-weighted should not be written to the inflation toggle', async ({ page }) => {
  const raw = await page.evaluate((key) => localStorage.getItem(key), PREFERENCES_STORAGE_KEY)
  const prefs = raw ? JSON.parse(raw) : { state: {} }
  expect(prefs.state?.defaultInflationRate ?? 6).toBe(6)
})

Then('the page must not claim the 12 percent rent line is the official index', async ({ page }) => {
  const body = await page.locator('body').innerText()
  expect(body).not.toMatch(/official[\s\S]{0,40}12/i)
  expect(body).not.toMatch(/MoSPI/i)
})

Then('I should see a sentence that one bill is only part of the year', async ({ page }) => {
  await expect(page.getByText(/part of the year|loud bill|scariest bill/i)).toBeVisible()
})

Then('the raise drawer should be open', async ({ page }) => {
  await expect(page.getByText(/did your raise keep up/i)).toBeVisible()
})

Then('the real change in pay should be {string}', async ({ page }, value) => {
  await expect(page.getByTestId('pi-real-raise')).toContainText(value)
})

Then('the after-tax real change in pay should be {string}', async ({ page }, value) => {
  await expect(page.getByTestId('pi-real-raise-after-tax')).toContainText(value)
})

Then('the after-tax calculation should mention {string}', async ({ page }, snippet) => {
  await expect(page.getByTestId('pi-after-tax-math')).toContainText(snippet)
})

Then('my inflation hero should still be {float} percent', async ({ page }, display) => {
  await expect(page.getByText(`${display}%`)).toBeVisible()
})

Then('the SIP buying-power graph should not be visible', async ({ page }) => {
  await expect(page.getByRole('img', { name: /corpus projection|sip|buying power/i })).toHaveCount(0)
})

Then('the SIP buying-power graph should be visible', async ({ page }) => {
  await expect(page.getByRole('img', { name: /corpus projection/i })).toBeVisible()
  await expect(page.getByText(/12% assumed return/i)).toBeVisible()
})

Then('I should see a rent bill row', async ({ page }) => {
  await expect(page.getByText(/^rent$/i)).toBeVisible()
})

Then('the results page must not contain {string}', async ({ page }, banned) => {
  const body = await page.locator('body').innerText()
  expect(body).not.toContain(banned)
})

Then('the global inflation rate should be {float}', async ({ page }, rate) => {
  const raw = await page.evaluate((key) => localStorage.getItem(key), PREFERENCES_STORAGE_KEY)
  const prefs = raw ? JSON.parse(raw) : { state: { defaultInflationRate: 6 } }
  expect(prefs.state.defaultInflationRate).toBeCloseTo(rate, 1)
})

Then('inflation adjustment should be on', async ({ page }) => {
  const raw = await page.evaluate((key) => localStorage.getItem(key), PREFERENCES_STORAGE_KEY)
  const prefs = JSON.parse(raw)
  expect(prefs.state.adjustInflation).toBe(true)
})

Then('inflation adjustment should be off', async ({ page }) => {
  const raw = await page.evaluate((key) => localStorage.getItem(key), PREFERENCES_STORAGE_KEY)
  const prefs = raw ? JSON.parse(raw) : { state: { adjustInflation: false } }
  expect(prefs.state?.adjustInflation ?? false).toBe(false)
})

Then('the URL should be {string}', async ({ page }, path) => {
  expect(new URL(page.url()).pathname).toBe(path)
})

Then('the URL should not contain a results query string', async ({ page }) => {
  const url = new URL(page.url())
  expect(url.search).toBe('')
  expect(url.hash).toBe('')
})

Then('the {string} header link should go to {string}', async ({ page }, name, path) => {
  await expect(page.getByRole('link', { name })).toHaveAttribute('href', path)
})

Then('personal inflation localStorage should not contain overlay or pi fields', async ({ page }) => {
  const raw = await page.evaluate((key) => localStorage.getItem(key), PI_STORAGE_KEY)
  expect(raw).toBeTruthy()
  const parsed = JSON.parse(raw)
  expect(parsed.state.overlay).toBeUndefined()
  expect(parsed.state.pi_your_estimate).toBeUndefined()
  expect(parsed.state.pi_official_weighted).toBeUndefined()
})
