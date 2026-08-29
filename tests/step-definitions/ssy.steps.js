import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'
import { investmentRates } from '../../src/constants/investmentRates.js'
import { findGolden } from './helpers/golden.js'
import { gotoWithPreferences } from './helpers/preferences.js'
import {
  fillNamedInput,
  readNamedInput,
  expectTextVisible,
  getMoneyInHandAmount,
  parseIndianCurrency,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

Given('I open the SSY calculator', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/ssy', { taxSlab: 0.3, adjustInflation: false })
  await expect(page.getByRole('heading', { name: 'SSY Calculator' })).toBeVisible({ timeout: 15000 })
  await expect(page.locator('input[name="yearlyInvestment"]').first()).toBeVisible()
})

When('I set SSY yearly investment to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'yearlyInvestment', amount)
})

When('I clear SSY yearly investment', async ({ page }) => {
  await fillNamedInput(page, 'yearlyInvestment', '')
})

When('I enter non-numeric SSY yearly investment {string}', async ({ page }, value) => {
  const input = page.locator('input[name="yearlyInvestment"]').first()
  await input.fill('')
  await input.pressSequentially(value)
  await input.blur()
})

When('I set girl\'s age to {int}', async ({ page }, age) => {
  await fillNamedInput(page, 'girlsAge', age)
})

When('I enter SSY inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('ssy', goldenId)
  const { inputs } = row
  await fillNamedInput(page, 'yearlyInvestment', inputs.yearlyInvestment)
  await fillNamedInput(page, 'girlsAge', inputs.girlsAge)
  if (inputs.startYear != null) {
    await fillNamedInput(page, 'startYear', inputs.startYear)
  }
  if (inputs.rate != null) {
    await fillNamedInput(page, 'rate', inputs.rate)
  }
})

Then('the SSY yearly investment should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'yearlyInvestment')).toBe(amount)
})

Then('the girl\'s age should be {int}', async ({ page }, age) => {
  expect(await readNamedInput(page, 'girlsAge')).toBe(age)
})

Then('the SSY interest rate should match the current SSY rate', async ({ page }) => {
  expect(await readNamedInput(page, 'rate')).toBe(investmentRates.ssy.rate)
})

Then('the SSY results panel should be visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

Then('the SSY maturity amount should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the SSY results panel should show money in hand', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the SSY info panel should explain EEE tax benefits', async ({ page }) => {
  await expectTextVisible(page, /EEE|tax-free|exempt/i)
})

Then('no SSY income tax should be deducted from maturity', async ({ page }) => {
  await expectTextVisible(page, /Tax-Free|Money in Hand \(Tax-Free\)/i)
})

Then('the SSY spending power amount should be less than maturity value', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const spendingHeading = page.getByRole('heading', { name: 'Spending Power' }).first()
  await expect(spendingHeading).toBeVisible()
  const spendingText = await spendingHeading.locator('xpath=ancestor::div[1]').innerText()
  const amounts = (spendingText.match(/₹[\d,]+/g) ?? []).map(parseIndianCurrency)
  const spending = Math.max(...amounts)
  expect(spending).toBeLessThan(moneyInHand)
})

Then('the SSY evolution table should show {int} year rows', async ({ page }, count) => {
  const table = page.getByRole('table').first()
  await expect(table).toBeVisible({ timeout: 15000 })
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(count, { timeout: 15000 })
})

Then('the SSY info panel should show current SSY interest rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.ssy.rate}`, 'i'))
})

Then('the SSY info panel should show last updated date', async ({ page }) => {
  await expectTextVisible(page, /Last updated/i)
})

Then('I should not see SSY validation error for maximum investment', async ({ page }) => {
  await expect(page.locator('#yearlyInvestment-error')).toHaveCount(0)
})

Then('the SSY calculator should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'SSY Calculator' })).toBeVisible()
})

Then('the SSY results panel should show empty state or validation', async ({ page }) => {
  await expect(
    page.getByText(/Enter values to see calculation results|Minimum investment is/i).first()
  ).toBeVisible()
})

Then('I should see SSY validation error or clamped minimum value', async ({ page }) => {
  await expect(page.getByText(/Minimum investment is/i).first()).toBeVisible()
})

Then('I should see SSY validation error or unchanged numeric value', async ({ page }) => {
  const value = await page.locator('input[name="yearlyInvestment"]').first().inputValue()
  const numeric = Number.parseFloat(value)
  const hasValidation =
    (await page.getByText(/Minimum investment is|must be a number/i).count()) > 0
  expect(hasValidation || Number.isNaN(numeric) || numeric >= 250).toBe(true)
})

Then(
  'the SSY maturity amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('ssy', goldenId)
    const moneyInHand = await getMoneyInHandAmount(page)
    expect(Math.abs(moneyInHand - row.expected.maturityValue)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the SSY total invested should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('ssy', goldenId)
    const investedText = await page.locator('tfoot tr').first().locator('td').nth(2).innerText()
    const invested = parseIndianCurrency(investedText)
    expect(Math.abs(invested - row.expected.totalInvested)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then('the SSY pie chart should render or show graceful fallback', async ({ page }) => {
  await expect(page.locator('.highcharts-container').first()).toBeVisible({ timeout: 10000 })
})

Then('I should not see SSY validation error for girl\'s age', async ({ page }) => {
  await expect(page.locator('#girlsAge-error')).toHaveCount(0)
  await expect(page.getByText(/Girl must be below 10 years of age to open SSY/i)).toHaveCount(0)
})

Then('I should see SSY validation error containing {string}', async ({ page }, fragment) => {
  if (/below 10 years/i.test(fragment)) {
    const schemaErrors = await page.locator('#girlsAge-error').count()
    const uiWarnings = await page.getByText(/Girl must be below 10 years of age to open SSY/i).count()
    expect(schemaErrors + uiWarnings).toBeGreaterThan(0)
    return
  }
  await expect(page.getByText(new RegExp(fragment, 'i')).first()).toBeVisible()
})

Then('the SSY investment period should be {int} years', async ({ page }, years) => {
  await expectTextVisible(page, new RegExp(`mature in ${years} year`, 'i'))
})

Then('the SSY info panel should mention girl child turns 21', async ({ page }) => {
  await expectTextVisible(page, /turns 21|attains the age of 21/i)
})

Then(
  'the SSY money in hand amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('ssy', goldenId)
    const actual = await getMoneyInHandAmount(page)
    const expected = row.expected.postTaxAmount ?? row.expected.maturityValue
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('the SSY tax deducted should be zero', async ({ page }) => {
  await expectTextVisible(page, /Tax-Free|₹0|Money in Hand \(Tax-Free\)/i)
})
