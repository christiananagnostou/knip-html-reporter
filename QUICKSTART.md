# Quick Start Guide

## Installation

```bash
npm install --save-dev knip-html-reporter
```

## Usage

### 1. Basic Usage

Run Knip with the HTML reporter:

```bash
npx knip --reporter knip-html-reporter
```

This creates `knip-report.html` in your project root.

### 2. Open Report Automatically

```bash
npx knip --reporter knip-html-reporter --reporter-options '{"autoOpen":true}'
```

### 3. Custom Output Path

```bash
npx knip --reporter knip-html-reporter --reporter-options '{"output":"reports/analysis.html"}'
```

### 4. Use Configuration File

Create `.knip-html-reporter.json`:

```json
{
  "output": "reports/knip-report.html",
  "autoOpen": true,
  "title": "My Project Analysis"
}
```

Then just run:

```bash
npx knip --reporter knip-html-reporter
```

### 5. Use Multiple Reporters

```bash
npx knip --reporter json --reporter knip-html-reporter
```

This outputs both JSON and HTML reports.

### 6. Custom Styling

Create a CSS file (`custom-styles.css`):

```css
body {
  background: #1e1e1e;
  color: #fff;
}
```

Reference it in your config:

```json
{
  "customStyles": "./custom-styles.css",
  "autoStyles": false
}
```

## What You'll See

The HTML report includes:

- **Summary Dashboard**: Total issues at a glance
- **Issue Breakdown**:
  - Unused files
  - Unused dependencies
  - Unlisted dependencies
  - Unused exports
  - Unresolved imports
  - Type issues (enums, class members, etc.)
- **File-by-File Analysis**: See exactly where issues occur with line numbers
- **Clean, Responsive Design**: Works on desktop and mobile

## Tips

1. **Add to your CI/CD**: Generate reports automatically

   ```bash
   npx knip --reporter knip-html-reporter --reporter-options '{"output":"reports/knip.html"}'
   ```

2. **Share reports**: Upload the HTML file to your CI artifacts for team review

3. **Track progress**: Generate reports regularly to track improvements over time

4. **Combine with other reporters**: Use JSON for CI checks, HTML for human review

   ```bash
   npx knip --reporter json --reporter knip-html-reporter
   ```

## Troubleshooting

**Report not opening?**

- Check if your default browser is set
- Try manually opening the HTML file

**Custom styles not working?**

- Verify the file path is correct (relative to project root)
- Check the CSS file for syntax errors

**No issues shown?**

- Great! Your project is clean
- Check if Knip itself is finding issues: `npx knip`

## Next Steps

- Check out the full [README](./README.md) for all configuration options
- View example configurations in `.knip-html-reporter.example.json`
- Customize the report title and styles to match your project
