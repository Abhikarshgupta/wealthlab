# WealthLab test suite

Executable test contract for calculators, corpus simulator, and app shell.

**Strategy:** [`docs/TESTING_STRATEGY.md`](../docs/TESTING_STRATEGY.md)  
**Implementation:** [`docs/TESTING_IMPLEMENTATION_GUIDE.md`](../docs/TESTING_IMPLEMENTATION_GUIDE.md)  
**Parallel tasks:** [`docs/TESTING_PARALLEL_TASKS.md`](../docs/TESTING_PARALLEL_TASKS.md)  
**Agent skill:** [`.cursor/skills/calculator-test-suite/SKILL.md`](../.cursor/skills/calculator-test-suite/SKILL.md)

## Folder layout

```
tests/
├── features/           # Gherkin — source of truth
│   ├── _shared/        # Tags, IDs, conventions
│   ├── app/            # Navigation, theme
│   └── calculators/    # One .feature per instrument (copy from tests/templates/)
├── step-definitions/   # Playwright BDD glue
├── fixtures/
│   ├── regulatory/     # DS-3 tax tables (CA-reviewed)
│   ├── golden/         # DS-4 expected values per scenario ID
│   └── adversarial/    # DS-6 bad payloads
├── support/            # BDD fixtures
└── TRACEABILITY.md     # ID → layer mapping
```

## Run locally

| Command | What it runs |
|---------|----------------|
| `npm test` | Vitest (existing co-located `*.test.jsx`) |
| `npm run test:unit` | `src/__unit__/` pure util tests |
| `npm run test:integration` | `src/__integration__/` RTL integration tests |
| `npm run test:gherkin` | Playwright BDD — all features |
| `npm run test:gherkin:smoke` | `@smoke` tagged scenarios only |

### First-time Gherkin setup

```bash
npx playwright install chromium
npm run test:gherkin:smoke
```

Starts Vite dev server automatically (`playwright.config.js` `webServer`).

## Gherkin runner choice (P1)

**Playwright + playwright-bdd** — Gherkin maps to real browser navigation; SPA routing via Vite dev server.

Generated specs: `.features-gen/` (gitignored).

## Contributing a calculator (W1+)

1. Read your `TASK-W*` block in `TESTING_PARALLEL_TASKS.md`
2. Follow 6-step skill: T1 → T2 → T3 (spec), then I1 → I2 → I3 (green)
3. Append rows to `TRACEABILITY.md` under your prefix only
4. Own files: `golden/{id}.json`, `{id}.feature`, unit/integration for your prefix

## Tags

See [`features/_shared/conventions.md`](features/_shared/conventions.md).

## CA sign-off

Tax scenarios (`@tax`) require CA review before I2 merge. Process: [`fixtures/regulatory/README.md`](fixtures/regulatory/README.md).
