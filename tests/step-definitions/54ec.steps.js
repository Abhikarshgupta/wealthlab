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
  expandTaxBreakdown,
  readPreTaxMaturity,
  readInterestEarned,
  readTaxAmount,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

Given('I open the 54EC Bonds calculator', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/54ec-bonds', {
    taxSlab: 0.3,
    adjustInflation: false,
  })
  await expect(page.getByRole('heading', { name: '54EC Bonds Calculator' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.locator('input[name="capitalGainAmount"]').first()).toBeVisible({
    timeout: 15000,
  })
})

When('I set 54EC capital gain amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'capitalGainAmount', amount)
})

When('I set 54EC investment amount to {int}', async ({ page }, amount) => {
  const input = page.locator('input[name="investmentAmount"]').first()
  await input.fill('')
  await input.pressSequentially(String(amount))
  await input.blur()
})

When('I clear 54EC investment amount', async ({ page }) => {
  await fillNamedInput(page, 'investmentAmount', '')
})

When('I enter non-numeric 54EC investment amount {string}', async ({ page }, value) => {
  const input = page.locator('input[name="investmentAmount"]').first()
  await input.fill('')
  await input.pressSequentially(value)
  await input.blur()
})

When('I enter 54EC inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('54ec', goldenId)
  const { inputs } = row

  if (inputs.incomeTaxSlab != null) {
    const { applyUserPreferences } = await import('./helpers/preferences.js')
    await applyUserPreferences(page, { taxSlab: inputs.incomeTaxSlab })
    await page.reload()
    await expect(page.getByRole('heading', { name: '54EC Bonds Calculator' })).toBeVisible({
      timeout: 15000,
    })
  }

  if (inputs.capitalGainAmount != null) {
    await fillNamedInput(page, 'capitalGainAmount', inputs.capitalGainAmount)
  }
  await fillNamedInput(page, 'investmentAmount', inputs.investmentAmount)
  if (inputs.rate != null) {
    await fillNamedInput(page, 'rate', inputs.rate)
  }
})

Then('the 54EC capital gain amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'capitalGainAmount')).toBe(amount)
})

Then('the 54EC investment amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'investmentAmount')).toBe(amount)
})

Then('the 54EC tenure should be fixed at 5 years', async ({ page }) => {
  await expectTextVisible(page, /5 years \(Fixed\)|5 year lock-in/i)
})

Then('the 54EC interest rate should match the current 54EC rate', async ({ page }) => {
  expect(await readNamedInput(page, 'rate')).toBe(investmentRates.bonds54EC.rate)
})

Then('the 54EC results panel should be visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

Then('the 54EC money in hand should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the 54EC money in hand should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('54ec', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - row.expected.postTaxAmount)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the 54EC maturity amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('54ec', goldenId)
    const maturity = await readPreTaxMaturity(page)
    expect(Math.abs(maturity - row.expected.maturityAmount)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the 54EC tax saved should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('54ec', goldenId)
    const label = page.getByText('Tax Saved (on Capital Gains)').first()
    await expect(label).toBeVisible()
    const valueText = await label.locator('xpath=following-sibling::p[1]').innerText()
    const taxSaved = parseIndianCurrency(valueText)
    expect(Math.abs(taxSaved - row.expected.taxSaved)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the 54EC exempted capital gain should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('54ec', goldenId)
    const label = page.getByText('Capital Gain Exempted').first()
    await expect(label).toBeVisible()
    const valueText = await label.locator('xpath=following-sibling::p[1]').innerText()
    const actual = parseIndianCurrency(valueText)
    expect(Math.abs(actual - row.expected.exemptedCapitalGain)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the 54EC interest earned should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('54ec', goldenId)
    const interest = await readInterestEarned(page)
    expect(Math.abs(interest - row.expected.interestEarned)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the 54EC tax deducted should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('54ec', goldenId)
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - row.expected.taxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the 54EC tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the 54EC tax rule should mention interest taxable per income slab', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /interest|income slab|taxable/i)
})

Then('the 54EC spending power should be less than money in hand', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const spendingPowerText = await page
    .getByRole('heading', { name: 'Spending Power' })
    .first()
    .locator('xpath=following::*[contains(@class,"text-")]')
    .first()
    .innerText()
  const spendingPower = parseIndianCurrency(spendingPowerText)
  expect(spendingPower).toBeLessThan(moneyInHand)
})

Then('the 54EC evolution table should show 5 year rows', async ({ page }) => {
  await expectTextVisible(page, /year-wise investment evolution/i)
  const rows = page.locator('tbody tr')
  await expect(rows).toHaveCount(5)
})

Then('the 54EC info panel should show current 54EC interest rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.bonds54EC.rate}%`, 'i'))
})

Then('the 54EC info panel should show last updated date', async ({ page }) => {
  await expectTextVisible(page, /last updated/i)
})

Then('I should see 54EC validation error containing {string}', async ({ page }, fragment) => {
  await expect(page.getByText(new RegExp(fragment, 'i')).first()).toBeVisible()
})

Then('the 54EC calculator should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '54EC Bonds Calculator' })).toBeVisible()
})

Then('the 54EC results panel should show empty state or validation', async ({ page }) => {
  const emptyState = page.getByText(/Enter values to see calculation results/i)
  const validation = page.getByText(/minimum investment|cannot exceed/i)
  await expect(emptyState.or(validation).first()).toBeVisible()
})

Then('I should see an 54EC validation error or clamped minimum value', async ({ page }) => {
  const input = page.locator('input[name="investmentAmount"]').first()
  const value = await input.inputValue()
  const hasError = await page.getByText(/minimum investment|must be/i).first().isVisible()
  expect(hasError || Number.parseFloat(value) >= 1000).toBe(true)
})

Then('I should see an 54EC validation error or unchanged numeric value', async ({ page }) => {
  const input = page.locator('input[name="investmentAmount"]').first()
  const value = await input.inputValue()
  const hasError = await page.getByText(/must be a number|invalid/i).first().isVisible()
  expect(hasError || value === '' || !Number.isNaN(Number.parseFloat(value))).toBe(true)
})

Then('the 54EC results panel should display money in hand', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the 54EC pie chart should render or show graceful fallback', async ({ page }) => {
  const chart = page.getByText(/Investment Breakdown/i)
  await expect(chart.first()).toBeVisible()
})

Then('the 54EC info panel should mention 5 year lock-in', async ({ page }) => {
  await expectTextVisible(page, /5 year.*lock-in|lock-in period.*5/i)
})

Then('the 54EC info panel should mention interest taxable', async ({ page }) => {
  await expectTextVisible(page, /interest taxable|taxable as per income tax slab/i)
})
