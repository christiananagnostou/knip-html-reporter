# Interactive Features

## Overview

The HTML reporter includes powerful interactive features that make browsing and filtering issues easy and efficient.

## 🔍 Search Functionality

### Real-time Search
Type in the search box to instantly filter issues across all files and issue types. The search is:
- **Case-insensitive**: Searches match regardless of case
- **Comprehensive**: Searches through file names, issue types, and issue content
- **Instant**: Results update as you type

### How to Use
1. Click or focus on the search input at the top of the report
2. Start typing (e.g., "unused", "src/", "export")
3. Results automatically filter to match your query
4. Click the "×" button to clear the search

### Search Tips
- Search for file paths: `src/components`
- Search for issue types: `export`, `dependency`
- Search for specific symbols: `MyFunction`
- Search for patterns: `.tsx`, `test`

## 🏷️ Filter by Issue Type

### Available Filters
Click filter buttons to show only specific types of issues:
- **All**: Show all issues (default)
- **Exports**: Unused exported values
- **Dependencies**: Unused dependencies in package.json
- **Dev Dependencies**: Unused devDependencies
- **Unlisted**: Dependencies used but not in package.json
- **Unresolved**: Import paths that can't be resolved
- **Types**: Unused TypeScript types
- **Duplicates**: Duplicate exports
- **Enum Members**: Unused enum members
- **Class Members**: Unused class methods/properties

### How to Use
1. Click any filter button to activate it
2. Click multiple buttons to combine filters
3. Click "All" to reset filters
4. Active filters are highlighted in blue

### Combining Filters and Search
You can use search and filters together:
1. First, select one or more issue type filters
2. Then, use search to narrow down within those types
3. This gives you precise control over what you see

## 🔗 IDE Integration

### Open Files Directly
Each issue with a line number has a button to open it directly in your IDE.

### IDE Button Types
- **File-level buttons**: Open the entire file (top right of each file section)
- **Issue-level buttons**: Open directly to the specific line and column (⚡ icon next to each issue)

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

## 📂 Collapsible Sections

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

## 🎨 Visual Feedback

### Interactive States
- **Hover effects**: Buttons and interactive elements highlight on hover
- **Active filters**: Blue background indicates active filter
- **Search indicator**: Clear button (×) appears when search is active

### "No Results" Message
When your filters and search don't match any issues:
- A friendly "No issues match..." message appears
- Helps confirm your filters are working
- Prompts you to adjust filters or search

## ⌨️ Keyboard Shortcuts

### Planned Features
Future versions may include:
- `Ctrl/Cmd + F`: Focus search
- `Escape`: Clear search
- Arrow keys: Navigate between issues
- Enter: Open first result in IDE

## 🚀 Performance

### Optimized for Large Reports
The interactive features are designed for speed:
- **Instant filtering**: No page reloads
- **Efficient DOM updates**: Only changes what's needed
- **Smooth scrolling**: Stays responsive with 1000+ issues

### Browser Compatibility
Works in all modern browsers:
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

## 💡 Tips & Tricks

### Power User Workflows

**Quick Issue Triage:**
1. Use filters to focus on one issue type
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

**Find dependency issues:**
- `package.json` - All package.json issues
- `unlisted` - Dependencies not in package.json

**Find code quality issues:**
- `unused` - All unused items
- `class` - Class member issues
- `enum` - Enum member issues

## 🔄 Refreshing Data

The report is static HTML, so to see updated results:
1. Fix issues in your code
2. Run Knip again with the reporter
3. Refresh your browser or reopen the HTML file

The interactive features work entirely client-side, so all filtering and searching happens instantly without any server.

## 🐛 Troubleshooting

**Search not working?**
- Make sure JavaScript is enabled in your browser
- Check browser console for errors
- Try refreshing the page

**IDE buttons not working?**
- Ensure VS Code is installed
- Check that the `vscode://` protocol is registered
- Try opening VS Code first, then clicking the button

**Filters stuck?**
- Click "All" to reset filters
- Refresh the page if needed
- Check that no search query is active

**Performance issues?**
- Very large reports (10,000+ issues) may be slower
- Consider filtering issues in Knip itself
- Use more specific search terms
- Close other browser tabs if memory is limited
