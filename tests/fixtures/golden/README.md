# Golden value fixtures (DS-4)

Per-instrument JSON files hold **verified expected outputs** keyed by scenario ID.

## Record shape

See `_template.json`. Required fields:

| Field | Description |
|-------|-------------|
| `id` | Scenario ID matching Gherkin + unit tests (e.g. `FD-14`) |
| `pathType` | `HP` \| `BD` \| `EG` \| `XF` \| `DG` |
| `inputs` | Calculator inputs |
| `expected` | Outputs + `tolerance` for numeric asserts |
| `verifiedAgainst` | Evidence (spreadsheet, external tool) |
| `caReviewed` | `true` for `@tax` rows before I2 merge |

## Rules

- One file per instrument: `fd.json`, `sip.json`, …
- Unit tests load by ID: `golden.find((r) => r.id === 'FD-14')`
- Do not change `expected` to match buggy code — fix code or tag `@known-bug`
- Minimum 5 rows per calculator when workstream T3 completes (2 HP, 2 BD, 1 tax)

## Verification

1. Recompute in spreadsheet using `investmentRates.js` defaults.
2. Cross-check one external calculator where available.
3. CA sign-off for tax rows (see `regulatory/README.md`).
