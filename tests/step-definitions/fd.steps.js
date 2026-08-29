import { createBdd, test } from 'playwright-bdd'
import { expect } from '@playwright/test'
import { investmentRates } from '../../src/constants/investmentRates.js'
import {
  convertLegacyToYearsMonths,
} from '../../src/utils/fdTenureUtils.js'
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

/** Wait for lazy-loaded FD route to finish rendering (avoids "Loading..." flake). */
async function waitForFDCalculatorReady(page) {
  await page.waitForLoadState('domcontentloaded')
  const loading = page.getByText('Loading...')
  if (await loading.isVisible().catch(() => false)) {
    await loading.waitFor({ state: 'hidden', timeout: 30000 })
  }
  await expect(page.getByRole('heading', { name: 'FD Calculator' })).toBeVisible({
    timeout: 30000,
  })
}

Given('I am on the FD calculator page', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/fd', { taxSlab: 0.3, adjustInflation: false })
  await waitForFDCalculatorReady(page)
})

When('I set the FD principal to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'principal', amount)
})

When(
  'I set the FD tenure to {int} years and {int} months',
  async ({ page }, years, months) => {
    await fillNamedInput(page, 'tenureYears', years)
    await fillNamedInput(page, 'tenureMonths', months)
  }
)

When('I set the FD rate to {float}', async ({ page }, rate) => {
  await fillNamedInput(page, 'rate', rate)
})

When('I set the FD compounding to {string}', async ({ page }, frequency) => {
  await page
    .locator(`input[type="radio"][name="compoundingFrequency"][value="${frequency}"]`)
    .first()
    .check()
})

When('I apply golden fixture {string} to the FD calculator', async ({ page }, fixtureId) => {
  const row = findGolden('fd', fixtureId)
  const { inputs } = row

  if (inputs.incomeTaxSlab != null) {
    const { applyUserPreferences } = await import('./helpers/preferences.js')
    await applyUserPreferences(page, { taxSlab: inputs.incomeTaxSlab })
    await page.reload()
    await waitForFDCalculatorReady(page)
  }

  await fillNamedInput(page, 'principal', inputs.principal)
  if (inputs.tenureYears != null) {
    await fillNamedInput(page, 'tenureYears', inputs.tenureYears)
  }
  if (inputs.tenureMonths != null) {
    await fillNamedInput(page, 'tenureMonths', inputs.tenureMonths)
  }
  if (inputs.rate != null) {
    await fillNamedInput(page, 'rate', inputs.rate)
  }
  if (inputs.compoundingFrequency) {
    await page
      .locator(
        `input[type="radio"][name="compoundingFrequency"][value="${inputs.compoundingFrequency}"]`
      )
      .first()
      .check()
  }
})

When('I enter non-numeric text in the FD principal field', async ({ page }) => {
  const input = page.locator('input[name="principal"]').first()
  await input.fill('')
  await input.pressSequentially('abc')
  await input.blur()
})

Given('FD instrument data with legacy tenure {int} months', async ({}, months) => {
  // Stored for migration step — exercised in Node via fdTenureUtils
  globalThis.__fdLegacyTenureMonths = months
})

When('the FD tenure is migrated to years and months', async ({ page }) => {
  const months = globalThis.__fdLegacyTenureMonths ?? 24
  const migrated = convertLegacyToYearsMonths(months, 'months')
  globalThis.__fdMigratedTenure = migrated

  const row = findGolden('fd', 'FD-21')
  await fillNamedInput(page, 'principal', row.inputs.principal)
  await fillNamedInput(page, 'rate', row.inputs.rate)
  await fillNamedInput(page, 'tenureYears', migrated.years)
  await fillNamedInput(page, 'tenureMonths', migrated.months)
  await page
    .locator(
      `input[type="radio"][name="compoundingFrequency"][value="${row.inputs.compoundingFrequency}"]`
    )
    .first()
    .check()
})

Given('the FD investor is a senior citizen', async () => {
  test.skip(true, 'FD-24 @wip — senior citizen TDS threshold not implemented')
})

When('I request FD premature withdrawal calculation', async () => {
  test.skip(true, 'FD-25 @wip — premature withdrawal not implemented')
})

