import { describe, it, expect } from 'vitest'
import { generateHtml } from '../src/html-generator.js'
import type { ReporterOptions } from 'knip'

describe('HTML Generator', () => {
  const mockConfig = {
    output: 'test-report.html',
    autoStyles: true,
    autoOpen: false,
    title: 'Test Report',
  }

  const mockCounters: ReporterOptions['counters'] = {
    files: 2,
    dependencies: 1,
    devDependencies: 0,
    unlisted: 2,
    unresolved: 1,
    exports: 3,
    types: 1,
    duplicates: 0,
    enumMembers: 0,
    classMembers: 1,
  }

  const mockIssues: ReporterOptions['issues'] = {
    'src/index.ts': {
      exports: [
        { name: 'unusedFunction', line: 10, col: 14, pos: 156 },
        { name: 'unusedHelper', line: 25, col: 14, pos: 402 },
      ],
      unresolved: [{ name: './missing-module', line: 3, col: 20, pos: 45 }],
    },
    'package.json': {
      dependencies: [{ name: 'unused-package', line: 12, col: 5, pos: 234 }],
      unlisted: [{ name: 'react' }, { name: '@types/node' }],
    },
  }

  const mockReport: ReporterOptions['report'] = {
    files: ['src/unused-file.ts', 'src/old-component.tsx'],
  }

  it('should generate valid HTML structure', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('</html>')
    expect(html).toContain('<head>')
    expect(html).toContain('<body>')
  })

  it('should include the report title', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('<title>Test Report</title>')
    expect(html).toContain('<h1>Test Report</h1>')
  })

  it('should include styles when autoStyles is true', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: { ...mockConfig, autoStyles: true },
    })

    expect(html).toContain('<style>')
    expect(html).toContain('font-family')
  })

  it('should include summary section with counters', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('Summary')
    expect(html).toContain('Total Issues')
  })

  it('should include search input', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('id="search-input"')
    expect(html).toContain('placeholder="Search issues')
  })

  it('should include filter buttons', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('filter-btn')
    expect(html).toContain('data-filter="all"')
  })

  it('should include IDE buttons for issues with line numbers', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('openInIDE')
    expect(html).toContain('ide-btn')
  })

  it('should escape HTML in file paths and issue names', () => {
    const maliciousIssues: ReporterOptions['issues'] = {
      '<script>alert("xss")</script>': {
        exports: [{ name: '<img src=x onerror=alert(1)>', line: 1, col: 1, pos: 0 }],
      },
    }

    const html = generateHtml({
      issues: maliciousIssues,
      counters: { exports: 1 },
      report: { files: [] },
      config: mockConfig,
    })

    expect(html).not.toContain('<script>alert("xss")</script>')
    expect(html).not.toContain('<img src=x onerror=alert(1)>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;img')
  })

  it('should show success message when no issues', () => {
    const html = generateHtml({
      issues: {},
      counters: {},
      report: { files: [] },
      config: mockConfig,
    })

    expect(html).toContain('All Clear!')
    expect(html).toContain('No issues found')
  })

  it('should include interactive script', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('<script>')
    expect(html).toContain('applyFiltersAndSearch')
    expect(html).toContain('openInIDE')
  })

  it('should format issue type names correctly', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('Exports')
    expect(html).toContain('Unresolved')
    expect(html).toContain('Dependencies')
  })

  it('should include file sections for each file with issues', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('src/index.ts')
    expect(html).toContain('package.json')
    expect(html).toContain('file-section')
  })

  it('should include location information with line and column', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain(':10:14') // line:col from unusedFunction
    expect(html).toContain('location') // class name
  })
})
