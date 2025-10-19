# Architecture & Design

## Overview

`knip-html-reporter` is a custom reporter for Knip that transforms analysis results into beautiful, interactive HTML reports. It follows Knip's reporter API specification and provides extensive configuration options.

## Project Structure

```
knip-html-reporter/
├── src/
│   ├── index.ts          # Main reporter entry point
│   ├── types.ts          # TypeScript type definitions
│   ├── config.ts         # Configuration loading logic
│   ├── html-generator.ts # HTML generation from Knip results
│   ├── styles.ts         # Default CSS styles
│   └── utils.ts          # Utility functions (file I/O, browser opening)
├── dist/                 # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── README.md
├── QUICKSTART.md
└── demo.js              # Demo script
```

## Core Components

### 1. Reporter Entry Point (`src/index.ts`)

The main reporter function that:
- Implements Knip's `Reporter` interface
- Receives `ReporterOptions` from Knip containing analysis results
- Orchestrates the entire HTML generation process
- Handles file output and optional browser opening

```typescript
const reporter: Reporter = async (options) => {
  const { issues, counters, report, cwd } = options;
  
  // 1. Load configuration
  const config = await loadConfig(cwd, options.options);
  
  // 2. Generate HTML
  const html = generateHtml({ issues, counters, report, config });
  
  // 3. Write to file
  const outputPath = await writeHtmlFile(html, config.output, cwd);
  
  // 4. Optionally open in browser
  if (config.autoOpen) {
    await openInBrowser(outputPath);
  }
};
```

### 2. Configuration System (`src/config.ts`)

Supports multiple configuration sources with priority:
1. Command-line options (`--reporter-options`)
2. `.knip-html-reporter.json`
3. `knip-html-reporter.config.{js,mjs}`
4. `package.json` field
5. Default values

### 3. HTML Generator (`src/html-generator.ts`)

Transforms Knip's structured data into HTML:

**Input**: Knip's analysis results
- `issues`: Object mapping files to their issues
- `counters`: Aggregate counts by issue type
- `report`: Additional metadata

**Output**: Complete HTML document with:
- Summary dashboard
- Issue breakdown by file
- Detailed listings with line numbers
- Embedded or custom styles

**Key Functions**:
- `generateHtml()`: Main entry point
- `generateSummary()`: Creates summary section from counters
- `generateIssuesSection()`: Builds file-by-file issue listings
- `escapeHtml()`: Sanitizes output to prevent XSS

### 4. Styling System (`src/styles.ts`)

Provides default CSS with:
- Responsive design (mobile-friendly)
- Clean, modern aesthetic
- Color-coded issue types
- Monospace fonts for code/file paths
- Accessible color contrast

Can be disabled via `autoStyles: false` to use only custom CSS.

### 5. Utility Functions (`src/utils.ts`)

**File Operations**:
- `writeHtmlFile()`: Writes HTML to disk with proper path resolution

**Browser Integration**:
- `openInBrowser()`: Cross-platform browser opening
  - macOS: `open`
  - Windows: `start`
  - Linux: `xdg-open`

## Data Flow

```
Knip Analysis
     ↓
Reporter Invocation (ReporterOptions)
     ↓
Configuration Loading
     ↓
HTML Generation
     ├── Summary Dashboard (counters → HTML)
     ├── Issue Sections (issues → HTML)
     └── Styles (CSS injection)
     ↓
File Writing
     ↓
Optional Browser Opening
     ↓
User views report
```

## Type Safety

The reporter is fully typed with TypeScript:

- **Knip Types**: Uses `Reporter` and `ReporterOptions` from Knip
- **Internal Types**: Custom interfaces for configuration
- **Strict Mode**: Enabled for maximum type safety

## Configuration Schema

```typescript
interface HtmlReporterConfig {
  output?: string;        // Output file path
  autoStyles?: boolean;   // Include default styles
  autoOpen?: boolean;     // Open in browser
  customStyles?: string;  // Custom CSS file path
  title?: string;         // Report title
}
```

## Error Handling

- Configuration errors: Warnings logged, defaults used
- File I/O errors: Thrown to halt execution
- Browser opening errors: Logged but non-fatal
- HTML generation errors: Thrown to surface issues

## Performance Considerations

- **Streaming**: Not used (Knip results are already in memory)
- **Large Reports**: All HTML built in memory (fine for typical projects)
- **File I/O**: Single write operation
- **Complexity**: O(n) where n = number of issues

## Extension Points

To add features:

1. **New Issue Types**: Update `html-generator.ts` issue type array
2. **Custom Sections**: Add new generators in `html-generator.ts`
3. **Styling Options**: Extend configuration and styles system
4. **Output Formats**: Could add alongside HTML (future)

## Testing Strategy

Suggested test coverage:
- Configuration loading from various sources
- HTML generation with mock Knip data
- File writing and path resolution
- Cross-platform browser opening
- Edge cases (empty results, missing files, etc.)

## Dependencies

**Runtime**:
- Knip (peer dependency)

**Dev**:
- TypeScript
- Node.js types

**Zero external runtime dependencies** for maximum compatibility!

## Browser Compatibility

Generated HTML works in:
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Older browsers with basic CSS/HTML support
- Mobile browsers (responsive design)

## Future Enhancements

Potential additions:
- Interactive filtering/search
- Chart visualizations
- Export to other formats (PDF, Markdown)
- Historical trend tracking
- Integration with CI/CD platforms
- Diff view between reports
- Plugin system for custom sections