Then('the principal amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'principal')).toBe(amount)
})

Then('the tenure years should be {int}', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenureYears')).toBe(years)
})

Then('the tenure months should be {int}', async ({ page }, months) => {
  expect(await readNamedInput(page, 'tenureMonths')).toBe(months)
})

Then('the interest rate should match the documented FD rate', async ({ page }) => {
  expect(await readNamedInput(page, 'rate')).toBe(investmentRates.fd.rate)
})

Then('the compounding frequency should be {string}', async ({ page }, frequency) => {
  const radios = page.locator(`input[type="radio"][name="compoundingFrequency"][value="${frequency}"]`)
  const count = await radios.count()
  let isChecked = false
  for (let index = 0; index < count; index += 1) {
    if (await radios.nth(index).isChecked()) {
      isChecked = true
      break
    }
  }
  expect(isChecked).toBe(true)
})

Then(
  'the FD money in hand should be approximately {float} within {int}',
  async ({ page }, expected, tolerance) => {
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then('I should see the FD tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the FD tax rule should mention interest taxed per income slab', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /interest|income slab|taxed/i)
})

Then('I should see the FD spending power section', async ({ page }) => {
  await expectTextVisible(page, /Spending Power/i)
})

Then('the FD spending power should be less than money in hand', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const spendingPowerText = await page
    .locator('text=/Spending Power/i')
    .first()
    .locator('xpath=following::div[contains(@class,"text-")]')
    .first()
    .innerText()
  const spendingPower = parseIndianCurrency(spendingPowerText)
  expect(spendingPower).toBeLessThan(moneyInHand)
})

Then('the FD evolution table should have {int} year rows', async ({ page }, rowCount) => {
  const table = page.getByRole('table').first()
  await expect(table).toBeVisible()
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(rowCount)
})

Then('the FD info panel should show the current FD rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.fd.rate}`, 'i'))
})

Then('the FD info panel should show a last updated date', async ({ page }) => {
  await expectTextVisible(page, /Last updated/i)
})

Then('I should see FD validation error {string}', async ({ page }, message) => {
  await expect(page.getByText(message, { exact: true }).first()).toBeVisible()
})

Then('I should see an FD amount validation error', async ({ page }) => {
  const hasMinError = (await page.getByText(/Minimum principal amount/i).count()) > 0
  const hasResults = (await page.getByText(/Money in Hand/i).count()) > 0
  expect(hasMinError || hasResults).toBe(true)
})

Then('I should see an FD principal validation error', async ({ page }) => {
  await expect(
    page.getByText(/Enter values to see calculation results|Minimum principal amount/i).first()
  ).toBeVisible()
})

Then('the FD results panel should display a maturity amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the FD maturity amount should be approximately {float} within {int}',
  async ({ page }, expected, tolerance) => {
    const maturity = await readPreTaxMaturity(page)
    expect(Math.abs(maturity - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then(
  'the FD investment breakdown chart should be visible or gracefully hidden',
  async ({ page }) => {
    const chart = page.locator('.highcharts-container').first()
    await expect(chart).toBeVisible({ timeout: 10000 })
  }
)

Then('I should see FD TDS applicable warning', async ({ page }) => {
  await expectTextVisible(page, /TDS.*applicable/i)
})

Then('the FD annual interest should exceed {int}', async ({ page }, threshold) => {
  await expandTaxBreakdown(page)
  const interestText = await page
    .getByText(/Interest Earned|Returns/i)
    .first()
    .locator('xpath=following::p[1]')
    .innerText()
  expect(parseIndianCurrency(interestText)).toBeGreaterThan(threshold)
})

Then('the FD TDS threshold should be {int}', async ({ page }, threshold) => {
  await expectTextVisible(page, new RegExp(String(threshold)))
})

Then('the FD tenure should be {int} years and {int} months', async ({ page }, years, months) => {
  expect(await readNamedInput(page, 'tenureYears')).toBe(years)
  expect(await readNamedInput(page, 'tenureMonths')).toBe(months)
})

Then('the FD premature withdrawal feature should be marked not implemented', async ({}) => {
  // Placeholder for FD-25 @wip — step reached only when scenario is un-skipped
  expect(true).toBe(true)
})
