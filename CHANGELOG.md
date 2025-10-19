# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Interactive Search**: Real-time search across all issues, files, and symbols
- ️**Smart Filtering**: Filter issues by type with clickable buttons
- **IDE Integration**: Open files directly in VS Code at specific lines
  - File-level buttons to open entire files
  - Issue-level buttons (⚡) to jump to exact line and column
- **Collapsible Sections**: Click file names to expand/collapse issue details
- **Interactive UI**: Modern, responsive design with hover effects
- **Comprehensive Test Suite**: Vitest tests for all core functionality
- **CI/CD Pipeline**: GitHub Actions workflow for automated testing
- **Extended Documentation**:
  - FEATURES.md - Detailed interactive features guide
  - ARCHITECTURE.md - Technical architecture documentation
  - QUICKSTART.md - Quick start guide
  - Comprehensive README updates

### Changed

- Updated HTML generation to include interactive controls
- Enhanced styling with new interactive element styles
- Improved error handling in configuration loading
- Better file path handling with automatic directory creation

### Fixed

- Directory creation for nested output paths
- HTML escaping to prevent XSS vulnerabilities

## [0.1.0] - Initial Release

### Added

- Basic HTML report generation from Knip results
- Configuration system with multiple sources:
  - JSON config files
  - JavaScript config files
  - package.json field
  - Command-line options
- Default CSS styling with responsive design
- Custom CSS support
- Auto-open in browser functionality
- Summary dashboard with issue counts
- File-by-file issue breakdown
- Cross-platform browser opening (macOS, Windows, Linux)
- TypeScript support with full type definitions
- Zero runtime dependencies (except Knip peer dependency)

[Unreleased]: https://github.com/yourusername/knip-html-reporter/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/knip-html-reporter/releases/tag/v0.1.0
