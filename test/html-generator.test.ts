import { describe, it, expect, vi } from 'vitest'
import { generateHtml } from '../src/html-generator.js'
import {
  mockConfig,
  mockCounters,
  mockIssues,
  createEmptyCounters,
  createEmptyIssues,
  createIssuesWithFiles,
  createCounters,
  createConfig,
} from './fixtures.js'

describe('HTML Generator', () => {
  it('should display unused files from issues.files', () => {
    const html = generateHtml({
      issues: createIssuesWithFiles(['src/unused-file.ts', 'src/old-component.tsx']),
      counters: createCounters({ files: 2 }),
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('Files')
    expect(html).toContain('src/unused-file.ts')
    expect(html).toContain('src/old-component.tsx')
    expect(html).toContain('category-section')
  })

  it('should display issues from issues object', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('src/index.ts')
    expect(html).toContain('unusedFunction')
    expect(html).toContain('unusedHelper')
    expect(html).toContain('package.json')
    expect(html).toContain('unused-package')
  })

  it('should display both unused files and issues together', () => {
    const issuesWithFiles = {
      ...mockIssues,
      files: new Set(['src/unused-file.ts', 'src/old-component.tsx']),
    }

    const html = generateHtml({
      issues: issuesWithFiles,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    // Should contain unused files category
    expect(html).toContain('Files')
    expect(html).toContain('src/unused-file.ts')

    // Should contain regular issues in table format
    expect(html).toContain('src/index.ts')
    expect(html).toContain('unusedFunction')
    expect(html).toContain('issues-table')
  })

  it('should handle empty report and issues gracefully', () => {
    const html = generateHtml({
      issues: {} as any,
      counters: createEmptyCounters(),
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('All Clear')
  })

  it('should generate valid HTML structure', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('</html>')
    expect(html).toContain('<head>')
    expect(html).toContain('<body data-cwd=')
  })

  it('should include the report title', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('<title>Test Report</title>')
    expect(html).toContain('<h1>Test Report</h1>')
  })

  it('should include styles when autoStyles is true', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: createConfig({ autoStyles: true }),
      cwd: process.cwd(),
    })

    expect(html).toContain('<style>')
    expect(html).toContain('font-family')
  })

  it('should include summary section with counters', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('Summary')
    expect(html).toContain('Total Issues')
  })

  it('should include search input', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('id="search-input"')
    expect(html).toContain('placeholder="Search issues')
  })

  it('should include clickable summary cards for filtering', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('summary-card')
    expect(html).toContain('data-filter=')
    expect(html).toContain('role="button"')
  })

  it('should display correct total and exclude internal counter keys from cards', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    // Should show the correct total (11)
    expect(html).toContain('<span class="summary-total-count">11</span>')

    // Should not create cards for internal keys
    expect(html).not.toContain('data-filter="_files"')
    expect(html).not.toContain('data-filter="total"')
    expect(html).not.toContain('data-filter="processed"')

    // Should create cards for actual issue types
    expect(html).toContain('data-filter="exports"')
    expect(html).toContain('data-filter="files"')
    expect(html).toContain('data-filter="dependencies"')
  })

  it('should calculate percentages correctly based on total', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    // Exports: 3/11 = 27.3%
    expect(html).toContain('27.3%')

    // Files: 2/11 = 18.2%
    expect(html).toContain('18.2%')

    // Dependencies: 1/11 = 9.1%
    expect(html).toContain('9.1%')
  })

  it('should include IDE buttons for issues with line numbers', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('openInIDE')
    expect(html).toContain('ide-btn')
  })

  it('should escape HTML in file paths and issue names', () => {
    const maliciousIssues = {
      files: new Set(),
      _files: {},
      dependencies: {},
      devDependencies: {},
      optionalPeerDependencies: {},
      unlisted: {},
      binaries: {},
      unresolved: {},
      exports: {
        '<script>alert("xss")</script>': {
          '<img src=x onerror=alert(1)>': {
            type: 'exports',
            symbol: '<img src=x onerror=alert(1)>',
            filePath: '<script>alert("xss")</script>',
            workspace: '.',
            line: 1,
            col: 1,
            pos: 0,
          },
        },
      },
      nsExports: {},
      types: {},
      nsTypes: {},
      enumMembers: {},
      classMembers: {},
      duplicates: {},
    }

    const html = generateHtml({
      issues: maliciousIssues as any,
      counters: createCounters({ exports: 1 }),
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).not.toContain('<script>alert("xss")</script>')
    expect(html).not.toContain('<img src=x onerror=alert(1)>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;img')
  })

  it('should show success message when no issues', () => {
    const html = generateHtml({
      issues: createEmptyIssues(),
      counters: createEmptyCounters(),
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('All Clear!')
    expect(html).toContain('No issues found')
  })

  it('should include interactive script', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('<script>')
    expect(html).toContain('applyFiltersAndSearch')
    expect(html).toContain('openInIDE')
  })

  it('should format issue type names correctly', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('Exports')
    expect(html).toContain('Unresolved')
    expect(html).toContain('Dependencies')
  })

  it('should include category sections with tables', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('src/index.ts')
    expect(html).toContain('package.json')
    expect(html).toContain('category-section')
    expect(html).toContain('issues-table')
    expect(html).toContain('<thead>')
    expect(html).toContain('<tbody>')
  })

  it('should include location information with line and column in table cells', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: mockConfig,
      cwd: process.cwd(),
    })

    expect(html).toContain('10:14') // line:col from unusedFunction
    expect(html).toContain('position') // class name for position display
    expect(html).toContain('issue-location') // table cell class
    expect(html).toContain('file-path') // file path class
  })

  it('should include custom styles from file when customStyles is provided', () => {
    const fs = require('node:fs')
    const path = require('node:path')

    // Create a temporary custom styles file
    const customStylesPath = path.join(process.cwd(), 'test-custom-styles.css')
    fs.writeFileSync(customStylesPath, '.custom-class { color: purple; }')

    try {
      const html = generateHtml({
        issues: mockIssues,
        counters: mockCounters,
        config: createConfig({ customStyles: customStylesPath }),
        cwd: process.cwd(),
      })

      expect(html).toContain('.custom-class { color: purple; }')
    } finally {
      // Clean up
      if (fs.existsSync(customStylesPath)) {
        fs.unlinkSync(customStylesPath)
      }
    }
  })

  it('should handle missing custom styles file gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      config: createConfig({ customStyles: '/path/to/nonexistent/file.css' }),
      cwd: process.cwd(),
    })

    // Should still generate HTML
    expect(html).toContain('<!DOCTYPE html>')

    // Should warn about missing file
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Warning: Could not load custom styles'))

    consoleSpy.mockRestore()
  })
})
