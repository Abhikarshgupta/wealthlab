# Scenario ID convention (P4)

## Format

```
{PREFIX}-{NN}
```

| Prefix | Surface |
|--------|---------|
| `NAV`, `THM`, `PREF` | App / preferences |
| `FD`, `SIP`, `PPF`, … | Calculators (see TESTING_STRATEGY §4.2) |
| `CORP` | Corpus simulator |

- `NN` is zero-padded 2 digits: `01`, `14`, `25`
- Same ID in: Gherkin scenario name, golden JSON `id`, unit `it('{ID}: …')`, TRACEABILITY row

## Tags (P5)

| Tag | CI filter | Meaning |
|-----|-----------|---------|
| `@smoke` | `test:gherkin:smoke` | Fast critical path |
| `@regression` | nightly / pre-release | Full calculator regression |
| `@tax` | with CA review | Tax/regulatory output |
| `@edge` | optional | Boundaries, invalid input |
| `@known-bug` | allowed fail | Documents intent; link GitHub issue |
| `@wip` | excluded from CI | Spec stub, not implemented |
| `@calculator-{id}` | per instrument | e.g. `@calculator-fd` |
| `@corpus` | corpus suite | Multi-step simulator |
| `@app` | app shell | Navigation, theme |

## Gherkin vocabulary

Reuse step phrases from `tests/step-definitions/` — add new steps only when no existing phrase fits.

## Backgrounds

Shared setup (default tax slab 30%, inflation off) will live here when calculator features need it.
