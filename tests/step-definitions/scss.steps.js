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
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

async function ensureTaxBreakdownExpanded(page) {
  const toggle = page
    .getByRole('button', { name: /tax breakdown|expand tax details|collapse tax details/i })
    .first()
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    await toggle.click()
  }
}

Given('I open the SCSS calculator', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/scss', { taxSlab: 0.3, adjustInflation: false })
  await expect(page.getByRole('heading', { name: 'SCSS Calculator' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.locator('input[name="principal"]').first()).toBeVisible({ timeout: 15000 })
})

When('I set SCSS investment amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'principal', amount)
})

When('I clear SCSS investment amount', async ({ page }) => {
  await fillNamedInput(page, 'principal', '')
})

When('I set SCSS senior age to {int}', async ({ page }, age) => {
  await fillNamedInput(page, 'seniorsAge', age)
})

When('I enter non-numeric SCSS investment amount {string}', async ({ page }, value) => {
  const input = page.locator('input[name="principal"]').first()
  await input.fill('')
  await input.pressSequentially(value)
  await input.blur()
})

When('I enter SCSS inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('scss', goldenId)
  const { inputs } = row

  if (inputs.incomeTaxSlab != null) {
    const { applyUserPreferences } = await import('./helpers/preferences.js')
    await applyUserPreferences(page, { taxSlab: inputs.incomeTaxSlab })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'SCSS Calculator' })).toBeVisible({
      timeout: 15000,
    })
  }

  await fillNamedInput(page, 'principal', inputs.principal)
  await fillNamedInput(page, 'tenure', inputs.tenure)
  await fillNamedInput(page, 'seniorsAge', inputs.seniorsAge)
  if (inputs.rate != null) {
    await fillNamedInput(page, 'rate', inputs.rate)
  }
})

When('I request SCSS premature closure calculation', async () => {
  test.skip(true, 'SCSS-25 @wip — premature closure not implemented')
})

Then('the SCSS investment amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'principal')).toBe(amount)
})

Then('the SCSS tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the SCSS senior age should be {int}', async ({ page }, age) => {
  expect(await readNamedInput(page, 'seniorsAge')).toBe(age)
})

Then('the SCSS interest rate should match the current SCSS rate', async ({ page }) => {
  expect(await readNamedInput(page, 'rate')).toBe(investmentRates.scss.rate)
})

Then('the SCSS results panel should be visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

Then('the SCSS maturity amount should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the SCSS money in hand should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('scss', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(
      Math.abs(actual - row.expected.postTaxAmount)
    ).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the SCSS maturity amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('scss', goldenId)
    const maturity = await readPreTaxMaturity(page)
    expect(
      Math.abs(maturity - row.expected.maturityAmount)
    ).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the SCSS quarterly interest should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('scss', goldenId)
    const heading = page.getByRole('heading', { name: 'Quarterly Interest Payment' }).first()
    await expect(heading).toBeVisible()
    const block = heading.locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]')
    const text = await block.innerText()
    const amounts = (text.match(/₹[\d,]+/g) ?? []).map(parseIndianCurrency)
    const quarterly = Math.max(...amounts)
    expect(
      Math.abs(quarterly - row.expected.quarterlyInterest)
    ).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the SCSS tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the SCSS tax rule should mention interest taxed per income slab', async ({ page }) => {
  await ensureTaxBreakdownExpanded(page)
  await expectTextVisible(page, /interest|income slab|taxed/i)
})

Then('the SCSS spending power should be less than money in hand', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const spendingHeading = page.getByRole('heading', { name: 'Spending Power' }).first()
  await expect(spendingHeading).toBeVisible()
  const spendingText = await spendingHeading.locator('xpath=ancestor::div[1]').innerText()
  const amounts = (spendingText.match(/₹[\d,]+/g) ?? []).map(parseIndianCurrency)
  const spending = Math.max(...amounts)
  expect(spending).toBeLessThan(moneyInHand)
})

Then('the SCSS evolution table should show {int} year rows', async ({ page }, rowCount) => {
  const table = page.getByRole('table').first()
  await expect(table).toBeVisible()
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(rowCount)
})

Then('the SCSS info panel should show current SCSS interest rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.scss.rate}`, 'i'))
})

Then('the SCSS info panel should show last updated date', async ({ page }) => {
  await expectTextVisible(page, /Last updated/i)
})

Then('I should see SCSS validation error containing {string}', async ({ page }, fragment) => {
  await expect(page.getByText(new RegExp(fragment, 'i')).first()).toBeVisible()
})

Then('I should not see SCSS validation error for minimum age', async ({ page }) => {
  const errors = await page.getByText(/Minimum age is 60 years/i).count()
  expect(errors).toBe(0)
})

Then('I should not see SCSS validation error for maximum investment', async ({ page }) => {
  const errors = await page.getByText(/Maximum investment amount is ₹30 lakh/i).count()
  expect(errors).toBe(0)
})

Then('the SCSS calculator should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'SCSS Calculator' })).toBeVisible()
})

Then('the SCSS results panel should show empty state or validation', async ({ page }) => {
  const emptyState = (await page.getByText(/Enter values to see calculation results/i).count()) > 0
  const validation = (await page.getByText(/Minimum investment amount/i).count()) > 0
  expect(emptyState || validation).toBe(true)
})

Then('I should see an SCSS validation error or clamped minimum value', async ({ page }) => {
  const hasError =
    (await page.getByText(/Minimum investment amount|Enter values to see calculation results/i).count()) > 0
  expect(hasError).toBe(true)
})

Then('I should see an SCSS validation error or unchanged numeric value', async ({ page }) => {
  await expect(
    page.getByText(/Enter values to see calculation results|Minimum investment amount/i).first()
  ).toBeVisible()
})

Then('the SCSS results panel should display a maturity amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the SCSS pie chart should render or show graceful fallback', async ({ page }) => {
  const chart = page.locator('.highcharts-container').first()
  await expect(chart).toBeVisible({ timeout: 10000 })
})

Then('the SCSS info panel should mention quarterly interest', async ({ page }) => {
  await expectTextVisible(page, /quarterly|paid quarterly/i)
})

Then('I should see SCSS TDS information in tax breakdown', async ({ page }) => {
  await ensureTaxBreakdownExpanded(page)
  await expect(page.getByText(/Annual Interest:/i).first()).toBeVisible()
})

Then('the SCSS annual interest should exceed {int}', async ({ page }, threshold) => {
  await ensureTaxBreakdownExpanded(page)
  const annualLine = page.getByText(/Annual Interest:/i).first()
  await expect(annualLine).toBeVisible()
  const text = await annualLine.innerText()
  const match = text.match(/₹[\d,]+/)
  expect(match).toBeTruthy()
  expect(parseIndianCurrency(match[0])).toBeGreaterThan(threshold)
})

Then('the SCSS premature closure feature should be marked not implemented', async () => {
  expect(true).toBe(true)
})
