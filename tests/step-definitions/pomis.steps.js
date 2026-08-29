import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'
import { investmentRates } from '../../src/constants/investmentRates.js'
import { findGolden } from './helpers/golden.js'
import { gotoWithPreferences, getPendingPreferences } from './helpers/preferences.js'
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

async function waitForPOMISCalculatorReady(page) {
  await page.waitForLoadState('domcontentloaded')
  const loading = page.getByText('Loading...')
  if (await loading.isVisible().catch(() => false)) {
    await loading.waitFor({ state: 'hidden', timeout: 30000 })
  }
  await expect(page.getByRole('heading', { name: 'POMIS Calculator' })).toBeVisible({
    timeout: 30000,
  })
}

Given('I open the POMIS calculator', async ({ page }) => {
  const prefs = getPendingPreferences()
  await gotoWithPreferences(page, '/calculators/pomis', {
    taxSlab: prefs.taxSlab ?? 0.3,
    adjustInflation: prefs.adjustInflation ?? false,
  })
  await waitForPOMISCalculatorReady(page)
})

When('I set POMIS investment amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'principal', amount)
})

When('I clear POMIS investment amount', async ({ page }) => {
  await fillNamedInput(page, 'principal', '')
})

When('I enter non-numeric POMIS investment amount {string}', async ({ page }, value) => {
  const input = page.locator('input[name="principal"]').first()
  await input.fill('')
  await input.pressSequentially(value)
  await input.blur()
})

async function setPOMISJointAccount(page, enabled) {
  const panel = page.getByRole('heading', { name: 'Investment Details' }).locator(
    'xpath=ancestor::div[contains(@class,"space-y")][1]'
  )
  const toggle = panel.getByRole('switch')
  await toggle.waitFor({ state: 'visible', timeout: 15000 })
  const checked = (await toggle.getAttribute('aria-checked')) === 'true'
  if (checked !== enabled) {
    await toggle.click()
  }
}

When('POMIS joint account is enabled', async ({ page }) => {
  await setPOMISJointAccount(page, true)
})

When('I enter POMIS inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('pomis', goldenId)
  const { inputs } = row

  if (inputs.incomeTaxSlab != null) {
    const { applyUserPreferences } = await import('./helpers/preferences.js')
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('user-preferences-storage')
      return raw ? JSON.parse(raw).state : {}
    })
    await applyUserPreferences(page, {
      taxSlab: inputs.incomeTaxSlab,
      adjustInflation: stored.adjustInflation ?? false,
      inflationRate: stored.defaultInflationRate ?? 6,
    })
    await page.reload()
    await waitForPOMISCalculatorReady(page)
  }

  const wantJoint = Boolean(inputs.isJointAccount)
  await setPOMISJointAccount(page, wantJoint)

  await fillNamedInput(page, 'principal', inputs.principal)
  if (inputs.rate != null) {
    await fillNamedInput(page, 'rate', inputs.rate)
  }
})

Then('the POMIS investment amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'principal')).toBe(amount)
})

Then('the POMIS interest rate should match the current POMIS rate', async ({ page }) => {
  expect(await readNamedInput(page, 'rate')).toBe(investmentRates.pomis.rate)
})

Then('the POMIS tenure should be fixed at 5 years', async ({ page }) => {
  await expectTextVisible(page, /Fixed at.*5 years|5 years.*POMIS/i)
})

Then('the POMIS results panel should be visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

Then('the POMIS results panel should display money in hand', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Money in Hand/i }).first()).toBeVisible({
    timeout: 15000,
  })
})

Then(
  'the POMIS money in hand should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('pomis', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - row.expected.postTaxAmount)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then('I should see the POMIS tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the POMIS tax rule should mention interest taxed per income slab', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /interest|income slab|taxed/i)
})

Then('the POMIS spending power should be less than money in hand', async ({ page }) => {
  const moneyInHand = await getMoneyInHandAmount(page)
  const spendingHeading = page.getByRole('heading', { name: 'Spending Power' }).first()
  await expect(spendingHeading).toBeVisible({ timeout: 15000 })
  const spendingText = await spendingHeading.locator('xpath=ancestor::div[1]').innerText()
  const amounts = (spendingText.match(/₹[\d,]+/g) ?? []).map(parseIndianCurrency)
  const spendingPower = Math.max(...amounts)
  expect(spendingPower).toBeLessThan(moneyInHand)
})

