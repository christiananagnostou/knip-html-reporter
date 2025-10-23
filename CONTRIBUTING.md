# Contributing to knip-html-reporter

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm (comes with Node.js)

### Setup Steps

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/knip-html.git
cd knip-html-reporter
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the project**

```bash
npm run build
```

4. **Run tests**

```bash
npm test
```

5. **Run in watch mode during development**

```bash
npm run dev  # TypeScript watch mode
npm run test:watch  # Test watch mode
```

## Making Changes

### Branch Naming

Create a descriptive branch name:

- `feature/your-feature-name` - for new features
- `fix/issue-description` - for bug fixes
- `docs/what-changed` - for documentation updates
- `chore/task-description` - for maintenance tasks

### Coding Standards

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use TypeScript strict mode
- Ensure all tests pass before submitting

### Commit Messages

We use conventional commits for clear history:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `test`: Test updates
- `refactor`: Code refactoring

Examples:
```
feat(search): add fuzzy search functionality
fix(styles): resolve dark mode contrast issues
docs(readme): update installation instructions
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Type Checking

```bash
npx tsc --noEmit
```

### Test Your Changes Locally

Generate a demo report to see your changes in action:

```bash
npm run demo
```

This will create `demo-report.html` that you can open in a browser.

## Submitting Changes

### Pull Request Process

1. **Update your fork**

```bash
git checkout main
git pull upstream main
git push origin main
```

2. **Create a feature branch**

```bash
git checkout -b feature/my-new-feature
```

3. **Make your changes and commit**

```bash
git add .
git commit -m "feat: add my new feature"
```

4. **Push to your fork**

```bash
git push origin feature/my-new-feature
```

5. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with details about your changes

### PR Requirements

Before submitting a PR, ensure:

- ✅ All tests pass (`npm test`)
- ✅ TypeScript compiles without errors (`npm run build`)
- ✅ Code follows project style
- ✅ New features include tests
- ✅ Documentation is updated
- ✅ CHANGELOG.md is updated (add to `[Unreleased]` section)

## Release Process

> **Note**: This section is for maintainers only.

### Prerequisites

1. **NPM Token Setup** (One-time)
   - Generate an NPM token at [npmjs.com](https://www.npmjs.com/settings/YOUR_USERNAME/tokens)
   - Add it to GitHub repository secrets as `NPM_TOKEN`
   - Go to: Repository Settings → Secrets and variables → Actions → New repository secret

### Creating a Release

The project uses automated releases via GitHub Actions. Here's the complete workflow:

#### 1. Update Version and Changelog

```bash
# Update package.json version
npm version patch  # or minor, or major

# Update CHANGELOG.md
# Move items from [Unreleased] to new version section
# Add release date
# Example:
## [0.3.0] - 2025-10-23
### Added
- New feature X
- New feature Y

# Commit changes
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 0.3.0"
git push origin main
```

#### 2. Create GitHub Release

**Option A: Via GitHub UI** (Recommended)

1. Go to repository → Releases → "Draft a new release"
2. Click "Choose a tag" and type new version (e.g., `v0.3.0`)
3. Click "Create new tag: v0.3.0 on publish"
4. Set release title (e.g., `v0.3.0`)
5. Use the auto-generated release notes or write custom notes
6. Click "Publish release"

**Option B: Via GitHub CLI**

```bash
gh release create v0.3.0 \
  --title "v0.3.0" \
  --notes "Release notes here" \
  --latest
```

#### 3. Automated Publishing

Once the release is published, GitHub Actions will automatically:

1. Run all tests
2. Check TypeScript types
3. Build the project
4. Verify package contents
5. Publish to NPM with provenance
6. Comment on the release with NPM link

Monitor the workflow at: `Actions` → `Release` workflow

#### 4. Verify Publication

After the workflow completes:

1. Check [NPM package page](https://www.npmjs.com/package/knip-html-reporter)
2. Verify version is live
3. Test installation: `npm install knip-html-reporter@latest`

### Release Drafter

The repository uses Release Drafter to automatically generate draft releases:

- Drafts are auto-updated as PRs are merged
- Uses PR labels to categorize changes
- Suggests next version number based on labels

To use:

1. Check the [Releases page](https://github.com/christiananagnostou/knip-html/releases)
2. Review the draft release
3. Edit as needed
4. Publish when ready

### Version Guidelines (Semantic Versioning)

- **Major (1.0.0)**: Breaking changes, major rewrites
- **Minor (0.1.0)**: New features, backwards compatible
- **Patch (0.0.1)**: Bug fixes, small improvements

### Rollback Procedure

If a release has issues:

1. **Deprecate the bad version on NPM**

```bash
npm deprecate knip-html-reporter@0.3.0 "This version has issues, use 0.3.1"
```

2. **Publish a fix**

```bash
npm version patch  # Creates 0.3.1
# Fix the issue
# Create new release following normal process
```

## Questions?

- Open a [Discussion](https://github.com/christiananagnostou/knip-html/discussions)
- Report bugs via [Issues](https://github.com/christiananagnostou/knip-html/issues)
- Contact the maintainer

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
