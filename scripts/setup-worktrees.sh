#!/bin/bash

# Git Worktree Setup Script for Multi-Agent Development
# This script creates git worktrees for parallel calculator development

set -e

BASE_DIR="/Users/abhikarshgupta/Desktop"
REPO_NAME="wealth-mngr"
MAIN_REPO="$BASE_DIR/$REPO_NAME"

# Check if we're in the main repo
if [ ! -d "$MAIN_REPO/.git" ]; then
  echo "Error: Not in the main repository directory"
  exit 1
fi

cd "$MAIN_REPO"

# Ensure we're on develop branch
git checkout develop

# Array of calculators and their branch names
declare -A CALCULATORS=(
  ["ppf"]="feature/ppf-calculator"
  ["fd"]="feature/fd-calculator"
  ["sip"]="feature/sip-calculator"
  ["ssy"]="feature/ssy-calculator"
  ["nsc"]="feature/nsc-calculator"
  ["scss"]="feature/scss-calculator"
  ["sgb"]="feature/sgb-calculator"
  ["equity"]="feature/equity-calculator"
  ["elss"]="feature/elss-calculator"
  ["nps"]="feature/nps-calculator"
)

echo "Setting up git worktrees for calculator development..."
echo ""

# Create worktrees
for calc in "${!CALCULATORS[@]}"; do
  branch="${CALCULATORS[$calc]}"
  worktree_dir="$BASE_DIR/${REPO_NAME}-${calc}"
  
  # Check if worktree already exists
  if [ -d "$worktree_dir" ]; then
    echo "⚠️  Worktree already exists: $worktree_dir"
    echo "   Skipping $calc calculator..."
    continue
  fi
  
  # Create worktree
  echo "Creating worktree for $calc calculator..."
  git worktree add "$worktree_dir" -b "$branch"
  echo "✅ Created: $worktree_dir -> $branch"
  echo ""
done

echo "========================================="
echo "Worktree setup complete!"
echo ""
echo "Available worktrees:"
git worktree list
echo ""
echo "To work on a calculator:"
echo "  cd $BASE_DIR/${REPO_NAME}-{calculator-name}"
echo ""
echo "To remove a worktree after merging:"
echo "  git worktree remove $BASE_DIR/${REPO_NAME}-{calculator-name}"
echo "========================================="
