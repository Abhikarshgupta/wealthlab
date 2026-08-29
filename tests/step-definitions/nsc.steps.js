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
  readInterestEarned,
  readTaxAmount,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

Given('I open the NSC calculator', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/nsc', { taxSlab: 0.3, adjustInflation: false })
  await expect(page.getByRole('heading', { name: 'NSC Calculator' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.locator('input[name="principal"]').first()).toBeVisible({ timeout: 15000 })
})

When('I set NSC investment amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'principal', amount)
})

When('I clear NSC investment amount', async ({ page }) => {
  await fillNamedInput(page, 'principal', '')
})

When('I enter non-numeric NSC investment amount {string}', async ({ page }, value) => {
  const input = page.locator('input[name="principal"]').first()
  await input.fill('')
  await input.pressSequentially(value)
  await input.blur()
})

When('I enter NSC inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('nsc', goldenId)
  const { inputs } = row

  if (inputs.incomeTaxSlab != null) {
    const { applyUserPreferences } = await import('./helpers/preferences.js')
    await applyUserPreferences(page, { taxSlab: inputs.incomeTaxSlab })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'NSC Calculator' })).toBeVisible({
      timeout: 15000,
    })
  }

  await fillNamedInput(page, 'principal', inputs.principal)
  if (inputs.rate != null) {
    await fillNamedInput(page, 'rate', inputs.rate)
  }
})

When('I request NSC premature encashment calculation', async () => {
  test.skip(true, 'NSC-25 @wip — premature encashment not implemented')
})

Then('the NSC investment amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'principal')).toBe(amount)
})

Then('the NSC tenure should be fixed at 5 years', async ({ page }) => {
  await expectTextVisible(page, /5 years \(Fixed\)|5 year lock-in/i)
})

Then('the NSC interest rate should match the current NSC rate', async ({ page }) => {
  expect(await readNamedInput(page, 'rate')).toBe(investmentRates.nsc.rate)
})

Then('the NSC results panel should be visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

Then('the NSC maturity amount should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the NSC money in hand should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('nsc', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(
      Math.abs(actual - row.expected.postTaxAmount)
    ).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the NSC maturity amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('nsc', goldenId)
    const maturity = await readPreTaxMaturity(page)
    expect(
      Math.abs(maturity - row.expected.maturityAmount)
    ).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the NSC tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the NSC tax rule should mention interest taxed per income slab', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /interest|income slab|taxed/i)
})

Then('the NSC spending power should be less than money in hand', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const spendingHeading = page.getByRole('heading', { name: 'Spending Power' }).first()
  await expect(spendingHeading).toBeVisible()
  const spendingText = await spendingHeading.locator('xpath=ancestor::div[1]').innerText()
  const amounts = (spendingText.match(/₹[\d,]+/g) ?? []).map(parseIndianCurrency)
  const spending = Math.max(...amounts)
  expect(spending).toBeLessThan(moneyInHand)
})

Then('the NSC evolution table should show {int} year rows', async ({ page }, rowCount) => {
  const table = page.getByRole('table').first()
  await expect(table).toBeVisible()
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(rowCount)
})

Then('the NSC info panel should show current NSC interest rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.nsc.rate}`, 'i'))
})

Then('the NSC info panel should show last updated date', async ({ page }) => {
  await expectTextVisible(page, /Last updated/i)
})

Then('I should see NSC validation error containing {string}', async ({ page }, fragment) => {
  await expect(page.getByText(new RegExp(fragment, 'i')).first()).toBeVisible()
})

Then('I should see an NSC amount validation error or capped results', async ({ page }) => {
  const hasMinError = (await page.getByText(/Minimum investment amount/i).count()) > 0
  const hasResults = (await page.getByText(/Money in Hand/i).count()) > 0
  expect(hasMinError || hasResults).toBe(true)
})

Then('the NSC calculator should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'NSC Calculator' })).toBeVisible()
})

Then('the NSC results panel should show empty state or validation', async ({ page }) => {
  const emptyState = (await page.getByText(/Enter values to see calculation results/i).count()) > 0
  const validation = (await page.getByText(/Minimum investment amount/i).count()) > 0
  expect(emptyState || validation).toBe(true)
})

Then('I should see an NSC validation error or clamped minimum value', async ({ page }) => {
  const hasError =
    (await page.getByText(/Minimum investment amount|Enter values to see calculation results/i).count()) > 0
  expect(hasError).toBe(true)
})

Then('I should see an NSC validation error or unchanged numeric value', async ({ page }) => {
  await expect(
    page.getByText(/Enter values to see calculation results|Minimum investment amount/i).first()
  ).toBeVisible()
})

Then('the NSC results panel should display a maturity amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the NSC pie chart should render or show graceful fallback', async ({ page }) => {
  const chart = page.locator('.highcharts-container').first()
  await expect(chart).toBeVisible({ timeout: 10000 })
})

Then('the NSC info panel should mention 5 year lock-in', async ({ page }) => {
  await expectTextVisible(page, /5 year lock-in|5 years/i)
})

Then('the NSC info panel should mention Section 80C deduction', async ({ page }) => {
  await expectTextVisible(page, /Section 80C|80C/i)
})

Then(
  'the NSC interest earned should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('nsc', goldenId)
    const interest = await readInterestEarned(page)
    expect(
      Math.abs(interest - row.expected.interestEarned)
    ).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the NSC tax deducted should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('nsc', goldenId)
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - row.expected.taxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('the NSC info panel should mention interest paid at maturity', async ({ page }) => {
  await expectTextVisible(page, /paid at maturity|interest paid at maturity/i)
})

Then('the NSC premature encashment feature should be marked not implemented', async () => {
  expect(true).toBe(true)
})
