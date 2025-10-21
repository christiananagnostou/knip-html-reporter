# Architecture & Design

## Overview

`knip-html-reporter` is a custom reporter for Knip that transforms analysis results into beautiful, interactive HTML reports. It follows Knip's reporter API specification and provides extensive configuration options.

## Project Structure

```text
knip-html-reporter/
├── src/
│   ├── index.ts          # Main reporter entry point
│   ├── types.ts          # TypeScript type definitions
│   ├── config.ts         # Configuration loading logic
│   ├── html-generator.ts # HTML generation from Knip results
│   ├── interactive.ts    # Client-side JavaScript for interactivity
│   ├── styles.ts         # Default CSS styles with theme system
│   └── utils.ts          # Utility functions (file I/O, browser opening)
├── test/                 # Test files
│   ├── config.test.ts
│   ├── html-generator.test.ts
│   ├── interactive.test.ts
│   └── utils.test.ts
├── dist/                 # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── README.md
├── FEATURES.md
├── ARCHITECTURE.md
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
- Issue breakdown by category (issue type)
- Table-based layout with Name and Location columns
- Detailed listings with line numbers
- Embedded or custom styles

**Key Functions**:

- `generateHtml()`: Main entry point
- `generateSummary()`: Creates overview cards with descriptions and percentages
- `generateIssuesSection()`: Builds category-based issue tables
- `generateIssueTableRow()`: Creates individual table rows (name, location, actions)
- `generateIdeButton()`: Creates IDE integration buttons
- `getIssueTypeDescription()`: Returns description text for each issue type
- `escapeHtml()`: Sanitizes output to prevent XSS

### 4. Interactive Script (`src/interactive.ts`)

Provides client-side JavaScript embedded in the HTML for:

**Theme Management**:

- Light/dark/system theme switching
- localStorage persistence
- System preference detection via media queries

**Filter System**:

- Click-to-filter on overview cards
- Multiple selection support
- Visual active state indicators

**Search Functionality**:

- Real-time search across symbols, files, and positions
- Granular filtering at individual issue level (table rows)
- Search query persistence during filtering

**Key Functions**:

- `initializeTheme()`: Sets up theme switcher
- `getEffectiveTheme()`: Resolves 'system' to light/dark
- `toggleCardFilter()`: Handles overview card clicks
- `rowMatchesSearch()`: Searches individual table row fields
- `applyFiltersAndSearch()`: Updates visible categories and table rows

### 5. Styling System (`src/styles.ts`)

Provides default CSS with:

- **Theme System**: CSS variables for light and dark themes
- **Responsive Design**: Mobile-friendly with breakpoints
- **Modern Aesthetics**: Card-based UI with hover effects
- **Interactive States**: Hover, active, and focus styles
- **Accessibility**: Proper contrast ratios and focus indicators

**Notable Components**:

- Summary cards with gradient borders and progress bars
- Theme toggle with smooth transitions
- Monospace fonts for code/file paths
- Color-coded issue badges
- Table styling with hover states and proper spacing
- Responsive table layout for mobile devices

Can be disabled via `autoStyles: false` to use only custom CSS.

### 6. Utility Functions (`src/utils.ts`)

**File Operations**:

- `writeHtmlFile()`: Writes HTML to disk with proper path resolution

**Browser Integration**:

- `openInBrowser()`: Cross-platform browser opening
  - macOS: `open`
  - Windows: `start`
  - Linux: `xdg-open`

## Data Flow

```text
Knip Analysis
     ↓
Reporter Invocation (ReporterOptions)
     ↓
Configuration Loading
     ↓
HTML Generation
     ├── Header with Theme Toggle
     ├── Summary Cards (counters → cards with descriptions)
     ├── Search & Filter Controls
     ├── Issue Sections (issues → category-based tables)
     ├── Interactive Script (embedded JavaScript)
     └── Styles (CSS with theme variables)
     ↓
File Writing
     ↓
Optional Browser Opening
     ↓
User Interacts with Report
     ├── Click cards to filter
     ├── Search for issues
     ├── Switch themes
     └── Open files in IDE
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

1. **New Issue Types**: Update `getIssueTypeDescription()` in `html-generator.ts`
2. **Custom Card Styles**: Extend CSS variables in `styles.ts`
3. **New Interactive Features**: Add functions to `interactive.ts`
4. **Alternative Themes**: Add new theme data attributes and CSS variables
5. **Output Formats**: Could add alongside HTML (JSON, PDF, etc.)

## Testing Strategy

Current test coverage includes:

- ✅ Configuration loading from various sources
- ✅ HTML generation with mock Knip data
- ✅ Utility functions (file paths, escaping)
- ✅ Interactive script generation
- ✅ Edge cases (empty results, special characters)

Tests are implemented using Vitest with 37 passing tests.

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
- Mobile browsers (responsive design with breakpoints)
- Browsers with JavaScript enabled (required for interactivity)

**Features requiring JavaScript**:

- Theme switching
- Search and filtering
- Collapsible sections
- IDE buttons

**Graceful degradation**: Static HTML and CSS still viewable without JavaScript.

## Current Features

Implemented interactive features:

- ✅ Overview cards with click-to-filter
- ✅ Real-time search across all fields
- ✅ Light/dark/system theme switcher
- ✅ IDE integration (VS Code)
- ✅ Category-based table layout
- ✅ Responsive mobile design
- ✅ Issue type descriptions in cards
- ✅ Visual progress bars and percentages
- ✅ Separate Name and Location columns

## Future Enhancements

Potential additions:

- Chart visualizations (pie charts, trends)
- Export filtered results
- Historical comparison between reports
- Diff view showing changes
- Keyboard shortcuts (Ctrl+F for search, etc.)
- Custom sorting options
- Issue grouping by directory
- Integration with more IDEs
- Plugin system for custom sections
