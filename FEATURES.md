# Interactive Features

## Overview

The HTML reporter includes powerful interactive features that make browsing and filtering issues easy and efficient. The modern card-based interface shows issue type descriptions directly in the overview section, eliminating redundant text in the issue lists.

## Theme Switcher

### Light, Dark, and System Themes

Choose from three theme options:

- **Light**: Optimized for daylight viewing
- **Dark**: Reduces eye strain in low-light conditions
- **System**: Automatically matches your OS preference

### Persistent Preference

Your theme choice is saved in localStorage and persists across sessions.

### How to Use

1. Click the theme buttons in the top-right header
2. Choose Light, Dark, or System
3. The report instantly updates to your selected theme
4. System theme adapts if your OS theme changes

## Overview Cards

### Interactive Issue Type Cards

Click any card in the overview section to filter the entire report:

- **Single click**: Filter to show only that issue type
- **Click again**: Deselect and show all issues
- **Multiple selections**: Click multiple cards to combine filters

### Card Information

Each card displays:

- **Issue Type Name**: Clear label (e.g., "Exports", "Dependencies")
- **Description**: Explains what the issue type means (e.g., "Exported but never used")
- **Count**: Number of issues of this type
- **Percentage**: Visual progress bar showing proportion of total
- **Percentage Value**: Numeric percentage for precise comparison

### Visual Feedback

- **Hover**: Card elevates and shows border gradient
- **Active**: Blue accent background indicates active filter
- **Sorted**: Cards ordered by count (highest first)

## Search Functionality

### Real-time Search

Type in the search box to instantly filter issues. The search is:

- **Case-insensitive**: Searches match regardless of case
- **Granular**: Searches at individual issue level, not just file level
- **Comprehensive**: Searches through symbol names, file paths, and line positions
- **Instant**: Results update as you type

### Search Fields

The search looks through:

- **Symbol names**: Function, class, variable names
- **File paths**: Full path including directory structure
- **Line positions**: Line and column numbers (e.g., "10:14")

### How to Use

1. Click or focus on the search input at the top of the report
2. Start typing (e.g., "unused", "src/", "Component")
3. Results automatically filter to match your query
4. Click the "×" button to clear the search

### Search Tips

- Search for file paths: `src/components`
- Search for specific files: `.tsx`, `index.ts`
- Search for symbols: `MyFunction`, `useState`
- Search for line numbers: `25:14`

## Combining Filters and Search

You can use overview cards and search together for powerful filtering:

1. Click one or more overview cards to filter by issue type
2. Then use search to narrow down within those types
3. This gives you precise control over what you see

Example: Click "Exports" card, then search for "src/hooks" to see only unused exports in your hooks directory.

## IDE Integration

### Open Files Directly

Each issue has a ⚡ button to open it directly in your IDE at the exact line and column.

### How It Works

1. Click any ⚡ button next to an issue
2. The file opens in VS Code (or your configured editor)
3. The cursor jumps to the exact line and column of the issue

### Supported IDEs

- **VS Code**: Works out of the box with `vscode://` protocol
- **Other IDEs**: May require protocol handler configuration

### Configure for Other IDEs

To use with other IDEs, you can modify the protocol in the generated HTML:

- **Cursor**: `cursor://`
- **WebStorm**: `webstorm://`
- **Sublime**: `subl://`

Or configure your IDE to handle the `vscode://` protocol.

## Collapsible Sections

### Toggle File Sections

Click any file name to collapse/expand its issues:

- **Collapsed**: Hides all issues for that file
- **Expanded**: Shows all issues (default)

### When to Use

- Quickly scan file names without seeing all details
- Focus on specific files by collapsing others
- Navigate large reports more efficiently

### Auto-Expand on Filter/Search

When you search or filter, collapsed sections automatically expand if they contain matching results.

## Interactive States

### UI Feedback

- **Hover effects**: Cards, buttons, and interactive elements highlight on hover
- **Active cards**: Blue accent background indicates active filter
- **Card animations**: Cards elevate and show gradient borders on hover
- **Search indicator**: Clear button (×) appears when search is active
- **Theme buttons**: Active theme button is highlighted

### "No Results" Message

When your filters and search don't match any issues:

- A friendly "No issues match..." message appears
- Helps confirm your filters are working
- Prompts you to adjust filters or search

## Performance

### Optimized for Large Reports

The interactive features are designed for speed:

- **Instant filtering**: No page reloads required
- **Efficient DOM updates**: Only changes visible elements
- **Client-side only**: All filtering happens in your browser
- **Smooth animations**: Responsive even with 1000+ issues

### Browser Compatibility

Works in all modern browsers:

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

### Theme Performance

- **System theme detection**: Instant via CSS media queries
- **Theme persistence**: Saved in localStorage
- **No flicker**: Theme applied before page render
- Safari: ✅
- Opera: ✅

## Tips & Tricks

### Power User Workflows

**Quick Issue Triage:**

1. Click overview card to focus on one issue type
2. Search for specific files or patterns
3. Click IDE buttons to fix issues immediately
4. Regenerate report to see progress

**Code Review:**

1. Share HTML report with team
2. Reviewers can search and filter independently
3. IDE buttons let anyone jump to code
4. No tool installation required for reviewers

**CI/CD Integration:**

1. Generate report in CI pipeline
2. Upload as build artifact
3. Team can browse results interactively
4. Much better than plain text logs

### Advanced Search Patterns

**Find specific file types:**

- `.test.` - All test files
- `.tsx` - React TypeScript components
- `index.` - All index files

**Find specific symbols:**

- `useState` - Find React hooks
- `Component` - Find component classes
- `interface` - Find TypeScript interfaces

**Find by location:**

- `src/hooks` - All issues in hooks directory
- `components/Button` - Specific component files
- `10:` - Issues on line 10

## Refreshing Data

The report is static HTML, so to see updated results:

1. Fix issues in your code
2. Run Knip again with the reporter
3. Refresh your browser or reopen the HTML file

The interactive features work entirely client-side, so all filtering and searching happens instantly without any server.

## Troubleshooting

**Search not working?**

- Make sure JavaScript is enabled in your browser
- Check browser console for errors
- Try refreshing the page

**IDE buttons not working?**

- Ensure VS Code is installed
- Check that the `vscode://` protocol is registered
- Try opening VS Code first, then clicking the button

**Overview cards not filtering?**

- Make sure JavaScript is enabled in your browser
- Click a card to activate filter (blue background indicates active)
- Click the card again to deselect
- Refresh the page if needed

**Filters stuck?**

- Click the active card again to deselect
- Refresh the page if needed
- Clear any active search query

**Performance issues?**

- Very large reports (10,000+ issues) may be slower
- Consider filtering issues in Knip itself
- Use more specific search terms
- Close other browser tabs if memory is limited
