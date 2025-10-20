# knip-html-reporter

> A beautiful, interactive HTML reporter for [Knip](https://knip.dev) that transforms analysis results into easy-to-navigate reports.

[![CI](https://github.com/christiananagnostou/knip-html/actions/workflows/ci.yml/badge.svg)](https://github.com/christiananagnostou/knip-html/actions/workflows/ci.yml)

## Features

- **Search** - Instantly filter issues across symbols, files, and line numbers
- **Filtering** - Click overview cards to filter by issue type
- **IDE Integration** - Open files directly in VS Code at exact line and column
- **Dark/Light Themes** - System-aware theme with manual override
- **Customizable** - Use default styles or provide your own CSS
- **Responsive** - Works great on desktop and mobile
- **Zero Dependencies** - Fast, lightweight, works offline

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

### Overview Cards

Click any overview card to filter issues by that type. Cards show:

- Issue count and percentage
- Descriptive explanation of the issue type
- Visual progress bar

### Search

Type in the search box to instantly filter by:

- Symbol names
- File paths
- Line/column positions

### Theme Switcher

Toggle between light, dark, or system theme. Your preference is saved in localStorage.

### IDE Integration

Click the ⚡ button next to any issue to:

- Open the file in VS Code
- Jump to the exact line and column

Works with VS Code out of the box. Configurable for other IDEs.

See [FEATURES.md](./FEATURES.md) for detailed documentation.

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
