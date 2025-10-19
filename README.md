# knip-html-reporter

A beautiful HTML reporter for Knip that transforms analysis results into interactive, easy-to-read reports.

## Installation

```bash
npm install --save-dev knip-html-reporter
```

## Usage

### Basic Usage

Use the reporter with Knip by passing the `--reporter` flag:

```bash
npx knip --reporter knip-html-reporter
```

This will generate a `knip-report.html` file in your current directory with the analysis results.

### With Configuration Options

You can pass options to the reporter using the `--reporter-options` flag with a JSON string:

```bash
npx knip --reporter knip-html-reporter --reporter-options '{"autoOpen":true,"output":"reports/knip.html"}'
```

### Configuration File

For more convenient configuration, create a config file in your project root:

#### `.knip-html-reporter.json`

```json
{
  "output": "reports/knip-report.html",
  "autoStyles": true,
  "autoOpen": true,
  "title": "My Project - Knip Analysis"
}
```

#### `knip-html-reporter.config.js`

```javascript
export default {
  output: 'reports/knip-report.html',
  autoStyles: true,
  autoOpen: true,
  customStyles: './custom-knip-styles.css',
  title: 'My Project - Knip Analysis'
};
```

#### In `package.json`

```json
{
  "knip-html-reporter": {
    "output": "reports/knip-report.html",
    "autoOpen": true
  }
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | `'knip-report.html'` | Path to the output HTML file (relative to project root) |
| `autoStyles` | `boolean` | `true` | Automatically include default styles in the HTML output |
| `autoOpen` | `boolean` | `false` | Automatically open the HTML file in the default browser after generation |
| `customStyles` | `string` | `undefined` | Path to a custom CSS file to include in the HTML output |
| `title` | `string` | `'Knip Analysis Report'` | Title for the HTML report |

## Features

- 📊 **Beautiful Visualization**: Clean, modern design that makes it easy to understand your project's health
- 🔍 **Interactive Search**: Real-time search across all issues, files, and symbols
- 🏷️ **Smart Filtering**: Filter issues by type with a single click
- 🔗 **IDE Integration**: Click to open files directly in VS Code at the exact line
- 🎨 **Customizable Styling**: Use default styles or provide your own custom CSS
- 🚀 **Auto-Open**: Optionally open the report in your browser automatically
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- � **Collapsible Sections**: Click file names to expand/collapse issue details
- ✅ **Summary Dashboard**: Quick overview of all issue types with counts
- ⚡ **Zero Dependencies**: Fast, lightweight, works offline

## What Gets Reported

The HTML report includes:

- **Summary**: Overview of all issues found with counts by type
- **Unused Files**: Files that aren't imported anywhere
- **Unused Dependencies**: Dependencies listed in package.json but not used
- **Unlisted Dependencies**: Dependencies used but not listed in package.json
- **Unused Exports**: Exported items that aren't imported anywhere
- **Unresolved Imports**: Imports that can't be resolved
- **Type Issues**: Unused types, enums, and class members
- And more!

## Examples

### Basic Report Generation

```bash
# Run Knip with HTML reporter
npx knip --reporter knip-html-reporter

# Output: ✅ HTML report generated: /path/to/knip-report.html
```

### Multiple Reporters

You can use multiple reporters at once:

```bash
npx knip --reporter json --reporter knip-html-reporter
```

### Custom Output Location

```bash
npx knip --reporter knip-html-reporter --reporter-options '{"output":"docs/analysis.html"}'
```

### Auto-Open in Browser

```bash
npx knip --reporter knip-html-reporter --reporter-options '{"autoOpen":true}'
```

## Interactive Features

### 🔍 Search
- Type in the search box to filter issues in real-time
- Search across file names, issue types, and issue content
- Case-insensitive and instant results

### 🏷️ Filters
- Click filter buttons to show only specific issue types
- Combine multiple filters for precise control
- Works seamlessly with search

### 🔗 IDE Integration
- **⚡ buttons** next to each issue open the file in your IDE
- Opens directly to the line and column of the issue
- Works with VS Code out of the box
- Configurable for other IDEs

### 📂 Collapsible Sections
- Click file names to collapse/expand their issues
- Great for navigating large reports
- Auto-expands when issues match your filters

See [FEATURES.md](./FEATURES.md) for detailed documentation of all interactive features.

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/knip-html-reporter.git
cd knip-html-reporter

# Install dependencies
npm install

# Build the reporter
npm run build

# Watch mode for development
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Running Tests

The project includes a comprehensive test suite using Vitest:

- **Unit tests** for all core modules
- **Integration tests** for HTML generation
- **Configuration tests** for all config sources
- **File I/O tests** for utils

All tests run automatically in CI via GitHub Actions.

## How It Works

This reporter implements Knip's custom reporter API. When Knip completes its analysis:

1. The reporter receives the analysis results (issues, counters, report data)
2. Loads configuration from file or command-line options
3. Generates a complete HTML document with embedded styles
4. Writes the HTML to the specified output path
5. Optionally opens the report in your default browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Related

- [Knip](https://knip.dev) - The project linter that finds and removes unused files, dependencies, and exports
