# Branch Protection Setup Guide

This guide walks you through setting up branch protection rules for the main branch to ensure code quality and prevent bugs from reaching production.

## Why Branch Protection?

Branch protection rules act as an automated quality gate, ensuring that all code merged into the main branch has:
- Passed all automated tests
- Been reviewed for code quality (linting)
- Been validated for type safety (TypeScript)
- Successfully built without errors

This prevents broken code from being merged and deployed to production.

## Prerequisites

Before setting up branch protection, ensure:
1. You have admin access to the repository
2. The CI/CD pipeline (`.github/workflows/ci.yml`) is already set up
3. At least one successful workflow run has completed

## Setup Instructions

### Step 1: Navigate to Repository Settings

1. Go to your repository on GitHub
2. Click on **Settings** (top navigation bar)
3. In the left sidebar, click on **Branches** under "Code and automation"

### Step 2: Add Branch Protection Rule

1. Under "Branch protection rules", click **Add branch protection rule**
2. In the "Branch name pattern" field, enter: `main`

### Step 3: Enable Basic Protections

Check the following boxes:

- ✅ **Require a pull request before merging**
  - This ensures all changes go through a PR process
  - You can optionally require approvals if working with a team

- ✅ **Require status checks to pass before merging**
  - This is the critical setting that enforces CI/CD gates

### Step 4: Configure Required Status Checks

After checking "Require status checks to pass before merging", you'll see additional options:

1. Check **Require branches to be up to date before merging**
   - This ensures the PR is tested against the latest main branch code

2. In the search box under "Status checks that are required", add each of these jobs from the CI workflow:
   - `install` (Install Dependencies)
   - `lint` (Lint)
   - `type-check` (Type Check)
   - `test` (Test)
   - `build` (Build)

   **Note:** These status checks will only appear in the search results after your first workflow run completes. If you don't see them, push a commit or open a PR to trigger the workflow first.

### Step 5: Additional Recommended Settings

Consider enabling these additional protections:

- ✅ **Do not allow bypassing the above settings**
  - Prevents admins from accidentally bypassing these rules
  
- ✅ **Require conversation resolution before merging**
  - Ensures all PR comments are addressed

- ✅ **Include administrators**
  - Applies rules to repository admins as well (best practice)

### Step 6: Save the Rule

1. Scroll to the bottom of the page
2. Click **Create** (or **Save changes** if editing an existing rule)

## Verification

To verify branch protection is working:

1. Create a test branch: `git checkout -b test-branch-protection`
2. Make a small change and commit it
3. Push the branch and open a Pull Request
4. You should see status checks running
5. The "Merge" button should be disabled until all checks pass

## Required Status Checks Explained

| Check | Purpose | Blocks Merge If |
|-------|---------|-----------------|
| **install** | Verifies dependencies install correctly | Dependencies fail to install |
| **lint** | Runs ESLint to check code quality | Code style violations exist |
| **type-check** | Validates TypeScript types | Type errors are present |
| **test** | Runs Jest unit test suite | Any tests fail |
| **build** | Builds the Next.js application | Build fails or errors occur |

## Troubleshooting

### Status checks not appearing in the search?

**Solution:** Push a commit or open a PR to trigger the CI workflow. Status checks only appear after the workflow has run at least once.

### Can't merge even though checks passed?

**Possible causes:**
1. Branch is not up to date with main - pull latest and rebase
2. Required conversation resolution is enabled and comments are unresolved
3. Required approvals are not met (if configured)

### Need to make an emergency fix?

If you're an admin and need to bypass protection temporarily:
1. Go to Settings > Branches > Edit rule
2. Temporarily uncheck "Include administrators"
3. Make your fix
4. **Important:** Re-enable the setting immediately after

## Local Development

Before pushing, run these checks locally to catch issues early:

```bash
# Install dependencies
npm install

# Run all CI checks locally
npm run lint          # Code quality
npm run type-check    # TypeScript validation
npm test              # Unit tests
npm run build         # Production build
```

## Summary

With branch protection configured, you now have:
- ✅ Automated quality gates on all PRs
- ✅ Prevention of broken code merging to main
- ✅ Fast feedback loop (CI runs on every push)
- ✅ Professional development workflow

All changes must now go through pull requests and pass all automated checks before merging. This ensures production code is always stable and tested.
