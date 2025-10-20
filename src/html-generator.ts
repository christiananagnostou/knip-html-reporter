import type { ReporterOptions } from 'knip'
import type { Issues, Issue, IssueType } from 'knip/dist/types/issues.js'
import type { HtmlReporterConfig } from './types.js'
import { getDefaultStyles } from './styles.js'
import { getInteractiveScript } from './interactive.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// SVG Icons for theme toggle
const THEME_ICONS = {
  light: /* html */ `<svg class="theme-icon" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="3.5"/>
    <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.95 3.05l-1.41 1.41M4.46 11.54l-1.41 1.41M12.95 12.95l-1.41-1.41M4.46 4.46L3.05 3.05"/>
  </svg>`,
  dark: /* html */ `<svg class="theme-icon" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0a8 8 0 108 8 9 9 0 01-8-8z"/>
  </svg>`,
  system: /* html */ `<svg class="theme-icon" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="3" width="12" height="9" rx="1"/>
    <path d="M2 10h12M6 12.5v1M10 12.5v1M5 14h6"/>
  </svg>`,
} as const

interface GenerateHtmlOptions {
  issues: ReporterOptions['issues']
  counters: ReporterOptions['counters']
  report: ReporterOptions['report']
  config: Required<Omit<HtmlReporterConfig, 'customStyles'>> & Pick<HtmlReporterConfig, 'customStyles'>
}

/**
 * Generate a single issue list item
 */
function generateIssueListItem(symbol: string, issue: Issue, filePath: string): string {
  const line = issue.line ?? 1
  const col = issue.col ?? 1
  return /* html */ `<li>
    <div class="issue-info">
      <div class="issue-details">
        <span class="symbol">${escapeHtml(symbol)}</span>
      </div>
      <span class="position">${line}:${col}</span>
    </div>
    ${generateIdeButton(filePath, line, col)}
  </li>`
}

/**
 * Generate IDE button HTML
 */
function generateIdeButton(filePath: string, line: number, col: number): string {
  return /* html */ `<button class="ide-btn-inline" onclick="openInIDE('${escapeHtml(
    filePath
  )}', ${line}, ${col})" title="Open in IDE" aria-label="Open in IDE">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1.5 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.793 8.5H2a.5.5 0 0 1-.5-.5z"/>
    </svg>
  </button>`
}

/**
 * Generate HTML report from Knip results
 */
export function generateHtml(options: GenerateHtmlOptions): string {
  const { issues, counters, report, config } = options

  const styles = getStyles(config)
  const summary = generateSummary(counters)
  const controls = generateControls(counters)
  const issuesHtml = generateIssuesSection(issues, report, config)
  const script = getInteractiveScript()

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.title)}</title>
  <script>
    // Set theme immediately to prevent flash
    (function() {
      const savedTheme = localStorage.getItem('knip-report-theme') || 'system';
      const root = document.documentElement;
      
      if (savedTheme === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', savedTheme);
      }
    })();
  </script>
  ${styles}
</head>
<body data-cwd="${escapeHtml(process.cwd())}">
  <div class="container">
    <header>
      <div class="header-content">
        <h1>${escapeHtml(config.title)}</h1>
        <p class="timestamp">Generated on ${new Date().toLocaleString()}</p>
      </div>
      <div class="theme-toggle" role="radiogroup" aria-label="Theme">
        <button class="theme-toggle-btn active" data-theme="light" aria-label="Light theme">
          ${THEME_ICONS.light}
          <span>Light</span>
        </button>
        <button class="theme-toggle-btn" data-theme="dark" aria-label="Dark theme">
          ${THEME_ICONS.dark}
          <span>Dark</span>
        </button>
        <button class="theme-toggle-btn" data-theme="system" aria-label="System theme">
          ${THEME_ICONS.system}
          <span>System</span>
        </button>
      </div>
    </header>
    
    ${summary}
    ${controls}
    ${issuesHtml}
  </div>
  ${script}
