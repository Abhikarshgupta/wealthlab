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
  selectRadioByValue,
  readTaxAmount,
} from './helpers/page.js'

const { Given, When, Then } = createBdd()

async function waitForDebtMFCalculatorReady(page) {
  await page.waitForLoadState('domcontentloaded')
  const loading = page.getByText('Loading...')
  if (await loading.isVisible().catch(() => false)) {
    await loading.waitFor({ state: 'hidden', timeout: 30000 })
  }
  await expect(page.getByRole('heading', { name: 'Debt Mutual Fund Calculator' })).toBeVisible({
    timeout: 30000,
  })
  await expect(page.locator('input[name="amount"]').first()).toBeVisible({ timeout: 15000 })
}

Given('I am on the debt mutual fund calculator page', async ({ page }) => {
  await gotoWithPreferences(page, '/calculators/debt-mutual-fund', {
    taxSlab: 0.3,
    adjustInflation: false,
  })
  await waitForDebtMFCalculatorReady(page)
})

When('I change the debt MF amount to {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'amount', amount)
})

When('I enter debt MF amount {int}', async ({ page }, amount) => {
  await fillNamedInput(page, 'amount', amount)
})

When('I enter debt MF amount {string}', async ({ page }, amount) => {
  const input = page.locator('input[name="amount"]').first()
  await input.fill('')
  await input.pressSequentially(amount)
  await input.blur()
})

When('I set debt MF tenure to {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I enter debt MF tenure {int} years', async ({ page }, years) => {
  await fillNamedInput(page, 'tenure', years)
})

When('I clear the debt MF amount', async ({ page }) => {
  await fillNamedInput(page, 'amount', '')
})

When('I view the debt MF results panel', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Results' }).first()).toBeVisible()
})

When('I select debt MF investment type {string}', async ({ page }, type) => {
  await selectRadioByValue(page, 'investmentType', type)
})

When('I set debt MF inputs from golden {string}', async ({ page }, goldenId) => {
  const row = findGolden('debt-mutual-fund', goldenId)
  const { inputs } = row

  if (inputs.investmentType) {
    await selectRadioByValue(page, 'investmentType', inputs.investmentType)
  }
  if (inputs.fundType) {
    await page.locator('select[name="fundType"]').first().selectOption(inputs.fundType)
  }
  await fillNamedInput(page, 'amount', inputs.amount)
  await fillNamedInput(page, 'tenure', inputs.tenure)
  if (inputs.expectedReturn != null) {
    await fillNamedInput(page, 'expectedReturn', inputs.expectedReturn)
  }
  await expectTextVisible(page, /Money in Hand/i)
})

Then('the debt MF investment type should be {string}', async ({ page }, type) => {
  const amountInput = page.locator('input[name="amount"]').first()
  if (type === 'sip') {
    await expect(amountInput).toHaveAttribute('placeholder', '5000')
  } else {
    await expect(amountInput).toHaveAttribute('placeholder', '100000')
  }
})

Then('the debt MF amount should be {int}', async ({ page }, amount) => {
  expect(await readNamedInput(page, 'amount')).toBe(amount)
})

Then('the debt MF tenure should be {int} years', async ({ page }, years) => {
  expect(await readNamedInput(page, 'tenure')).toBe(years)
})

Then('the debt MF expected return should match the short-term fund default rate', async ({ page }) => {
  expect(await readNamedInput(page, 'expectedReturn')).toBe(investmentRates.debtMutualFund.shortTerm)
})

Then('the debt MF corpus value should update without clicking calculate', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then('I should see the debt MF money in hand amount', async ({ page }) => {
  await expectTextVisible(page, /Money in Hand/i)
})

Then(
  'the debt MF post-tax amount should be less than or equal to the corpus value',
  async ({ page }) => {
    const moneyInHand = await getMoneyInHandAmount(page)
    const corpus = await readPreTaxMaturity(page)
    expect(moneyInHand).toBeLessThanOrEqual(corpus)
  }
)

Then('I should see the debt MF tax breakdown section', async ({ page }) => {
  await expectTextVisible(page, /Tax Breakdown/i)
})

Then('the debt MF tax rule should mention indexation benefit', async ({ page }) => {
  await expandTaxBreakdown(page)
  await expectTextVisible(page, /indexation|indexed/i)
})

Then('I should see debt MF actual spending power adjusted for inflation', async ({ page }) => {
  await expectTextVisible(page, /Spending Power/i)
})

Then('I should see the debt MF evolution table', async ({ page }) => {
  await expectTextVisible(page, /Year-wise Investment Evolution/i)
})

Then('the debt MF evolution table should have at least {int} year row', async ({ page }, minRows) => {
  const rows = page.getByRole('table').first().locator('tbody tr')
  expect(await rows.count()).toBeGreaterThanOrEqual(minRows)
})

Then('I should see the debt MF info panel', async ({ page }) => {
  await expectTextVisible(page, /About Debt Mutual Funds/i)
})

Then('the debt MF info panel should show short-term debt return rate', async ({ page }) => {
  await expectTextVisible(
    page,
    new RegExp(`${investmentRates.debtMutualFund.shortTerm}`, 'i')
  )
})

Then('I should see debt MF validation error {string}', async ({ page }, message) => {
  await expect(page.getByText(message, { exact: true }).first()).toBeVisible()
})

Then('the debt MF calculator should show empty results state', async ({ page }) => {
  await expectTextVisible(page, /Enter values to see calculation results/i)
})

Then('the debt MF page should not crash', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Debt Mutual Fund Calculator' })).toBeVisible()
})

Then('I should see a debt MF validation error or the value should be rejected', async ({ page }) => {
  await expect(
    page.getByText(/Minimum investment amount|must be a number/i).first()
  ).toBeVisible()
})

Then('I should see a debt MF validation error for amount', async ({ page }) => {
  await expect(page.getByText(/Minimum investment amount|must be a number/i).first()).toBeVisible()
})

Then(
  'the debt MF corpus value should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then(
  'the debt MF corpus value should match golden {string} field corpusValue',
  async ({ page }, goldenId) => {
    const row = findGolden('debt-mutual-fund', goldenId)
    const corpus = await readPreTaxMaturity(page)
    expect(Math.abs(corpus - row.expected.corpusValue)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then(
  'the debt MF post-tax amount should match golden {string} field postTaxAmount',
  async ({ page }, goldenId) => {
    const row = findGolden('debt-mutual-fund', goldenId)
    const actual = await getMoneyInHandAmount(page)
    expect(Math.abs(actual - row.expected.postTaxAmount)).toBeLessThanOrEqual(row.expected.tolerance)
  }
)

Then('I should see the debt MF investment breakdown chart or fallback', async ({ page }) => {
  await expect(page.locator('.highcharts-container').first()).toBeVisible({ timeout: 10000 })
})

Then('the debt MF tax rate label should be {string}', async ({ page }, label) => {
  await expect(page.getByText(label, { exact: false }).first()).toBeVisible()
})

Then(
  'the debt MF tax amount should be approximately {int} within tolerance {int}',
  async ({ page }, expected, tolerance) => {
    const tax = await readTaxAmount(page)
    expect(Math.abs(tax - expected)).toBeLessThanOrEqual(tolerance)
  }
)

Then('I should see debt MF indexation benefit details', async ({ page }) => {
  await expectTextVisible(page, /Indexation Benefit Calculation/i)
})
