# Multi-Agent Development Quick Start

## Initial Setup

1. **Initialize Git Repository** (Already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create Feature Branches**
   ```bash
   git checkout -b develop
   git checkout -b feature/ppf-calculator
   git checkout -b feature/fd-calculator
   # ... etc
   ```

3. **Setup Git Worktrees** (Optional, for parallel development)
   ```bash
   ./scripts/setup-worktrees.sh
   ```

## Quick Reference

### Stub Files Location
```
src/components/calculators/{CalculatorName}/{CalculatorName}.stub.jsx
```

### Plan Files Location
```
docs/calculators/PLAN-{CalculatorName}.md
```

### Handoff Documentation
```
docs/HANDOFF.md
```

## Workflow

1. Pick a calculator stub file
2. Read corresponding PLAN file
3. Copy stub to main component file
4. Implement following PLAN.md
5. Create feature branch
6. Commit and push

## Git Worktrees

Use worktrees for parallel development:

```bash
# List worktrees
git worktree list

# Create new worktree
git worktree add ../wealth-mngr-ppf -b feature/ppf-calculator

# Remove worktree
git worktree remove ../wealth-mngr-ppf
```

See `docs/HANDOFF.md` for detailed workflow.
