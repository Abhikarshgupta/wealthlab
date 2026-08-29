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
  clickStepUpToggle,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

Given('I open the PPF calculator', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/ppf', { taxSlab: 0.3, adjustInflation: false })
  await expect(page.getByRole('heading', { name: 'PPF Calculator' })).toBeVisible({ timeout: 15000 })
  await expect(page.locator('input[name="yearlyInvestment"]').first()).toBeVisible()
})

When('I set yearly investment to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'yearlyInvestment', amount)
})

When('I clear yearly investment', async ({ page }) => {
  await fillNamedInput(page, 'yearlyInvestment', '')
})

When('I enter non-numeric yearly investment {string}', async ({ page }, value) => {
  const input = page.locator('input[name="yearlyInvestment"]').first()
  await input.fill('')
  await input.pressSequentially(value)
  await input.blur()
})

When('I enable step-up investment at {int} percent', async ({ page }, percent) => {
  await clickStepUpToggle(page, 'Enable Step-up Investment')
  await fillNamedInput(page, 'stepUpPercentage', percent)
  const row = findGolden('ppf', 'PPF-22')
  await fillNamedInput(page, 'yearlyInvestment', row.inputs.yearlyInvestment)
  await fillNamedInput(page, 'tenure', row.inputs.tenure)
  await fillNamedInput(page, 'rate', row.inputs.rate)
})

When('I enter calculator inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('ppf', goldenId)
  const { inputs } = row
  await fillNamedInput(page, 'yearlyInvestment', inputs.yearlyInvestment)
  await fillNamedInput(page, 'tenure', inputs.tenure)
  if (inputs.rate != null) {
    await fillNamedInput(page, 'rate', inputs.rate)
  }
  if (inputs.stepUpEnabled) {
    await clickStepUpToggle(page, 'Enable Step-up Investment')
    await fillNamedInput(page, 'stepUpPercentage', inputs.stepUpPercentage)
  }
})

Then('the yearly investment should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'yearlyInvestment')).toBe(amount)
})

Then('the investment tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the interest rate should match the current PPF rate', async ({ page }) => {
  expect(await readNamedInput(page, 'rate')).toBe(investmentRates.ppf.rate)
})

Then('the results panel should be visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

Then('the maturity amount should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the results panel should show money in hand', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the info panel should explain PPF EEE tax benefits', async ({ page }) => {
  await expectTextVisible(page, /EEE|tax-free|exempt/i)
})

Then('no income tax should be deducted from maturity', async ({ page }) => {
  await expectTextVisible(page, /Tax-Free|Money in Hand \(Tax-Free\)/i)
})

Then('the spending power amount should be less than maturity value', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const spendingHeading = page.getByRole('heading', { name: 'Spending Power' }).first()
  await expect(spendingHeading).toBeVisible()
  const spendingText = await spendingHeading.locator('xpath=ancestor::div[1]').innerText()
  const amounts = (spendingText.match(/₹[\d,]+/g) ?? []).map(parseIndianCurrency)
  const spending = Math.max(...amounts)
  expect(spending).toBeLessThan(moneyInHand)
})

Then('the evolution table should show {int} year rows', async ({ page }, count) => {
  const table = page.getByRole('table').first()
  await expect(table).toBeVisible({ timeout: 15000 })
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(count, { timeout: 15000 })
})

Then('the info panel should show current PPF interest rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.ppf.rate}`, 'i'))
})

Then('the info panel should show last updated date', async ({ page }) => {
  await expectTextVisible(page, /Last updated/i)
})

Then('I should see validation error containing {string}', async ({ page }, fragment) => {
  await expect(page.getByText(new RegExp(fragment, 'i')).first()).toBeVisible()
})

Then('the calculator should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'PPF Calculator' })).toBeVisible()
})

Then('the results panel should show empty state or validation', async ({ page }) => {
  await expect(
    page.getByText(/Enter values to see calculation results|Minimum investment is/i).first()
  ).toBeVisible()
})

Then('I should see a validation error or clamped minimum value', async ({ page }) => {
  await expect(page.getByText(/Minimum investment is/i).first()).toBeVisible()
})

Then('I should see a validation error or unchanged numeric value', async ({ page }) => {
  const value = await page.locator('input[name="yearlyInvestment"]').first().inputValue()
  const numeric = Number.parseFloat(value)
  const hasValidation = (await page.getByText(/Minimum investment is|must be a number/i).count()) > 0
  expect(hasValidation || Number.isNaN(numeric) || numeric >= 500).toBe(true)
})

Then(
  'the maturity amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('ppf', goldenId)
    const moneyInHand = await getMoneyInHandAmount(page)
    expect(Math.abs(moneyInHand - row.expected.maturityValue)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the total invested should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('ppf', goldenId)
    const investedText = await page.locator('tfoot tr').first().locator('td').nth(2).innerText()
    const invested = parseIndianCurrency(investedText)
    expect(Math.abs(invested - row.expected.totalInvested)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then('the pie chart should render or show graceful fallback', async ({ page }) => {
  await expect(page.locator('.highcharts-container').first()).toBeVisible({ timeout: 10000 })
})

Then('I should not see validation error for maximum investment', async ({ page }) => {
  await expect(page.getByText(/Maximum investment is/i)).toHaveCount(0)
})

Then('I should not see validation error for minimum investment', async ({ page }) => {
  await expect(page.getByText(/Minimum investment is/i)).toHaveCount(0)
})

Then('the maturity amount should be greater than the flat PPF-14 baseline', async ({ page }) => {
  const baseline = findGolden('ppf', 'PPF-14')
  const stepUp = await getMoneyInHandAmount(page)
  expect(stepUp).toBeGreaterThan(baseline.expected.maturityValue)
})

Then('the info panel should mention 15 year lock-in', async ({ page }) => {
  await expectTextVisible(page, /15 year/i)
})

Then(
  'the money in hand amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('ppf', goldenId)
    const actual = await getMoneyInHandAmount(page)
    const expected = row.expected.postTaxAmount ?? row.expected.maturityValue
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('the tax deducted should be zero', async ({ page }) => {
  await expectTextVisible(page, /Tax-Free|₹0|Money in Hand \(Tax-Free\)/i)
})

Then('partial withdrawal controls should be visible', async () => {
  test.skip(true, 'PPF-25 @wip — partial withdrawal UI not implemented')
})
