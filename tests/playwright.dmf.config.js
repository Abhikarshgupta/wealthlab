import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const testDir = defineBddConfig({
  featuresRoot: rootDir,
  features: path.join(rootDir, 'tests/features/calculators/debt-mutual-fund.feature'),
  steps: [
    path.join(rootDir, 'tests/support/fixtures.js'),
    path.join(rootDir, 'tests/step-definitions/common.steps.js'),
    path.join(rootDir, 'tests/step-definitions/debt-mutual-fund.steps.js'),
  ],
  outputDir: path.join(rootDir, '.features-gen-dmf'),
  disableWarnings: { importTestFrom: true },
})

export default defineConfig({
  testDir,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
