import { describe, it, expect } from 'vitest'
import { writeHtmlFile, openInBrowser } from '../src/utils.js'
import { readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const TEST_DIR = join(process.cwd(), 'test-fixtures-utils')

describe('Utils', () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true })
    }
    mkdirSync(TEST_DIR, { recursive: true })
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
    it('should not throw when given a valid path', async () => {
      const testFile = join(TEST_DIR, 'test.html')
      const html = '<html></html>'
      const fullPath = await writeHtmlFile(html, 'test.html', TEST_DIR)

      // Note: This will actually try to open the browser on some systems
      // In a real CI environment, you might want to mock this
      // For now, we just test that it doesn't throw
      await expect(openInBrowser(fullPath)).resolves.not.toThrow()
    })
  })
})
