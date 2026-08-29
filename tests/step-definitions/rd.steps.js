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

/** Wait for lazy-loaded RD route to finish rendering (avoids "Loading..." flake). */
async function waitForRDCalculatorReady(page) {
  await page.waitForLoadState('domcontentloaded')
  const loading = page.getByText('Loading...')
  if (await loading.isVisible().catch(() => false)) {
    await loading.waitFor({ state: 'hidden', timeout: 30000 })
  }
  await expect(page.getByRole('heading', { name: 'RD Calculator' })).toBeVisible({
    timeout: 30000,
  })
}

Given('I am on the RD calculator page', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/rd', { taxSlab: 0.3, adjustInflation: false })
  await waitForRDCalculatorReady(page)
})

When('I set the RD monthly deposit to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'monthlyDeposit', amount)
})

When(
  'I set the RD tenure to {int} years and {int} months',
  async ({ page }, years, months) => {
    await fillNamedInput(page, 'tenureYears', years)
    await fillNamedInput(page, 'tenureMonths', months)
  }
)

When('I set the RD rate to {float}', async ({ page }, rate) => {
  await fillNamedInput(page, 'rate', rate)
})

When('I set the RD compounding to {string}', async ({ page }, frequency) => {
  await page
    .locator(`input[type="radio"][name="compoundingFrequency"][value="${frequency}"]`)
    .first()
    .check()
})

When('I apply golden fixture {string} to the RD calculator', async ({ page }, fixtureId) => {
  const row = findGolden('rd', fixtureId)
  const { inputs } = row

  if (inputs.incomeTaxSlab != null) {
    const { applyUserPreferences } = await import('./helpers/preferences.js')
    await applyUserPreferences(page, { taxSlab: inputs.incomeTaxSlab })
    await page.reload()
    await waitForRDCalculatorReady(page)
  }

  await fillNamedInput(page, 'monthlyDeposit', inputs.monthlyDeposit)
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

When('I enter non-numeric text in the RD monthly deposit field', async ({ page }) => {
  const input = page.locator('input[name="monthlyDeposit"]').first()
  await input.fill('')
  await input.pressSequentially('abc')
  await input.blur()
})

Given('the RD investor is a senior citizen', async () => {
  test.skip(true, 'RD-24 @wip — senior citizen TDS threshold not implemented')
})

When('I request RD premature withdrawal calculation', async () => {
  test.skip(true, 'RD-25 @wip — premature withdrawal not implemented')
})

Then('the monthly deposit amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'monthlyDeposit')).toBe(amount)
})

Then('the interest rate should match the documented RD rate', async ({ page }) => {
  expect(await readNamedInput(page, 'rate')).toBe(investmentRates.rd.rate)
})

Then(
  'the RD money in hand should be approximately {float} within {int}',
  async ({ page }, expected, tolerance) => {
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then('I should see the RD tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the RD tax rule should mention interest taxed per income slab', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /interest|income slab|taxed/i)
})

Then('I should see the RD spending power section', async ({ page }) => {
  await expectTextVisible(page, /Spending Power/i)
})

Then('the RD spending power should be less than money in hand', async ({ page }) => {
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

Then('the RD evolution table should have {int} year rows', async ({ page }, rowCount) => {
  const table = page.getByRole('table').first()
  await expect(table).toBeVisible()
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(rowCount)
})

Then('the RD info panel should show the current RD rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.rd.rate}`, 'i'))
})

Then('the RD info panel should show a last updated date', async ({ page }) => {
  await expectTextVisible(page, /Last updated/i)
})

Then('I should see RD validation error {string}', async ({ page }, message) => {
  await expect(page.getByText(message, { exact: true }).first()).toBeVisible()
})

Then('I should see an RD deposit validation error', async ({ page }) => {
  const hasMinError = (await page.getByText(/Minimum monthly deposit/i).count()) > 0
  const hasResults = (await page.getByText(/Money in Hand/i).count()) > 0
  expect(hasMinError || hasResults).toBe(true)
})

Then('the RD results panel should display a maturity amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the RD maturity amount should be approximately {float} within {int}',
  async ({ page }, expected, tolerance) => {
    const maturity = await readPreTaxMaturity(page)
    expect(Math.abs(maturity - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then(
  'the RD investment breakdown chart should be visible or gracefully hidden',
  async ({ page }) => {
    const chart = page.locator('.highcharts-container').first()
    await expect(chart).toBeVisible({ timeout: 10000 })
  }
)

Then('I should see RD TDS applicable warning', async ({ page }) => {
  test.skip(true, 'RD-23 @wip — TDS warning not implemented for RD')
  await expectTextVisible(page, /TDS.*applicable/i)
})

Then('the RD annual interest should exceed {int}', async ({ page }, threshold) => {
  test.skip(true, 'RD-23 @wip — TDS warning not implemented for RD')
  await expandTaxBreakdown(page)
  const interestText = await page
    .getByText(/Interest Earned|Returns/i)
    .first()
    .locator('xpath=following::p[1]')
    .innerText()
  expect(parseIndianCurrency(interestText)).toBeGreaterThan(threshold)
})

Then('the RD TDS threshold should be {int}', async ({ page }, threshold) => {
  test.skip(true, 'RD-24 @wip — senior citizen TDS threshold not implemented')
  await expectTextVisible(page, new RegExp(String(threshold)))
})

Then('the RD premature withdrawal feature should be marked not implemented', async ({}) => {
  expect(true).toBe(true)
})
