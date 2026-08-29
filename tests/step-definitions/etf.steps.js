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
  expandTaxBreakdown,
  readPreTaxMaturity,
  clickStepUpToggle,
  readTaxAmount,
  selectRadioByValue,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

async function waitForETFCalculatorReady(page) {
  await page.waitForLoadState('domcontentloaded')
  const loading = page.getByText('Loading...')
  if (await loading.isVisible().catch(() => false)) {
    await loading.waitFor({ state: 'hidden', timeout: 30000 })
  }
  await expect(page.getByRole('heading', { name: 'ETF Calculator' })).toBeVisible({
    timeout: 30000,
  })
  await expect(page.locator('input[name="amount"]').first()).toBeVisible({ timeout: 15000 })
}

Given('I am on the ETF calculator page', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/etf', { taxSlab: 0.3, adjustInflation: false })
  await waitForETFCalculatorReady(page)
})

Given('ETF step-up SIP is enabled', async ({ page }) => {
  await clickStepUpToggle(page, 'Enable Step-up SIP')
})

Given('ETF sub-year tenure is supported in UI', async () => {
  test.skip(true, 'ETF-23-STCG @wip — UI tenure min 1 year; STCG covered in unit layer ETF-22-STCG')
})

When('I change the ETF amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'amount', amount)
})

When('I enter ETF amount {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'amount', amount)
})

When('I enter ETF amount {string}', async ({ page }, amount) => {
  const input = page.locator('input[name="amount"]').first()
  await input.fill('')
  await input.pressSequentially(amount)
  await input.blur()
})

When('I set ETF tenure to {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I enter ETF tenure {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I set ETF annual step-up percentage to {int}', async ({ page }, percent) => {
  await fillNamedInput(page, 'stepUpPercentage', percent)
})

When('I select ETF investment type {string}', async ({ page }, type) => {
  await selectRadioByValue(page, 'investmentType', type)
})

When('I select ETF type {string}', async ({ page }, etfType) => {
  await selectRadioByValue(page, 'etfType', etfType)
})

When('I set ETF expense ratio to {float}', async ({ page }, ratio) => {
  await fillNamedInput(page, 'expenseRatio', ratio)
})

When('I clear the ETF amount', async ({ page }) => {
  await fillNamedInput(page, 'amount', '')
})

When('I view the ETF results panel', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

When('I set ETF inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('etf', goldenId)
  const { inputs } = row

  if (inputs.investmentType) {
    await selectRadioByValue(page, 'investmentType', inputs.investmentType)
  }
  if (inputs.etfType) {
    await selectRadioByValue(page, 'etfType', inputs.etfType)
  }
  await fillNamedInput(page, 'amount', inputs.amount)
  await fillNamedInput(page, 'tenure', inputs.tenure)
  if (inputs.expectedCAGR != null) {
    await fillNamedInput(page, 'expectedCAGR', inputs.expectedCAGR)
  }
  if (inputs.expenseRatio != null) {
    await fillNamedInput(page, 'expenseRatio', inputs.expenseRatio)
  }
  if (inputs.stepUpEnabled) {
    await clickStepUpToggle(page, 'Enable Step-up SIP')
    await fillNamedInput(page, 'stepUpPercentage', inputs.stepUpPercentage)
  }
})

Then('the ETF investment type should be {string}', async ({ page }, type) => {
  const amountInput = page.locator('input[name="amount"]').first()
  if (type === 'sip') {
    await expect(amountInput).toHaveAttribute('placeholder', '5000')
  } else {
    await expect(amountInput).toHaveAttribute('placeholder', '100000')
  }
})

Then('the ETF amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'amount')).toBe(amount)
})

Then('the ETF tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the ETF expected CAGR should be {int} percent', async ({ page }, rate) => {
  expect(await readNamedInput(page, 'expectedCAGR')).toBe(rate)
})

Then('the ETF expense ratio should be {float} percent', async ({ page }, ratio) => {
  expect(await readNamedInput(page, 'expenseRatio')).toBe(ratio)
})

Then('the ETF type should be {string}', async ({ page }, etfType) => {
  await expect(page.locator(`input[name="etfType"][value="${etfType}"]:checked`)).toHaveCount(1)
})

Then('the ETF corpus value should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('I should see the ETF money in hand amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the ETF post-tax amount should be less than or equal to the corpus value',
  async ({ page }) => {
    const moneyInHand = await getMoneyInHandAmount(page)
    const corpus = await readPreTaxMaturity(page)
    expect(moneyInHand).toBeLessThanOrEqual(corpus)
  }
)

Then('I should see the ETF tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the ETF tax rule should mention LTCG exemption', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /LTCG|₹1.*lakh|exempt/i)
})

Then('I should see ETF actual spending power adjusted for inflation', async ({ page }) => {
  await expectTextVisible(page, /Spending Power/i)
})

Then('I should see the ETF evolution table', async ({ page }) => {
  await expectTextVisible(page, /Year-wise Investment Evolution/i)
})

Then('the ETF evolution table should have at least {int} year row', async ({ page }, minRows) => {
  const rows = page.getByRole('table').first().locator('tbody tr')
  expect(await rows.count()).toBeGreaterThanOrEqual(minRows)
})

Then('I should see the ETF info panel', async ({ page }) => {
  await expectTextVisible(page, /About Exchange Traded Funds/i)
})

Then('the ETF info panel should show expected return rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.etf.equity}`, 'i'))
})

Then('I should see ETF validation error {string}', async ({ page }, message) => {
  await expect(page.getByText(message, { exact: true }).first()).toBeVisible()
})

Then('the ETF calculator should show empty results state', async ({ page }) => {
  await expectTextVisible(page, /Enter values to see calculation results/i)
})

Then('the ETF page should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'ETF Calculator' })).toBeVisible()
})

Then('I should see an ETF validation error or the value should be rejected', async ({ page }) => {
  await expect(
    page.getByText(/Minimum investment amount|must be a number/i).first()
  ).toBeVisible()
})

Then('I should see an ETF validation error for amount', async ({ page }) => {
  await expect(page.getByText(/Minimum investment amount|must be a number/i).first()).toBeVisible()
})

Then(
  'the ETF corpus value should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then(
  'the ETF corpus value should match golden {string} field corpusValue',
  async ({ page }, goldenId) => {
    const row = findGolden('etf', goldenId)
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - row.expected.corpusValue)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the ETF post-tax amount should match golden {string} field postTaxAmount',
  async ({ page }, goldenId) => {
    const row = findGolden('etf', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - row.expected.postTaxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the ETF investment breakdown chart or fallback', async ({ page }) => {
  await expect(page.locator('.highcharts-container').first()).toBeVisible({ timeout: 10000 })
})

Then('the ETF tax rate label should be {string}', async ({ page }, label) => {
  await expectTextVisible(page, new RegExp(label.replace(/[()]/g, '\\$&').replace('%', '\\%')))
})

Then(
  'the ETF tax amount should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then('I should see the ETF market risk warning', async ({ page }) => {
  await expectTextVisible(page, /Market Risk Warning/i)
  await expectTextVisible(page, /subject to market risk/i)
})
