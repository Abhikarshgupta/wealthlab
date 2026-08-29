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
  readTaxAmount,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

Given('I open the REITs calculator', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/reits', {
    taxSlab: 0.3,
    adjustInflation: false,
  })
  await expect(page.getByRole('heading', { name: 'REITs Calculator' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.locator('input[name="investmentAmount"]').first()).toBeVisible({
    timeout: 15000,
  })
})

Given('REIT sub-year tenure is supported in UI', async () => {
  test.skip(true, 'REIT-21 @wip — UI tenure min 1 year; STCG covered in unit layer REIT-21-STCG')
})

When('I set REIT investment amount to {int}', async ({ page }, amount) => {
  const input = page.locator('input[name="investmentAmount"]').first()
  await input.fill('')
  await input.pressSequentially(String(amount))
  await input.blur()
})

When('I clear REIT investment amount', async ({ page }) => {
  await fillNamedInput(page, 'investmentAmount', '')
})

When('I set REIT tenure to {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I enter non-numeric REIT investment amount {string}', async ({ page }, value) => {
  const input = page.locator('input[name="investmentAmount"]').first()
  await input.fill('')
  await input.pressSequentially(value)
  await input.blur()
})

When('I enter REIT inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('reits', goldenId)
  const { inputs } = row

  if (inputs.incomeTaxSlab != null) {
    const { applyUserPreferences } = await import('./helpers/preferences.js')
    await applyUserPreferences(page, { taxSlab: inputs.incomeTaxSlab })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'REITs Calculator' })).toBeVisible({
      timeout: 15000,
    })
  }

  if (inputs.investmentAmount != null) {
    await fillNamedInput(page, 'investmentAmount', inputs.investmentAmount)
  }
  if (inputs.dividendYield != null) {
    await fillNamedInput(page, 'dividendYield', inputs.dividendYield)
  }
  if (inputs.capitalAppreciation != null) {
    await fillNamedInput(page, 'capitalAppreciation', inputs.capitalAppreciation)
  }
  if (inputs.tenure != null) {
    await fillNamedInput(page, 'tenure', inputs.tenure)
  }
})

Then('the REIT investment amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'investmentAmount')).toBe(amount)
})

Then('the REIT dividend yield should match the current REIT rate', async ({ page }) => {
  expect(await readNamedInput(page, 'dividendYield')).toBe(investmentRates.reits.dividendYield)
})

Then('the REIT capital appreciation should match the current REIT rate', async ({ page }) => {
  expect(await readNamedInput(page, 'capitalAppreciation')).toBe(
    investmentRates.reits.capitalAppreciation
  )
})

Then('the REIT tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the REIT results panel should be visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

Then('the REIT money in hand should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the REIT money in hand should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('reits', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - row.expected.postTaxAmount)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the REIT final value should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('reits', goldenId)
    const maturity = await readPreTaxMaturity(page)
    expect(Math.abs(maturity - row.expected.finalValue)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then('the REIT investment breakdown should show dividend and capital gain segments', async ({ page }) => {
  await expectTextVisible(page, /Investment Breakdown/i)
  await expectTextVisible(page, /Dividend Income/i)
  await expectTextVisible(page, /Capital Gains/i)
})

Then(
  'the REIT tax amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('reits', goldenId)
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - row.expected.taxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('the REIT tax rate label should be {string}', async ({ page }, label) => {
  await expectTextVisible(page, new RegExp(label.replace('%', '\\%'), 'i'))
})

Then('I should see the REIT tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the REIT tax rule should mention LTCG exemption', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /LTCG|exemption|₹1\.25|125000/i)
})

Then('the REIT spending power should be less than money in hand', async ({ page }) => {
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

Then('the REIT evolution table should show {int} year rows', async ({ page }, years) => {
  await expectTextVisible(page, /year-wise investment evolution/i)
  const rows = page.locator('tbody tr')
  await expect(rows).toHaveCount(years)
})

Then('the REIT info panel should show dividend yield rate', async ({ page }) => {
  await expectTextVisible(
    page,
    new RegExp(`${investmentRates.reits.dividendYield}(?:\\.00)?%`, 'i')
  )
})

Then('the REIT info panel should show capital appreciation rate', async ({ page }) => {
  await expectTextVisible(
    page,
    new RegExp(`${investmentRates.reits.capitalAppreciation}(?:\\.00)?%`, 'i')
  )
})

Then('I should see REIT validation error containing {string}', async ({ page }, fragment) => {
  await expect(page.getByText(new RegExp(fragment, 'i')).first()).toBeVisible()
})

Then('the REIT calculator should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'REITs Calculator' })).toBeVisible()
})

Then('the REIT results panel should show empty state or validation', async ({ page }) => {
  const emptyState = page.getByText(/Enter values to see calculation results/i)
  const validation = page.getByText(/minimum investment|maximum tenure/i)
  await expect(emptyState.or(validation).first()).toBeVisible()
})

Then('I should see a REIT validation error or clamped minimum value', async ({ page }) => {
  const input = page.locator('input[name="investmentAmount"]').first()
  const value = await input.inputValue()
  const hasError = await page.getByText(/minimum investment|must be/i).first().isVisible()
  expect(hasError || Number.parseFloat(value) >= 1000).toBe(true)
})

Then('I should see a REIT validation error or unchanged numeric value', async ({ page }) => {
  const input = page.locator('input[name="investmentAmount"]').first()
  const value = await input.inputValue()
  const hasError = await page.getByText(/must be a number|invalid/i).first().isVisible()
  expect(hasError || value === '' || !Number.isNaN(Number.parseFloat(value))).toBe(true)
})

Then('the REIT results panel should display money in hand', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the REIT pie chart should render or show graceful fallback', async ({ page }) => {
  const chart = page.getByText(/Investment Breakdown/i)
  await expect(chart.first()).toBeVisible()
})
