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
git clone https://github.com/YOUR_USERNAME/knip-html-reporter.git
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

```text
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

### Creating a Release (Simple 3-Step Process)

The project uses automated releases via GitHub Actions. Everything is automated once you publish the release.

#### Step 1: Bump Version

```bash
npm version patch  # or minor, or major
git push # or `git push && git push --tags` if you don't automatically push tags with git
```

#### Step 2: Publish the GitHub Release

1. Go to [Releases](https://github.com/christiananagnostou/knip-html-reporter/releases)
2. Click **"Edit"** on the draft release that was auto-generated
3. Review/edit the release notes
4. Click **"Publish release"**

#### Step 3: Wait for Automation

GitHub Actions will automatically:

- Run all tests
- Build the project
- Publish to NPM with provenance attestation
- Update the release with status

Monitor progress: [Actions tab](https://github.com/christiananagnostou/knip-html-reporter/actions)

Verify publication: [NPM package page](https://www.npmjs.com/package/knip-html-reporter)

---

### Version Guidelines (Semantic Versioning)

- **Patch (0.0.1)**: Bug fixes, small improvements
- **Minor (0.1.0)**: New features, backwards compatible
- **Major (1.0.0)**: Breaking changes

### How Release Drafter Works

- Automatically creates/updates draft releases as you push to main
- For direct pushes: Creates empty drafts you can fill in
- For PRs: Auto-generates release notes based on PR titles and labels

### If Something Goes Wrong

**Deprecate the bad version:**

```bash
npm deprecate knip-html-reporter@X.X.X "Use version X.X.Y instead"
```

**Then publish a fix:**

```bash
npm version patch
git push
# Publish the new draft release on GitHub
```

## Questions?

- Open a [Discussion](https://github.com/christiananagnostou/knip-html-reporter/discussions)
- Report bugs via [Issues](https://github.com/christiananagnostou/knip-html-reporter/issues)
- Contact the maintainer

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
