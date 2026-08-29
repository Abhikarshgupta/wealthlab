import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const FIXTURES_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../fixtures/golden'
)

export function loadGolden(instrument) {
  const filePath = path.join(FIXTURES_ROOT, `${instrument}.json`)
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

export function findGolden(instrument, id) {
  const row = loadGolden(instrument).find((entry) => entry.id === id)
  if (!row) {
    throw new Error(`Golden fixture "${id}" not found in ${instrument}.json`)
  }
  return row
}
