import { expect } from '@playwright/test'

export function parseIndianCurrency(text) {
  const normalized = text.replace(/[^\d.-]/g, '').replace(/,/g, '')
  return Number.parseFloat(normalized)
}

export async function fillNamedInput(page, name, value) {
  const input = page.locator(`input[name="${name}"]`).first()
  await input.waitFor({ state: 'visible' })
  await input.fill('')
  if (value !== '') {
    await input.fill(String(value))
  }
  await input.blur()
}

export async function readNamedInput(page, name) {
  const value = await page.locator(`input[name="${name}"]`).first().inputValue()
  return Number.parseFloat(value)
}

export async function selectRadioByValue(page, name, value) {
  await page.locator(`input[type="radio"][name="${name}"][value="${value}"]`).first().check()
}

export async function expectTextVisible(page, pattern) {
  await expect(page.getByText(pattern).first()).toBeVisible()
}

export async function getMoneyInHandAmount(page) {
  const heading = page.getByRole('heading', { name: /Money in Hand/i }).first()
  await heading.waitFor({ state: 'visible', timeout: 15000 })
  const block = heading.locator('xpath=ancestor::div[contains(@class,"rounded")][1]')
  const text = await block.innerText()
  const amounts = (text.match(/₹[\d,]+/g) ?? []).map(parseIndianCurrency)
  if (amounts.length === 0) {
    throw new Error(`No currency amount found near Money in Hand: ${text}`)
  }
  return Math.max(...amounts)
}

export async function readTaxAmount(page) {
  const hero = page
    .locator('div')
    .filter({ has: page.getByRole('heading', { name: /Money in Hand/i }) })
    .first()
  const heroText = await hero.innerText()
  const heroMatch = heroText.match(/Tax Deducted:\s*(₹[\d,]+)/i)
  if (heroMatch) {
    return parseIndianCurrency(heroMatch[1])
  }

  await expandTaxBreakdown(page)
  const breakdownText = await page
    .locator('div')
    .filter({ hasText: 'Tax Deducted' })
    .first()
    .innerText()
  const breakdownMatch = breakdownText.match(/₹[\d,]+/)
  return breakdownMatch ? parseIndianCurrency(breakdownMatch[0]) : 0
}

export async function expandTaxBreakdown(page) {
  const toggle = page
    .getByRole('button', { name: /tax breakdown|expand tax details|collapse tax details/i })
    .first()
  await toggle.click()
}

export async function readPreTaxMaturity(page) {
  await expandTaxBreakdown(page)
  const maturityLocator = page
    .getByText('Maturity Amount (Pre-Tax)')
    .locator('xpath=following-sibling::p[1]')
    .first()
  return parseIndianCurrency(await maturityLocator.innerText())
}

export async function readInterestEarned(page) {
  await expandTaxBreakdown(page)
  const label = page.getByText(/^Interest Earned$|^Capital Gains$/).first()
  const value = label.locator('xpath=following-sibling::p[1]')
  return parseIndianCurrency(await value.innerText())
}

export async function clickStepUpToggle(page, labelText) {
  const card = page.locator('.card').filter({ hasText: 'Investment Details' }).first()
  const row = card.getByText(labelText, { exact: true }).locator('xpath=ancestor::div[1]/..')
  await row.getByRole('switch').click()
}