</body>
</html>`
}

/**
 * Get styles for the HTML report
 */
function getStyles(config: GenerateHtmlOptions['config']): string {
  let styles = ''

  if (config.autoStyles) {
    styles += `<style>${getDefaultStyles()}</style>`
  }

  if (config.customStyles) {
    try {
      const customCss = readFileSync(resolve(config.customStyles), 'utf-8')
      styles += `<style>${customCss}</style>`
    } catch (error) {
      console.warn(`Warning: Could not load custom styles from ${config.customStyles}`)
    }
  }

  return styles
}

/**
 * Generate controls (search and filters)
 */
function generateControls(counters: ReporterOptions['counters']): string {
  return /* html */ `
    <div class="controls">
      <div class="search-container">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Search issues, files, or symbols..." 
          aria-label="Search"
        />
        <button id="clear-search" aria-label="Clear search" style="display: none;">×</button>
      </div>
    </div>
  `
}

/**
 * Generate summary section with counters
 */
function generateSummary(counters: ReporterOptions['counters']): string {
  // Filter out non-issue counter keys (internal/metadata keys)
  const excludedKeys = ['_files', 'processed', 'total']

  // Calculate total from actual issue type counters only
  const total = Object.entries(counters)
    .filter(([key]) => !excludedKeys.includes(key))
    .reduce((sum: number, [, count]) => sum + (count as number), 0)

  if (total === 0) {
    return /* html */ `
      <div class="summary">
        <div class="success-state">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h2>All Clear!</h2>
          <p>No issues found in your project.</p>
        </div>
      </div>
    `
  }

  // Calculate percentages for each issue type
  const issueData = Object.entries(counters)
    .filter(([key, count]) => !excludedKeys.includes(key) && (count as number) > 0)
    .map(([type, count]) => ({
      type,
      count: count as number,
      percentage: ((count as number) / total) * 100,
    }))
    .sort((a, b) => b.count - a.count) // Sort by count descending

  const items = issueData
    .map(
      ({ type, count, percentage }) => `
      <div class="summary-card" data-filter="${formatIssueType(
        type
      ).toLowerCase()}" role="button" tabindex="0" aria-label="Filter by ${formatIssueType(type)}">
        <div class="summary-card-header">
          <div class="summary-card-info">
            <div class="summary-card-label">${formatIssueType(type)}</div>
            <div class="summary-card-description">${getIssueTypeDescription(type)}</div>
            <div class="summary-card-count">${count}</div>
          </div>
        </div>
        <div class="summary-card-bar">
          <div class="summary-card-bar-fill" style="width: ${percentage.toFixed(1)}%"></div>
        </div>
        <div class="summary-card-percentage">${percentage.toFixed(1)}%</div>
      </div>
    `
    )
    .join('')

  return /* html */ `
    <div class="summary">
      <div class="summary-header">
        <div class="summary-title">
          <h2>Analysis Overview</h2>
          <p class="summary-subtitle">Found ${total} issue${total === 1 ? '' : 's'} across ${issueData.length} categor${
    issueData.length === 1 ? 'y' : 'ies'
  }</p>
        </div>
        <div class="summary-total-badge">
          <span class="summary-total-count">${total}</span>
          <span class="summary-total-label">Total Issues</span>
        </div>
      </div>
      <div class="summary-cards">
        ${items}
      </div>
    </div>
  `
}

/**
 * Generate issues section
 */
function generateIssuesSection(
  issues: ReporterOptions['issues'],
  report: ReporterOptions['report'],
  config: GenerateHtmlOptions['config']
): string {
  let sections = ''

  // Add unused files section first if they exist
  if (issues.files && issues.files.size > 0) {
    const filesArray = Array.from(issues.files)
    sections += /* html */ `
      <div class="file-section">
        <h3 class="file-name">
          <span>Unused Files</span>
        </h3>
        <div class="issue-type">
          <h4>
            <span class="issue-badge">Files</span>
          </h4>
          <ul>
            ${filesArray
              .map((file: string) => {
                return /* html */ `<li>
                  <div class="issue-info">
                    <div class="issue-details">
                      <span class="symbol">${escapeHtml(file)}</span>
                    </div>
                  </div>
                  ${generateIdeButton(file, 1, 1)}
                </li>`
              })
              .join('')}
          </ul>
        </div>
      </div>
    `
  }

  // Add regular issues organized by file from _files
  if (issues._files && Object.keys(issues._files).length > 0) {
    sections += Object.entries(issues._files)
      .map(([file, fileIssues]) => {
        const fileIssuesList = generateFileIssuesFromRecords(fileIssues, file, config)

        if (!fileIssuesList) return ''

        return /* html */ `
      <div class="file-section">
        <h3 class="file-name">
          <span>${escapeHtml(file)}</span>
        </h3>
        ${fileIssuesList}
      </div>
    `
      })
      .filter(Boolean)
      .join('')
  }

  // Process other issue types (dependencies, exports, etc.) from IssueRecords
  const issueTypes: Array<keyof Issues> = [
    'dependencies',
    'devDependencies',
    'optionalPeerDependencies',
    'unlisted',
    'binaries',
    'unresolved',
    'exports',
    'types',
    'nsExports',
    'nsTypes',
    'duplicates',
    'enumMembers',
    'classMembers',
  ]

  issueTypes.forEach((issueType) => {
    const issueRecords = issues[issueType]
    if (issueRecords && Object.keys(issueRecords).length > 0) {
      sections += Object.entries(issueRecords)
        .map(([file, symbolIssues]) => {
          const issuesList = generateIssueTypeFromRecords(issueType, symbolIssues, file, config)
          if (!issuesList) return ''

          return /* html */ `
        <div class="file-section">
          <h3 class="file-name">
            <span>${escapeHtml(file)}</span>
          </h3>
          ${issuesList}
        </div>
      `
        })
        .filter(Boolean)
        .join('')
    }
  })

  if (!sections) {
    return ''
  }

  return /* html */ `
    <div class="issues-section">
      <h2>Issues by File</h2>
      ${sections}
    </div>
  `
}

/**
 * Generate issues for a file from _files IssueRecords
 */
function generateFileIssuesFromRecords(
  fileIssues: Record<string, Issue>,
  filePath: string,
  config: GenerateHtmlOptions['config']
): string {
  if (!fileIssues || Object.keys(fileIssues).length === 0) {
    return ''
  }

  const issueItems = Object.entries(fileIssues)
    .map(([symbol, issue]) => generateIssueListItem(symbol, issue, filePath))
    .join('')

  return /* html */ `
    <div class="issue-type">
      <h4>
        <span class="issue-badge">Issues</span>
      </h4>
      <ul>${issueItems}</ul>
    </div>
  `
}

/**
 * Generate issues for a specific issue type from IssueRecords
 */
function generateIssueTypeFromRecords(
  issueType: IssueType,
  symbolIssues: Record<string, Issue>,
  filePath: string,
  config: GenerateHtmlOptions['config']
): string {
  if (!symbolIssues || Object.keys(symbolIssues).length === 0) {
    return ''
  }

  const title = formatIssueType(issueType)

  const issueItems = Object.entries(symbolIssues)
    .map(([symbol, issue]) => generateIssueListItem(symbol, issue, filePath))
    .join('')

  return /* html */ `
    <div class="issue-type">
      <h4>
        <span class="issue-badge">${title}</span>
      </h4>
      <ul>${issueItems}</ul>
    </div>
  `
}

/**
 * Format issue type name for display
 */
function formatIssueType(type: string): string {
  const formatted = type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()

  return formatted
}

/**
 * Get descriptive text for issue type
 */
function getIssueTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    dependencies: 'Unused dependency',
    devDependencies: 'Unused dev dependency',
    optionalPeerDependencies: 'Unused optional peer dependency',
    unlisted: 'Used but not listed in package.json',
    binaries: 'Unused binary',
    unresolved: 'Import cannot be resolved',
    exports: 'Exported but never used',
    types: 'Type export is unused',
    nsExports: 'Namespace export is unused',
    nsTypes: 'Namespace type is unused',
    duplicates: 'Duplicate export',
    enumMembers: 'Enum member is unused',
    classMembers: 'Class member is unused',
  }

  return descriptions[type] || 'Unused'
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (m) => map[m])
}
