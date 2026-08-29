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
  selectRadioByValue,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

async function waitForEquityCalculatorReady(page) {
  await page.waitForLoadState('domcontentloaded')
  const loading = page.getByText('Loading...')
  if (await loading.isVisible().catch(() => false)) {
    await loading.waitFor({ state: 'hidden', timeout: 30000 })
  }
  await expect(page.getByRole('heading', { name: 'Equity Calculator' })).toBeVisible({
    timeout: 30000,
  })
  await expect(page.locator('input[name="amount"]').first()).toBeVisible({ timeout: 15000 })
}

Given('I am on the equity calculator page', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/equity', { taxSlab: 0.3, adjustInflation: false })
  await waitForEquityCalculatorReady(page)
})

Given('equity step-up SIP is enabled', async ({ page }) => {
  await clickStepUpToggle(page, 'Enable Step-up SIP')
})

Given('equity sub-year tenure is supported in UI', async () => {
  test.skip(true, 'EQ-24 @wip — UI tenure min 1 year; STCG covered in unit layer EQ-22-STCG')
})

Given('equity dividend reinvestment mode is available', async () => {
  test.skip(true, 'EQ-25 @wip — dividend reinvestment not implemented')
})

When('I change the equity amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'amount', amount)
})

When('I enter equity amount {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'amount', amount)
})

When('I enter equity amount {string}', async ({ page }, amount) => {
  const input = page.locator('input[name="amount"]').first()
  await input.fill('')
  await input.pressSequentially(amount)
  await input.blur()
})

When('I set equity tenure to {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I enter equity tenure {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I set equity tenure to {int} year', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I set equity annual step-up percentage to {int}', async ({ page }, percent) => {
  await fillNamedInput(page, 'stepUpPercentage', percent)
})

When('I select equity investment type {string}', async ({ page }, type) => {
  await selectRadioByValue(page, 'investmentType', type)
})

When('I clear the equity amount', async ({ page }) => {
  await fillNamedInput(page, 'amount', '')
})

When('I view the equity results panel', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

When('I set equity inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('equity', goldenId)
  const { inputs } = row

  if (inputs.investmentType) {
    await selectRadioByValue(page, 'investmentType', inputs.investmentType)
  }
  await fillNamedInput(page, 'amount', inputs.amount)
  await fillNamedInput(page, 'tenure', inputs.tenure)
  if (inputs.expectedCAGR != null) {
    await fillNamedInput(page, 'expectedCAGR', inputs.expectedCAGR)
  }
  if (inputs.stepUpEnabled) {
    await clickStepUpToggle(page, 'Enable Step-up SIP')
    await fillNamedInput(page, 'stepUpPercentage', inputs.stepUpPercentage)
  }
})

When('I configure dividend yield and reinvestment', async () => {
  test.skip(true, 'EQ-25 @wip — dividend reinvestment not implemented')
})

Then('the equity investment type should be {string}', async ({ page }, type) => {
  const amountInput = page.locator('input[name="amount"]').first()
  if (type === 'sip') {
    await expect(amountInput).toHaveAttribute('placeholder', '5000')
  } else {
    await expect(amountInput).toHaveAttribute('placeholder', '100000')
  }
})

Then('the equity amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'amount')).toBe(amount)
})

Then('the equity tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the expected CAGR should be {int} percent', async ({ page }, rate) => {
  expect(await readNamedInput(page, 'expectedCAGR')).toBe(rate)
})

Then('the equity corpus value should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('I should see the equity money in hand amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the equity post-tax amount should be less than or equal to the corpus value',
  async ({ page }) => {
    const moneyInHand = await getMoneyInHandAmount(page)
    const corpus = await readPreTaxMaturity(page)
    expect(moneyInHand).toBeLessThanOrEqual(corpus)
  }
)

Then('I should see the equity tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the equity tax rule should mention LTCG exemption', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /LTCG|₹1.*lakh|exempt/i)
})

Then('I should see equity actual spending power adjusted for inflation', async ({ page }) => {
  await expectTextVisible(page, /Spending Power/i)
})

Then('I should see the equity evolution table', async ({ page }) => {
  await expectTextVisible(page, /Year-wise Investment Evolution/i)
})

Then('the equity evolution table should have at least {int} year row', async ({ page }, minRows) => {
  const rows = page.getByRole('table').first().locator('tbody tr')
  expect(await rows.count()).toBeGreaterThanOrEqual(minRows)
})

Then('I should see the equity info panel', async ({ page }) => {
  await expectTextVisible(page, /About Direct Equity Investments/i)
})

Then('the equity info panel should show expected return rate', async ({ page }) => {
  await expectTextVisible(
    page,
    new RegExp(`${investmentRates.equity.defaultExpectedReturn}`, 'i')
  )
})

Then('I should see equity validation error {string}', async ({ page }, message) => {
  await expect(page.getByText(message, { exact: true }).first()).toBeVisible()
})

Then('the equity calculator should show empty results state', async ({ page }) => {
  await expectTextVisible(page, /Enter values to see calculation results/i)
})

Then('the equity page should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Equity Calculator' })).toBeVisible()
})

Then('I should see an equity validation error or the value should be rejected', async ({ page }) => {
  await expect(
    page.getByText(/Minimum investment amount|must be a number/i).first()
  ).toBeVisible()
})

Then('I should see an equity validation error for amount', async ({ page }) => {
  await expect(page.getByText(/Minimum investment amount|must be a number/i).first()).toBeVisible()
})

Then(
  'the equity corpus value should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then(
  'the equity corpus value should match golden {string} field corpusValue',
  async ({ page }, goldenId) => {
    const row = findGolden('equity', goldenId)
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - row.expected.corpusValue)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the equity post-tax amount should match golden {string} field postTaxAmount',
  async ({ page }, goldenId) => {
    const row = findGolden('equity', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - row.expected.postTaxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the equity investment breakdown chart or fallback', async ({ page }) => {
  await expect(page.locator('.highcharts-container').first()).toBeVisible({ timeout: 10000 })
})

Then('the equity tax rate label should be {string}', async ({ page }, label) => {
  await expectTextVisible(page, new RegExp(label.replace('%', '\\%')))
})

Then(
  'the equity tax amount should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then('I should see the equity high risk investment warning', async ({ page }) => {
  await expectTextVisible(page, /High Risk Investment Warning/i)
  await expectTextVisible(page, /subject to market risk/i)
})

Then('I should see dividend-adjusted corpus projection', async () => {
  test.skip(true, 'EQ-25 @wip — dividend reinvestment not implemented')
})