Then('the POMIS evolution table should show {int} year rows', async ({ page }, rowCount) => {
  const table = page.getByRole('table').first()
  await expect(table).toBeVisible()
  const rows = table.locator('tbody tr')
  await expect(rows).toHaveCount(rowCount)
})

Then('the POMIS info panel should show current POMIS interest rate', async ({ page }) => {
  await expectTextVisible(page, new RegExp(`${investmentRates.pomis.rate}`, 'i'))
})

Then('the POMIS info panel should show last updated date', async ({ page }) => {
  await expectTextVisible(page, /Last updated/i)
})

Then('the POMIS info panel should mention 5 year lock-in', async ({ page }) => {
  await expectTextVisible(page, /5 year/i)
})

Then('I should see POMIS validation error containing {string}', async ({ page }, fragment) => {
  await expect(page.getByText(new RegExp(fragment, 'i')).first()).toBeVisible()
})

Then(
  'I should see a POMIS amount validation error or empty results for single account',
  async ({ page }) => {
    const hasMaxError =
      (await page.getByText(/Maximum investment amount|9 lakh/i).count()) > 0
    const hasEmptyState =
      (await page.getByText(/Enter values to see calculation results/i).count()) > 0
    expect(hasMaxError || hasEmptyState).toBe(true)
  }
)

Then('the POMIS calculator should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'POMIS Calculator' })).toBeVisible()
})

Then('the POMIS results panel should show empty state or validation', async ({ page }) => {
  const hasEmpty =
    (await page.getByText(/Enter values to see calculation results/i).count()) > 0
  const hasValidation = (await page.getByText(/Minimum investment amount/i).count()) > 0
  expect(hasEmpty || hasValidation).toBe(true)
})

Then('I should see a POMIS validation error or clamped minimum value', async ({ page }) => {
  const hasMinError = (await page.getByText(/Minimum investment amount/i).count()) > 0
  const principal = await readNamedInput(page, 'principal')
  expect(hasMinError || principal >= 1000).toBe(true)
})

Then('I should see a POMIS validation error or unchanged numeric value', async ({ page }) => {
  const hasError =
    (await page.getByText(/Minimum investment amount|must be a number/i).count()) > 0
  const principal = await readNamedInput(page, 'principal')
  expect(hasError || Number.isFinite(principal)).toBe(true)
})

Then(
  'the POMIS maturity amount should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('pomis', goldenId)
    const maturity = await readPreTaxMaturity(page)
    expect(Math.abs(maturity - row.expected.maturityAmount)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the POMIS monthly interest should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('pomis', goldenId)
    await expectTextVisible(page, /Monthly Income Payment/i)
    const block = page.getByText(/Monthly Income Payment/i).first().locator('xpath=ancestor::div[contains(@class,"rounded")][1]')
    const text = await block.innerText()
    const amounts = (text.match(/₹[\d,]+(?:\.\d+)?/g) ?? []).map(parseIndianCurrency)
    const monthly = amounts.find((v) => Math.abs(v - row.expected.monthlyInterest) <= row.expected.tolerance)
    expect(monthly).toBeDefined()
  }
)

Then(
  'the POMIS monthly income payment should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('pomis', goldenId)
    await expectTextVisible(page, /Monthly Income Payment/i)
    const paymentText = await page
      .getByText(/Monthly Income Payment/i)
      .first()
      .locator('xpath=following::*[contains(text(),"₹")][1]')
      .innerText()
    const actual = parseIndianCurrency(paymentText)
    expect(Math.abs(actual - row.expected.monthlyInterest)).toBeLessThanOrEqual(
      row.expected.tolerance
    )
  }
)

Then(
  'the POMIS tax deducted should match golden {string} within tolerance',
  async ({ page }, goldenId) => {
    const row = findGolden('pomis', goldenId)
    const actual = await readTaxAmount(page)
    expect(Math.abs(actual - row.expected.taxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('the POMIS pie chart should render or show graceful fallback', async ({ page }) => {
  const chart = page.locator('.highcharts-container').first()
  await expect(chart).toBeVisible({ timeout: 10000 })
})

Then('I should see POMIS TDS applicable warning', async ({ page }) => {
  await expectTextVisible(page, /TDS.*applicable/i)
})

Then('the POMIS annual interest should exceed {int}', async ({ page }, threshold) => {
  await expectTextVisible(page, /Annual Interest/i)
  const annualText = await page
    .getByText(/Annual Interest/i)
    .first()
    .locator('xpath=following::p[1]')
    .innerText()
  expect(parseIndianCurrency(annualText)).toBeGreaterThan(threshold)
})
