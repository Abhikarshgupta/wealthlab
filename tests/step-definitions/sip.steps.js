import { createBdd, test } from 'playwright-bdd'
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
  expandTaxBreakdown,
  readPreTaxMaturity,
  clickStepUpToggle,
  readTaxAmount,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

Given('I am on the SIP calculator page', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/sip', { taxSlab: 0.3, adjustInflation: false })
  // Lazy-loaded route — wait beyond networkidle for the calculator shell + form
  await expect(page.getByRole('heading', { name: 'SIP Calculator' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.locator('input[name="monthlySIP"]').first()).toBeVisible({
    timeout: 15000,
  })
})

async function enableToggleByLabel(page, labelText) {
  await clickStepUpToggle(page, labelText)
}

Given('step-up SIP is enabled', async ({ page }) => {
  await enableToggleByLabel(page, 'Enable Step-up SIP')
})

Given('SWP mode is available', async () => {
  test.skip(true, 'SIP-24 @wip — SWP not implemented')
})

When('I change the monthly SIP amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'monthlySIP', amount)
})

When('I enter monthly SIP amount {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'monthlySIP', amount)
})

When('I enter monthly SIP amount {string}', async ({ page }, amount) => {
  const input = page.locator('input[name="monthlySIP"]').first()
  await input.fill('')
  await input.pressSequentially(amount)
  await input.blur()
})

When('I set investment tenure to {int} years', async ({ page }, years) => {
  await page.locator('input[type="radio"][name="tenureUnit"][value="years"]').first().check()
  await fillNamedInput(page, 'tenure', years)
})

When('I set investment tenure to {int} year', async ({ page }, years) => {
  await page.locator('input[type="radio"][name="tenureUnit"][value="years"]').first().check()
  await fillNamedInput(page, 'tenure', years)
})

When('I set investment tenure to {int} months', async ({ page }, months) => {
  await page.locator('input[type="radio"][name="tenureUnit"][value="months"]').first().check()
  await fillNamedInput(page, 'tenure', months)
})

When('I enter investment tenure {int} years', async ({ page }, years) => {
  await page.locator('input[type="radio"][name="tenureUnit"][value="years"]').first().check()
  await fillNamedInput(page, 'tenure', years)
})

When('I enter investment tenure {int} months', async ({ page }, months) => {
  await page.locator('input[type="radio"][name="tenureUnit"][value="months"]').first().check()
  await fillNamedInput(page, 'tenure', months)
})

When('I set annual step-up percentage to {int}', async ({ page }, percent) => {
  await fillNamedInput(page, 'stepUpPercentage', percent)
})

When('I clear the monthly SIP amount', async ({ page }) => {
  await fillNamedInput(page, 'monthlySIP', '')
})

When('I view the results panel', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

When('I set SIP inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('sip', goldenId)
  const { inputs } = row
  await fillNamedInput(page, 'monthlySIP', inputs.monthlySIP)
  await page
    .locator(`input[type="radio"][name="tenureUnit"][value="${inputs.tenureUnit}"]`)
    .first()
    .check()
  await fillNamedInput(page, 'tenure', inputs.tenure)
  if (inputs.expectedReturn != null) {
    await fillNamedInput(page, 'expectedReturn', inputs.expectedReturn)
  }
  if (inputs.stepUpEnabled) {
    await enableToggleByLabel(page, 'Enable Step-up SIP')
    await fillNamedInput(page, 'stepUpPercentage', inputs.stepUpPercentage)
  }
})

When('I configure monthly withdrawal from corpus', async () => {
  test.skip(true, 'SIP-24 @wip — SWP not implemented')
})

Then('the monthly SIP amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'monthlySIP')).toBe(amount)
})

Then('the SIP investment tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the expected return should be {int} percent', async ({ page }, rate) => {
  expect(await readNamedInput(page, 'expectedReturn')).toBe(rate)
})

Then('the corpus value should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('I should see the money in hand amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the post-tax amount should be less than or equal to the corpus value', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const corpus = await readPreTaxMaturity(page)
  expect(moneyInHand).toBeLessThanOrEqual(corpus)
})

Then('I should see the tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the tax rule should mention LTCG exemption', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /LTCG|₹1.*lakh|exempt/i)
})

Then('I should see actual spending power adjusted for inflation', async ({ page }) => {
  await expectTextVisible(page, /Spending Power/i)
})

Then('I should see the SIP evolution table', async ({ page }) => {
  await expectTextVisible(page, /Year-wise Investment Evolution/i)
})

Then('the evolution table should have at least {int} year row', async ({ page }, minRows) => {
  const rows = page.getByRole('table').first().locator('tbody tr')
  expect(await rows.count()).toBeGreaterThanOrEqual(minRows)
})

Then('I should see the SIP info panel', async ({ page }) => {
  await expectTextVisible(page, /About SIP/i)
})

Then('the info panel should show expected return rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.sip.expectedReturn}`, 'i'))
})

Then('I should see validation error {string}', async ({ page }, message) => {
  await expect(page.getByText(message, { exact: true }).first()).toBeVisible()
})

Then('the calculator should show empty results state', async ({ page }) => {
  await expectTextVisible(page, /Enter values to see calculation results/i)
})

Then('the page should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'SIP Calculator' })).toBeVisible()
})

Then('I should see a validation error or the value should be rejected', async ({ page }) => {
  await expect(
    page.getByText(/Minimum SIP amount|must be a number/i).first()
  ).toBeVisible()
})

Then('I should see a validation error for monthly SIP', async ({ page }) => {
  await expect(page.getByText(/Minimum SIP amount|must be a number/i).first()).toBeVisible()
})

Then(
  'the corpus value should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then(
  'the corpus value should match golden {string} field corpusValue',
  async ({ page }, goldenId) => {
    const row = findGolden('sip', goldenId)
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - row.expected.corpusValue)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the post-tax amount should match golden {string} field postTaxAmount',
  async ({ page }, goldenId) => {
    const row = findGolden('sip', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - row.expected.postTaxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the investment breakdown chart or fallback', async ({ page }) => {
  await expect(page.locator('.highcharts-container').first()).toBeVisible({ timeout: 10000 })
})

Then('I should not see validation error for monthly SIP', async ({ page }) => {
  await expect(page.getByText('Minimum SIP amount is ₹500')).toHaveCount(0)
})

Then('the tax rate label should be {string}', async ({ page }, label) => {
  await expectTextVisible(page, new RegExp(label.replace('%', '\\%')))
})

Then(
  'the tax amount should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then('I should see SWP projection results', async () => {
  test.skip(true, 'SIP-24 @wip — SWP not implemented')
})
