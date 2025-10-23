import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import reporter from '../src/index.js'
import { mockIssues, mockCounters } from './fixtures.js'
import { existsSync, mkdirSync, rmSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Mock the exec function to prevent actual browser opening during tests
vi.mock('node:child_process', () => ({
  exec: vi.fn((cmd, callback) => {
    if (callback) callback(null, '', '')
  }),
}))

const TEST_DIR = join(process.cwd(), 'test-fixtures-reporter')

describe('Reporter Integration', () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true })
    }
    mkdirSync(TEST_DIR, { recursive: true })
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true })
    }
  })

  it('should generate HTML report with default config', async () => {
    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: undefined,
    }

    await reporter(reporterOptions as any)

    const reportPath = join(TEST_DIR, 'knip-report.html')
    expect(existsSync(reportPath)).toBe(true)

    const html = readFileSync(reportPath, 'utf-8')
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Knip Analysis Report')
    expect(html).toContain('unusedFunction')
  })

  it('should generate HTML report with custom output path', async () => {
    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: JSON.stringify({ output: 'custom-report.html' }),
    }

    await reporter(reporterOptions as any)

    const reportPath = join(TEST_DIR, 'custom-report.html')
    expect(existsSync(reportPath)).toBe(true)
  })

  it('should generate HTML report with custom title', async () => {
    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: JSON.stringify({ title: 'My Custom Report' }),
    }

    await reporter(reporterOptions as any)

    const reportPath = join(TEST_DIR, 'knip-report.html')
    const html = readFileSync(reportPath, 'utf-8')
    expect(html).toContain('<title>My Custom Report</title>')
    expect(html).toContain('<h1>My Custom Report</h1>')
  })

  it('should include styles when autoStyles is true (default)', async () => {
    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: undefined,
    }

    await reporter(reporterOptions as any)

    const reportPath = join(TEST_DIR, 'knip-report.html')
    const html = readFileSync(reportPath, 'utf-8')
    expect(html).toContain('<style>')
    expect(html).toContain('font-family')
  })

  it('should create subdirectories for nested output paths', async () => {
    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: JSON.stringify({ output: 'reports/analysis/knip.html' }),
    }

    await reporter(reporterOptions as any)

    const reportPath = join(TEST_DIR, 'reports/analysis/knip.html')
    expect(existsSync(reportPath)).toBe(true)
  })

  it('should handle empty issues gracefully', async () => {
    const reporterOptions = {
      issues: {
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
      },
      counters: {
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
        _files: 0,
        optionalPeerDependencies: 0,
        binaries: 0,
        nsExports: 0,
        nsTypes: 0,
        processed: 0,
        total: 0,
      },
      cwd: TEST_DIR,
      options: undefined,
    }

    await reporter(reporterOptions as any)

    const reportPath = join(TEST_DIR, 'knip-report.html')
    const html = readFileSync(reportPath, 'utf-8')
    expect(html).toContain('All Clear!')
    expect(html).toContain('No issues found')
  })

  it('should not open browser when autoOpen is false (default)', async () => {
    const { exec } = await import('node:child_process')

    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: undefined,
    }

    await reporter(reporterOptions as any)

    // exec should not be called when autoOpen is false
    expect(exec).not.toHaveBeenCalled()
  })

  it('should open browser when autoOpen is true', async () => {
    const { exec } = await import('node:child_process')

    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: JSON.stringify({ autoOpen: true }),
    }

    await reporter(reporterOptions as any)

    // exec should be called to open browser
    expect(exec).toHaveBeenCalled()
  })

  it('should log output path to console', async () => {
    const consoleSpy = vi.spyOn(console, 'log')

    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: undefined,
    }

    await reporter(reporterOptions as any)

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('HTML report generated:'))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('knip-report.html'))

    consoleSpy.mockRestore()
  })

  it('should load config from config file', async () => {
    // Create a config file
    const configPath = join(TEST_DIR, '.knip-html-reporter.json')
    const fs = await import('node:fs')
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        output: 'from-config-file.html',
        title: 'Config File Title',
      })
    )

    const reporterOptions = {
      issues: mockIssues,
      counters: mockCounters,
      cwd: TEST_DIR,
      options: undefined,
    }

    await reporter(reporterOptions as any)

    const reportPath = join(TEST_DIR, 'from-config-file.html')
    expect(existsSync(reportPath)).toBe(true)

    const html = readFileSync(reportPath, 'utf-8')
    expect(html).toContain('Config File Title')
  })
})
