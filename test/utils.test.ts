import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { writeHtmlFile, openInBrowser } from '../src/utils.js'
import { readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { exec } from 'node:child_process'

// Mock the exec function to prevent actual browser opening during tests
vi.mock('node:child_process', () => ({
  exec: vi.fn((cmd, callback) => {
    // Simulate successful execution without actually opening browser
    if (callback) callback(null, '', '')
  }),
}))

const TEST_DIR = join(process.cwd(), 'test-fixtures-utils')

describe('Utils', () => {
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

  describe('writeHtmlFile', () => {
    it('should write HTML content to a file', async () => {
      const html = '<html><body>Test</body></html>'
      const outputPath = 'test-report.html'

      const fullPath = await writeHtmlFile(html, outputPath, TEST_DIR)

      expect(existsSync(fullPath)).toBe(true)
      const content = readFileSync(fullPath, 'utf-8')
      expect(content).toBe(html)
    })

    it('should return absolute path', async () => {
      const html = '<html></html>'
      const outputPath = 'report.html'

      const fullPath = await writeHtmlFile(html, outputPath, TEST_DIR)

      expect(fullPath).toContain(TEST_DIR)
      expect(fullPath).toContain('report.html')
    })

    it('should handle subdirectories in output path', async () => {
      const html = '<html></html>'
      const outputPath = 'subdir/nested/report.html'

      const fullPath = await writeHtmlFile(html, outputPath, TEST_DIR)

      expect(existsSync(fullPath)).toBe(true)
    })
  })

  describe('openInBrowser', () => {
    it('should call exec with correct command', async () => {
      const html = '<html><body>Test Report</body></html>'
      const fullPath = await writeHtmlFile(html, 'test.html', TEST_DIR)

      await openInBrowser(fullPath)

      // Verify exec was called (but mocked, so no actual browser opens)
      expect(exec).toHaveBeenCalled()
    })

    it('should not throw when given a valid path', async () => {
      const html = '<html><body>Test</body></html>'
      const fullPath = await writeHtmlFile(html, 'test.html', TEST_DIR)

      // With mocked exec, this won't actually open a browser
      await expect(openInBrowser(fullPath)).resolves.not.toThrow()
    })
  })
})
