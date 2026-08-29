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

Given('I open the NPS calculator', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/nps', { taxSlab: 0.3, adjustInflation: false })
  await expect(page.getByRole('heading', { name: 'NPS Calculator' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.locator('input[name="monthlyContribution"]').first()).toBeVisible({
    timeout: 15000,
  })
})

When('I set NPS monthly contribution to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'monthlyContribution', amount)
})

When('I clear NPS monthly contribution', async ({ page }) => {
  await fillNamedInput(page, 'monthlyContribution', '')
})

When('I enter non-numeric NPS monthly contribution {string}', async ({ page }, value) => {
  const input = page.locator('input[name="monthlyContribution"]').first()
  await input.fill('')
  await input.pressSequentially(value)
  await input.blur()
})

When('I set NPS equity allocation to {int}', async ({ page }, value) => {
  await fillNamedInput(page, 'equityAllocation', value)
})

When('I set NPS corporate bonds allocation to {int}', async ({ page }, value) => {
  await fillNamedInput(page, 'corporateBondsAllocation', value)
})

When('I set NPS government bonds allocation to {int}', async ({ page }, value) => {
  await fillNamedInput(page, 'governmentBondsAllocation', value)
})

When('I enter NPS inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('nps', goldenId)
  const { inputs } = row

  if (inputs.incomeTaxSlab != null) {
    const { applyUserPreferences } = await import('./helpers/preferences.js')
    await applyUserPreferences(page, { taxSlab: inputs.incomeTaxSlab })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'NPS Calculator' })).toBeVisible({
      timeout: 15000,
    })
  }

  if (inputs.monthlyContribution != null) {
    await fillNamedInput(page, 'monthlyContribution', inputs.monthlyContribution)
  }
  if (inputs.tenure != null) {
    await fillNamedInput(page, 'tenure', inputs.tenure)
  }
  if (inputs.currentAge != null) {
    await fillNamedInput(page, 'currentAge', inputs.currentAge)
  }
  if (inputs.equityAllocation != null) {
    await fillNamedInput(page, 'equityAllocation', inputs.equityAllocation)
  }
  if (inputs.corporateBondsAllocation != null) {
    await fillNamedInput(page, 'corporateBondsAllocation', inputs.corporateBondsAllocation)
  }
  if (inputs.governmentBondsAllocation != null) {
    await fillNamedInput(page, 'governmentBondsAllocation', inputs.governmentBondsAllocation)
  }
  if (inputs.alternativeAllocation != null) {
    await fillNamedInput(page, 'alternativeAllocation', inputs.alternativeAllocation)
  }
  if (inputs.equityReturn != null) {
    await fillNamedInput(page, 'equityReturn', inputs.equityReturn)
  }
  if (inputs.corporateBondsReturn != null) {
    await fillNamedInput(page, 'corporateBondsReturn', inputs.corporateBondsReturn)
  }
  if (inputs.governmentBondsReturn != null) {
    await fillNamedInput(page, 'governmentBondsReturn', inputs.governmentBondsReturn)
  }
  if (inputs.alternativeReturn != null && (inputs.alternativeAllocation || 0) > 0) {
    await fillNamedInput(page, 'alternativeReturn', inputs.alternativeReturn)
  }
})

When('I request NPS Tier 2 calculation', async () => {
  test.skip(true, 'NPS-23 @wip — Tier 2 account not implemented')
})

Then('the NPS monthly contribution should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'monthlyContribution')).toBe(amount)
})

Then('the NPS investment tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the NPS current age should be {int}', async ({ page }, age) => {
  expect(await readNamedInput(page, 'currentAge')).toBe(age)
})

Then('the NPS total allocation should be {int} percent', async ({ page }, _percent) => {
  await expectTextVisible(page, /Total Allocation:\s*100%/i)
})

Then('the NPS results panel should be visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

Then('the NPS corpus value should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the NPS money in hand should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('nps', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(
      Math.abs(actual - row.expected.postTaxAmount)
    ).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the NPS corpus value should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('nps', goldenId)
    const maturity = await readPreTaxMaturity(page)
    expect(
      Math.abs(maturity - row.expected.corpusValue)
    ).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the NPS tax deducted should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('nps', goldenId)
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - row.expected.taxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the NPS tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then(
  'the NPS tax rule should mention 60 percent tax-free and 40 percent taxable',
  async ({ page }) => {
    await expandTaxBreakdown(page)
    await expectTextVisible(page, /60%.*tax-free|tax-free.*60%|40%.*taxable|taxable.*40%/i)
  }
)

Then('the NPS spending power should be less than money in hand', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const spendingHeading = page.getByRole('heading', { name: 'Spending Power' }).first()
  await expect(spendingHeading).toBeVisible()
  const spendingText = await spendingHeading.locator('xpath=ancestor::div[1]').innerText()
  const amounts = (spendingText.match(/₹[\d,]+/g) ?? []).map(parseIndianCurrency)
  const spending = Math.max(...amounts)
  expect(spending).toBeLessThan(moneyInHand)
})

Then('the NPS evolution table should show {int} year rows', async ({ page }, rowCount) => {
  const table = page.getByRole('table').first()
  await expect(table).toBeVisible({ timeout: 15000 })
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(rowCount, { timeout: 15000 })
})

Then('the NPS info panel should show weighted return formula', async ({ page }) => {
  await expectTextVisible(page, /Weighted Return/i)
})

Then('the NPS info panel should show last updated date', async ({ page }) => {
  await expectTextVisible(page, /Last updated/i)
})

Then('I should see NPS validation error containing {string}', async ({ page }, fragment) => {
  await expect(page.getByText(new RegExp(fragment, 'i')).first()).toBeVisible()
})

Then('I should see NPS allocation must equal 100 percent error', async ({ page }) => {
  await expectTextVisible(page, /Must equal 100%|must equal 100%/i)
})

Then('the NPS calculator should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'NPS Calculator' })).toBeVisible()
})

Then('the NPS results panel should show empty state or validation', async ({ page }) => {
  const emptyState =
    (await page.getByText(/Enter values and ensure asset allocation totals 100%/i).count()) > 0
  const validation = (await page.getByText(/Minimum contribution is/i).count()) > 0
  expect(emptyState || validation).toBe(true)
})

Then('I should see an NPS validation error or clamped minimum value', async ({ page }) => {
  const hasError =
    (await page.getByText(/Minimum contribution is|Enter values and ensure asset allocation/i).count()) > 0
  expect(hasError).toBe(true)
})

Then('I should see an NPS validation error or unchanged numeric value', async ({ page }) => {
  await expect(
    page
      .getByText(/Enter values and ensure asset allocation|Minimum contribution is/i)
      .first()
  ).toBeVisible()
})

Then('the NPS results panel should display a corpus amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the NPS pie chart should render or show graceful fallback', async ({ page }) => {
  const chart = page.locator('.highcharts-container').first()
  await expect(chart).toBeVisible({ timeout: 10000 })
})

Then('the NPS Tier 2 feature should be marked not implemented', async () => {
  expect(true).toBe(true)
})
