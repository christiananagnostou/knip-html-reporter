import type { ReporterOptions } from 'knip'
import type { Issues, Issue, IssueType } from 'knip/dist/types/issues.js'
import type { HtmlReporterConfig } from './types.js'
import { getDefaultStyles } from './styles.js'
import { getInteractiveScript } from './interactive.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface GenerateHtmlOptions {
  issues: ReporterOptions['issues']
  counters: ReporterOptions['counters']
  report: ReporterOptions['report']
  config: Required<Omit<HtmlReporterConfig, 'customStyles'>> & Pick<HtmlReporterConfig, 'customStyles'>
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.title)}</title>
  ${styles}
</head>
<body>
  <div class="container">
    <header>
      <h1>${escapeHtml(config.title)}</h1>
      <p class="timestamp">Generated on ${new Date().toLocaleString()}</p>
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
  const issueTypes = Object.entries(counters)
    .filter(([_, count]) => (count as number) > 0)
    .map(([type]) => formatIssueType(type).toLowerCase())

  const filterButtons = issueTypes
    .map((type) => `<button class="filter-btn" data-filter="${type}">${formatIssueType(type)}</button>`)
    .join('')

  return `
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
      
      <div class="filters">
        <span class="filter-label">Filter by type:</span>
        <button class="filter-btn active" data-filter="all">All</button>
        ${filterButtons}
      </div>
    </div>
  `
}

/**
 * Generate summary section with counters
 */
function generateSummary(counters: ReporterOptions['counters']): string {
  const total = Object.values(counters).reduce((sum: number, count) => sum + (count as number), 0)

  if (total === 0) {
    return `
      <div class="summary success">
        <h2>All Clear!</h2>
        <p>No issues found in your project.</p>
      </div>
    `
  }

  const items = Object.entries(counters)
    .filter(([_, count]) => (count as number) > 0)
    .map(
      ([type, count]) => `
      <div class="summary-item">
        <span class="count">${count}</span>
        <span class="label">${formatIssueType(type)}</span>
      </div>
    `
    )
    .join('')

  return `
    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-grid">
        ${items}
      </div>
      <div class="total">
        Total Issues: <strong>${total}</strong>
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
    sections += `
      <div class="file-section">
        <h3 class="file-name">Unused Files</h3>
        <div class="issue-type">
          <h4>Files</h4>
          <ul>
            ${filesArray
              .map((file: string) => {
                return `<li>${escapeHtml(file)}<button class="ide-btn-inline" onclick="openInIDE('${escapeHtml(
                  file
                )}', 1, 1)" title="Open in IDE">⚡</button></li>`
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

        return `
      <div class="file-section">
        <h3 class="file-name">
          ${escapeHtml(file)}
          <button class="ide-btn" onclick="openInIDE('${escapeHtml(file)}', 1, 1)" title="Open in IDE">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14.5 3l-1-1L3 12.5l1 1L14.5 3z"/>
              <path d="M9 2h1v4H9V2zm-4 4h1v2H5V6zm8 0h1v2h-1V6z"/>
            </svg>
          </button>
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

          return `
        <div class="file-section">
          <h3 class="file-name">
            ${escapeHtml(file)}
            <button class="ide-btn" onclick="openInIDE('${escapeHtml(file)}', 1, 1)" title="Open in IDE">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14.5 3l-1-1L3 12.5l1 1L14.5 3z"/>
                <path d="M9 2h1v4H9V2zm-4 4h1v2H5V6zm8 0h1v2h-1V6z"/>
              </svg>
            </button>
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

  return `
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
    .map(([symbol, issue]) => {
      const line = issue.line ?? 1
      const col = issue.col ?? 1
      return `<li>
        <span class="symbol">${escapeHtml(symbol)}</span>
        <span class="position">Line ${line}, Col ${col}</span>
        <button class="ide-btn-inline" onclick="openInIDE('${escapeHtml(
          filePath
        )}', ${line}, ${col})" title="Open in IDE">⚡</button>
      </li>`
    })
    .join('')

  return `
    <div class="issue-type">
      <h4>Issues</h4>
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
    .map(([symbol, issue]) => {
      const line = issue.line ?? 1
      const col = issue.col ?? 1
      return `<li>
        <span class="symbol">${escapeHtml(symbol)}</span>
        <span class="position">Line ${line}, Col ${col}</span>
        <button class="ide-btn-inline" onclick="openInIDE('${escapeHtml(
          filePath
        )}', ${line}, ${col})" title="Open in IDE">⚡</button>
      </li>`
    })
    .join('')

  return `
    <div class="issue-type">
      <h4>${title}</h4>
      <ul>${issueItems}</ul>
    </div>
  `
}

/**
 * OLD FUNCTION - KEPT FOR REFERENCE BUT NOT USED
 * Generate issues for a specific file
 */
function generateFileIssues(fileIssues: any, filePath: string, config: GenerateHtmlOptions['config']): string {
  const issueTypes = [
    'dependencies',
    'devDependencies',
    'unlisted',
    'binaries',
    'unresolved',
    'exports',
    'types',
    'enumMembers',
    'classMembers',
    'duplicates',
  ]

  const sections = issueTypes
    .map((type) => {
      const items = fileIssues[type]
      if (
        !items ||
        (Array.isArray(items) && items.length === 0) ||
        (typeof items === 'object' && Object.keys(items).length === 0)
      ) {
        return ''
      }

      return generateIssueTypeSection(type, items, filePath)
    })
    .filter(Boolean)
    .join('')

  return sections || ''
}

/**
 * Generate section for a specific issue type
 */
function generateIssueTypeSection(type: string, items: any, filePath: string): string {
  const title = formatIssueType(type)

  let itemsHtml = ''

  if (Array.isArray(items)) {
    itemsHtml = items
      .map((item) => {
        if (typeof item === 'string') {
          return `<li>${escapeHtml(item)}</li>`
        }

        const name = escapeHtml(item.name || '')
        const line = item.line || 1
        const col = item.col || 1
        const location = item.line ? ` <span class="location">:${line}:${col}</span>` : ''
        const ideButton = item.line
          ? `<button class="ide-btn-inline" onclick="openInIDE('${escapeHtml(
              filePath
            )}', ${line}, ${col})" title="Open in IDE">⚡</button>`
          : ''
        return `<li>${name}${location}${ideButton}</li>`
      })
      .join('')
  } else if (typeof items === 'object') {
    // Handle enumMembers and classMembers
    itemsHtml = Object.entries(items)
      .map(([key, members]: [string, any]) => {
        const membersList = (members as any[])
          .map((member) => {
            const name = escapeHtml(member.name || '')
            const line = member.line || 1
            const col = member.col || 1
            const location = member.line ? ` <span class="location">:${line}:${col}</span>` : ''
            const ideButton = member.line
              ? `<button class="ide-btn-inline" onclick="openInIDE('${escapeHtml(
                  filePath
                )}', ${line}, ${col})" title="Open in IDE">⚡</button>`
              : ''
            return `<li>${name}${location}${ideButton}</li>`
          })
          .join('')

        return `
        <div class="sub-section">
          <strong>${escapeHtml(key)}</strong>
          <ul>${membersList}</ul>
        </div>
      `
      })
      .join('')
  }

  return `
    <div class="issue-type">
      <h4>${title}</h4>
      <ul>${itemsHtml}</ul>
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
