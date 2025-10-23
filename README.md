# knip-html-reporter

> A beautiful, interactive HTML reporter for [Knip](https://knip.dev) that transforms analysis results into easy-to-navigate reports.

[![CI](https://github.com/christiananagnostou/knip-html-reporter/actions/workflows/ci.yml/badge.svg)](https://github.com/christiananagnostou/knip-html-reporter/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/knip-html-reporter.svg)](https://www.npmjs.com/package/knip-html-reporter)

## Features

- **Search** - Instantly filter issues across symbols, files, and line numbers
- **Filtering** - Click overview cards to filter by issue type
- **IDE Integration** - Open files directly in VS Code at exact line and column
- **Customizable** - Use default styles or provide your own CSS
- **Zero Dependencies** - Fast, lightweight, works offline

See [FEATURES.md](./FEATURES.md) for detailed documentation.

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

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our development process and how to submit pull requests.

## License

MIT

## Related

- [Knip](https://knip.dev) - Find and remove unused files, dependencies, and exports
