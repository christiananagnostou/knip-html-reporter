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
    _files: 0,
    optionalPeerDependencies: 0,
    binaries: 0,
    nsExports: 0,
    nsTypes: 0,
    processed: 0,
    total: 11, // 2+1+0+2+1+3+1+0+0+1 = 11
  }

  const mockIssues: ReporterOptions['issues'] = {
    files: new Set(),
    _files: {
      'src/index.ts': {
        unusedFunction: {
          type: 'exports',
          symbol: 'unusedFunction',
          filePath: 'src/index.ts',
          workspace: '.',
          line: 10,
          col: 14,
          pos: 156,
        },
        unusedHelper: {
          type: 'exports',
          symbol: 'unusedHelper',
          filePath: 'src/index.ts',
          workspace: '.',
          line: 25,
          col: 14,
          pos: 402,
        },
      },
    },
    dependencies: {
      'package.json': {
        'unused-package': {
          type: 'dependencies',
          symbol: 'unused-package',
          filePath: 'package.json',
          workspace: '.',
          line: 12,
          col: 5,
          pos: 234,
        },
      },
    },
    devDependencies: {},
    optionalPeerDependencies: {},
    unlisted: {
      'package.json': {
        react: {
          type: 'unlisted',
          symbol: 'react',
          filePath: 'package.json',
          workspace: '.',
        },
        '@types/node': {
          type: 'unlisted',
          symbol: '@types/node',
          filePath: 'package.json',
          workspace: '.',
        },
      },
    },
    binaries: {},
    unresolved: {
      'src/index.ts': {
        './missing-module': {
          type: 'unresolved',
          symbol: './missing-module',
          filePath: 'src/index.ts',
          workspace: '.',
          line: 3,
          col: 20,
          pos: 45,
        },
      },
    },
    exports: {
      'src/index.ts': {
        unusedFunction: {
          type: 'exports',
          symbol: 'unusedFunction',
          filePath: 'src/index.ts',
          workspace: '.',
          line: 10,
          col: 14,
          pos: 156,
        },
        unusedHelper: {
          type: 'exports',
          symbol: 'unusedHelper',
          filePath: 'src/index.ts',
          workspace: '.',
          line: 25,
          col: 14,
          pos: 402,
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

  const mockReport: ReporterOptions['report'] = {
    files: true,
    _files: false,
    dependencies: true,
    devDependencies: false,
    optionalPeerDependencies: false,
    unlisted: true,
    binaries: false,
    unresolved: true,
    exports: true,
    nsExports: false,
    types: false,
    nsTypes: false,
    enumMembers: false,
    classMembers: false,
    duplicates: false,
  }

  it('should display unused files from issues.files', () => {
    const html = generateHtml({
      issues: {
        files: new Set(['src/unused-file.ts', 'src/old-component.tsx']),
        _files: {},
        dependencies: {},
        devDependencies: {},
        optionalPeerDependencies: {},
        unlisted: {},
        binaries: {},
        unresolved: {},
        exports: {},
        nsExports: {},
        types: {},
        nsTypes: {},
        enumMembers: {},
        classMembers: {},
        duplicates: {},
      },
      counters: { ...mockCounters, files: 2 },
      report: mockReport,
      config: mockConfig,
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
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('src/index.ts')
    expect(html).toContain('unusedFunction')
    expect(html).toContain('unusedHelper')
    expect(html).toContain('package.json')
    expect(html).toContain('unused-package')
  })

  it('should display both unused files and issues together', () => {
    const issuesWithFiles: ReporterOptions['issues'] = {
      ...mockIssues,
      files: new Set(['src/unused-file.ts', 'src/old-component.tsx']),
    }

    const html = generateHtml({
      issues: issuesWithFiles,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
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
    const emptyCounters = {
      files: 0,
      dependencies: 0,
      devDependencies: 0,
      unlisted: 0,
      unresolved: 0,
      exports: 0,
      types: 0,
      duplicates: 0,
      enumMembers: 0,
      classMembers: 0,
    }
    const html = generateHtml({
      issues: {} as any,
      counters: emptyCounters as any,
      report: { files: [] } as any,
      config: mockConfig,
    })

    expect(html).toContain('All Clear')
  })

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
    expect(html).toContain('<body data-cwd=')
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

  it('should include clickable summary cards for filtering', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('summary-card')
    expect(html).toContain('data-filter=')
    expect(html).toContain('role="button"')
  })

  it('should display correct total and exclude internal counter keys from cards', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
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
      report: mockReport,
      config: mockConfig,
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
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('openInIDE')
    expect(html).toContain('ide-btn')
  })

  it('should escape HTML in file paths and issue names', () => {
    const maliciousIssues: ReporterOptions['issues'] = {
      files: new Set(),
      _files: {
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
      dependencies: {},
      devDependencies: {},
      optionalPeerDependencies: {},
      unlisted: {},
      binaries: {},
      unresolved: {},
      exports: {},
      nsExports: {},
      types: {},
      nsTypes: {},
      enumMembers: {},
      classMembers: {},
      duplicates: {},
    }

    const html = generateHtml({
      issues: maliciousIssues,
      counters: { ...mockCounters, _files: 1 },
      report: mockReport,
      config: mockConfig,
    })

    expect(html).not.toContain('<script>alert("xss")</script>')
    expect(html).not.toContain('<img src=x onerror=alert(1)>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;img')
  })

  it('should show success message when no issues', () => {
    const emptyCounters = Object.keys(mockCounters).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}) as any
    const emptyIssues: ReporterOptions['issues'] = {
      files: new Set(),
      _files: {},
      dependencies: {},
      devDependencies: {},
      optionalPeerDependencies: {},
      unlisted: {},
      binaries: {},
      unresolved: {},
      exports: {},
      nsExports: {},
      types: {},
      nsTypes: {},
      enumMembers: {},
      classMembers: {},
      duplicates: {},
    }

    const html = generateHtml({
      issues: emptyIssues,
      counters: emptyCounters,
      report: mockReport,
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

  it('should include category sections with tables', () => {
    const html = generateHtml({
      issues: mockIssues,
      counters: mockCounters,
      report: mockReport,
      config: mockConfig,
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
      report: mockReport,
      config: mockConfig,
    })

    expect(html).toContain('10:14') // line:col from unusedFunction
    expect(html).toContain('position') // class name for position display
    expect(html).toContain('issue-location') // table cell class
    expect(html).toContain('file-path') // file path class
  })
})
