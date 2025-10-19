# knip-html-reporter

> A beautiful, interactive HTML reporter for [Knip](https://knip.dev) that transforms analysis results into easy-to-navigate reports.

[![CI](https://github.com/christiananagnostou/knip-html/actions/workflows/ci.yml/badge.svg)](https://github.com/christiananagnostou/knip-html/actions/workflows/ci.yml)

## Features

- **Interactive Search** - Real-time filtering across all issues
- **Smart Filtering** - One-click filtering by issue type
- **IDE Integration** - Click to open files directly in VS Code
- **Collapsible Sections** - Expand/collapse file sections
- **Customizable** - Use default styles or provide your own CSS
- **Summary Dashboard** - Quick overview with issue counts
- **Responsive** - Works great on desktop and mobile
- ⚡ **Zero Dependencies** - Fast, lightweight, works offline

## Installation

```bash
npm install --save-dev knip-html-reporter
```

## Quick Start

```bash
# Basic usage
npx knip --reporter knip-html-reporter

# Auto-open in browser
npx knip --reporter knip-html-reporter --reporter-options '{"autoOpen":true}'

# Custom output path
npx knip --reporter knip-html-reporter --reporter-options '{"output":"reports/knip.html"}'
```

## Configuration

### Configuration File

Create a `.knip-html-reporter.json` in your project root:

```json
{
  "output": "reports/knip-report.html",
  "autoOpen": true,
  "title": "My Project - Knip Analysis"
}
```

Or use JavaScript (`knip-html-reporter.config.js`):

```javascript
export default {
  output: 'reports/knip-report.html',
  autoOpen: true,
  customStyles: './custom-styles.css',
  title: 'My Project - Knip Analysis'
};
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | `'knip-report.html'` | Path to output HTML file |
| `autoOpen` | `boolean` | `false` | Auto-open report in browser |
| `autoStyles` | `boolean` | `true` | Include default styles |
| `customStyles` | `string` | - | Path to custom CSS file |
| `title` | `string` | `'Knip Analysis Report'` | Report title |

### CLI Options

Pass options via `--reporter-options`:

```bash
npx knip --reporter knip-html-reporter \
  --reporter-options '{"output":"docs/report.html","autoOpen":true,"title":"My Report"}'
```

## Interactive Features

###  Search

Type in the search box to instantly filter issues. Searches across:

- File paths
- Issue types
- Symbol names
- All content

### ️Filters

Click filter buttons to show specific issue types:

- Exports
- Dependencies
- Unlisted Dependencies
- Unresolved Imports
- Types
- And more...

### IDE Integration

- **⚡ buttons** next to each issue open files in your IDE
- Opens to exact line and column
- Works with VS Code out of the box
- Configurable for other IDEs

### Collapsible Sections

- Click file names to expand/collapse
- Auto-expands when issues match filters
- Great for large reports

See [FEATURES.md](./FEATURES.md) for detailed documentation.

## What Gets Reported

- Unused files
- Unused dependencies
- Unlisted dependencies
- Unused exports
- Unresolved imports
- Unused types
- Unused class members
- Unused enum members
- Duplicate exports

## Use with Multiple Reporters

```bash
npx knip --reporter json --reporter knip-html-reporter
```

## CI/CD Integration

Generate reports in your CI pipeline:

```bash
npx knip --reporter knip-html-reporter \
  --reporter-options '{"output":"reports/knip.html"}'
```

Upload the HTML as a build artifact for team review.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run demo
npm run demo
```

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

MIT

## Related

- [Knip](https://knip.dev) - Find and remove unused files, dependencies, and exports
