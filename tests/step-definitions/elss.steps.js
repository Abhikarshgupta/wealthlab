import { createBdd, test } from 'playwright-bdd'
import { expect } from '@playwright/test'
import { investmentRates } from '../../src/constants/investmentRates.js'
import { findGolden } from './helpers/golden.js'
import { gotoWithPreferences } from './helpers/preferences.js'
import {
  fillNamedInput,
  readNamedInput,
  selectRadioByValue,
  expectTextVisible,
  getMoneyInHandAmount,
  parseIndianCurrency,
  expandTaxBreakdown,
  readPreTaxMaturity,
  readTaxAmount,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

Given('ELSS lock-in prevents browser STCG scenario', async () => {
  test.skip(true, 'ELSS-23 @known-bug — UI lock-in blocks tenure < 3 years; STCG covered in unit tests')
})

Given('I am on the ELSS calculator page', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/elss', { taxSlab: 0.3, adjustInflation: false })
  await expect(page.getByRole('heading', { name: 'ELSS Calculator' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.locator('input[name="amount"]').first()).toBeVisible({
    timeout: 15000,
  })
})

When('I change the ELSS investment amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'amount', amount)
})

When('I enter ELSS investment amount {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'amount', amount)
})

When('I enter ELSS investment amount {string}', async ({ page }, amount) => {
  const input = page.locator('input[name="amount"]').first()
  await input.fill('')
  await input.pressSequentially(amount)
  await input.blur()
})

When('I set ELSS investment tenure to {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I enter ELSS investment tenure {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I clear the ELSS investment amount', async ({ page }) => {
  await fillNamedInput(page, 'amount', '')
})

When('I view the ELSS results panel', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

When('I select ELSS investment type Lumpsum', async ({ page }) => {
  await selectRadioByValue(page, 'investmentType', 'lumpsum')
})

When('I set ELSS inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('elss', goldenId)
  const { inputs } = row
  await selectRadioByValue(page, 'investmentType', inputs.investmentType)
  await fillNamedInput(page, 'amount', inputs.amount)
  await fillNamedInput(page, 'tenure', inputs.tenure)
  if (inputs.expectedReturn != null) {
    await fillNamedInput(page, 'expectedReturn', inputs.expectedReturn)
  }
})

Then('the ELSS investment amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'amount')).toBe(amount)
})

Then('the ELSS investment tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the ELSS expected return should be {int} percent', async ({ page }, rate) => {
  expect(await readNamedInput(page, 'expectedReturn')).toBe(rate)
})

Then('the ELSS investment type should be SIP', async ({ page }) => {
  await expectTextVisible(page, /Monthly SIP Amount/i)
})

Then('the ELSS corpus value should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('I should see the ELSS money in hand amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the ELSS post-tax amount should be less than or equal to the corpus value',
  async ({ page }) => {
    const moneyInHand = await getMoneyInHandAmount(page)
    const corpus = await readPreTaxMaturity(page)
    expect(moneyInHand).toBeLessThanOrEqual(corpus)
  }
)

Then('I should see the ELSS tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the ELSS tax rule should mention LTCG exemption', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /LTCG|₹1.*lakh|exempt/i)
})

Then('I should see ELSS actual spending power adjusted for inflation', async ({ page }) => {
  await expectTextVisible(page, /Spending Power/i)
})

Then('I should see the ELSS evolution table', async ({ page }) => {
  await expectTextVisible(page, /Year-wise Investment Evolution/i)
})

Then('the ELSS evolution table should have at least {int} year rows', async ({ page }, minRows) => {
  const rows = page.getByRole('table').first().locator('tbody tr')
  expect(await rows.count()).toBeGreaterThanOrEqual(minRows)
})

Then('I should see the ELSS info panel', async ({ page }) => {
  await expectTextVisible(page, /About ELSS/i)
})

Then('the ELSS info panel should show expected return rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.elss.expectedReturn}`, 'i'))
})

Then('the ELSS info panel should mention Section 80C deduction', async ({ page }) => {
  await expectTextVisible(page, /Section 80C|80C/i)
})

Then('I should see ELSS validation error {string}', async ({ page }, message) => {
  await expect(page.getByText(message, { exact: true }).first()).toBeVisible()
})

Then('the ELSS calculator should show empty results state', async ({ page }) => {
  await expectTextVisible(page, /Enter values to see calculation results/i)
})

Then('the ELSS page should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'ELSS Calculator' })).toBeVisible()
})

Then('I should see an ELSS validation error or the value should be rejected', async ({ page }) => {
  await expect(
    page.getByText(/Minimum investment amount|must be a number/i).first()
  ).toBeVisible()
})

Then('I should see a validation error for ELSS investment amount', async ({ page }) => {
  await expect(page.getByText(/Minimum investment amount|must be a number/i).first()).toBeVisible()
})

Then(
  'the ELSS corpus value should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then(
  'the ELSS corpus value should match golden {string} field corpusValue',
  async ({ page }, goldenId) => {
    const row = findGolden('elss', goldenId)
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - row.expected.corpusValue)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the ELSS post-tax amount should match golden {string} field postTaxAmount',
  async ({ page }, goldenId) => {
    const row = findGolden('elss', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - row.expected.postTaxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the ELSS investment breakdown chart or fallback', async ({ page }) => {
  await expect(page.locator('.highcharts-container').first()).toBeVisible({ timeout: 10000 })
})

Then('I should not see ELSS validation error for investment amount', async ({ page }) => {
  await expect(page.getByText('Minimum investment amount is ₹500')).toHaveCount(0)
})

Then('I should not see ELSS validation error for investment tenure', async ({ page }) => {
  await expect(page.getByText('Minimum tenure is 3 years (ELSS lock-in requirement)')).toHaveCount(0)
  await expect(page.getByText('Maximum tenure is 50 years')).toHaveCount(0)
})

Then('the ELSS tax rate label should be {string}', async ({ page }, label) => {
  await expectTextVisible(page, new RegExp(label.replace('%', '\\%')))
})

Then(
  'the ELSS tax amount should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - expected)).toBeLessThanOrEqual(tolerance)
  }
)
