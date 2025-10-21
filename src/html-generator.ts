import type { ReporterOptions } from 'knip'
import type { Issues, Issue, IssueType } from 'knip/dist/types/issues.js'
import type { HtmlReporterConfig } from './types.js'
import { getDefaultStyles } from './styles.js'
import { getInteractiveScript } from './interactive.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// SVG Icons for theme toggle
const THEME_ICONS = {
  light: /* html */ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path></svg>`,
  dark: /* html */ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M9.37 5.51A7.35 7.35 0 0 0 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0 1 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path></svg>`,
  system: /* html */ `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 0 1.1 1.677A.75.75 0 0 1 13.26 18H6.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 0 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Zm1.5 0a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-7.5Z" clip-rule="evenodd"></path></svg>`,
} as const

interface GenerateHtmlOptions {
  issues: ReporterOptions['issues']
  counters: ReporterOptions['counters']
  report: ReporterOptions['report']
  config: Required<Omit<HtmlReporterConfig, 'customStyles'>> & Pick<HtmlReporterConfig, 'customStyles'>
}

/**
 * Generate a single issue table row
 */
function generateIssueTableRow(symbol: string, issue: Issue, filePath: string): string {
  const line = issue.line ?? 1
  const col = issue.col ?? 1
  return /* html */ `<tr>
    <td class="issue-name">
      <span class="symbol">${escapeHtml(symbol)}</span>
    </td>
    <td class="issue-location">
      <div class="location-content">
        <span class="file-path">${escapeHtml(filePath)}</span>
        <span class="position">${line}:${col}</span>
      </div>
    </td>
    <td class="issue-actions">
      ${generateIdeButton(filePath, line, col)}
    </td>
  </tr>`
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
 * Generate issues section organized by category
 */
function generateIssuesSection(
  issues: ReporterOptions['issues'],
  report: ReporterOptions['report'],
  config: GenerateHtmlOptions['config']
): string {
  // Collect all issues by category
  const categorizedIssues: Map<string, Array<{ symbol: string; issue: Issue; filePath: string }>> = new Map()

  // Handle unused files
  if (issues.files && issues.files.size > 0) {
    const filesArray = Array.from(issues.files)
    categorizedIssues.set(
      'files',
      filesArray.map((file: string) => ({
        symbol: file,
        issue: {
          type: 'files' as any,
          symbol: file,
          filePath: file,
          workspace: '.',
          line: 1,
          col: 1,
        },
        filePath: file,
      }))
    )
  }

  // Handle issues from _files (these are general issues organized by file in Knip's structure)
  if (issues._files && Object.keys(issues._files).length > 0) {
    Object.entries(issues._files).forEach(([file, fileIssues]) => {
      Object.entries(fileIssues).forEach(([symbol, issue]) => {
        const categoryKey = issue.type || 'unknown'
        if (!categorizedIssues.has(categoryKey)) {
          categorizedIssues.set(categoryKey, [])
        }
        categorizedIssues.get(categoryKey)!.push({ symbol, issue, filePath: file })
      })
    })
  }

  // Process other issue types
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
      Object.entries(issueRecords).forEach(([file, symbolIssues]) => {
        Object.entries(symbolIssues).forEach(([symbol, issue]) => {
          if (!categorizedIssues.has(issueType)) {
            categorizedIssues.set(issueType, [])
          }
          categorizedIssues.get(issueType)!.push({ symbol, issue: issue as Issue, filePath: file })
        })
      })
    }
  })

  if (categorizedIssues.size === 0) {
    return ''
  }

  // Generate category sections with tables
  const sections = Array.from(categorizedIssues.entries())
    .map(([category, issueList]) => {
      const title = formatIssueType(category)
      const description = getIssueTypeDescription(category)
      const rows = issueList
        .map(({ symbol, issue, filePath }) => generateIssueTableRow(symbol, issue, filePath))
        .join('')

      return /* html */ `
        <div class="category-section" data-category="${category.toLowerCase()}">
          <div class="category-header">
            <h3>
              <span class="issue-badge">${title}</span>
              <span class="issue-count">${issueList.length}</span>
            </h3>
            <p class="category-description">${description}</p>
          </div>
          <div class="table-container">
            <table class="issues-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      `
    })
    .join('')

  return /* html */ `
    <div class="issues-section">
      <h2>Issues by Category</h2>
      ${sections}
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
