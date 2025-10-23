import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { loadConfig } from '../src/config.js'
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const TEST_DIR = join(process.cwd(), 'test-fixtures')

describe('Config Loader', () => {
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

  it('should return default config when no config file exists', async () => {
    const config = await loadConfig(TEST_DIR)

    expect(config.output).toBe('knip-report.html')
    expect(config.autoStyles).toBe(true)
    expect(config.autoOpen).toBe(false)
    expect(config.title).toBe('Knip Analysis Report')
  })

  it('should load config from JSON file', async () => {
    const configPath = join(TEST_DIR, '.knip-html-reporter.json')
    const configData = {
      output: 'custom-report.html',
      autoOpen: true,
      title: 'Custom Title',
    }

    writeFileSync(configPath, JSON.stringify(configData, null, 2))

    const config = await loadConfig(TEST_DIR)

    expect(config.output).toBe('custom-report.html')
    expect(config.autoOpen).toBe(true)
    expect(config.title).toBe('Custom Title')
    expect(config.autoStyles).toBe(true) // default value
  })

  it('should parse options from JSON string', async () => {
    const options = JSON.stringify({
      output: 'from-options.html',
      autoOpen: true,
    })

    const config = await loadConfig(TEST_DIR, options)

    expect(config.output).toBe('from-options.html')
    expect(config.autoOpen).toBe(true)
  })

  it('should prioritize options string over config file', async () => {
    // Create a config file
    const configPath = join(TEST_DIR, '.knip-html-reporter.json')
    writeFileSync(configPath, JSON.stringify({ output: 'from-file.html' }))

    // Provide options string
    const options = JSON.stringify({ output: 'from-options.html' })

    const config = await loadConfig(TEST_DIR, options)

    // Options should win
    expect(config.output).toBe('from-options.html')
  })

  it('should load config from package.json', async () => {
    const packageJsonPath = join(TEST_DIR, 'package.json')
    const packageData = {
      name: 'test-package',
      'knip-html-reporter': {
        output: 'package-json-report.html',
        title: 'From Package.json',
      },
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2))

    const config = await loadConfig(TEST_DIR)

    expect(config.output).toBe('package-json-report.html')
    expect(config.title).toBe('From Package.json')
  })

  it('should handle invalid JSON in options gracefully', async () => {
    const config = await loadConfig(TEST_DIR, 'invalid{json')

    // Should return defaults
    expect(config.output).toBe('knip-report.html')
  })

  it('should merge partial config with defaults', async () => {
    const options = JSON.stringify({
      autoOpen: true,
      // output not specified, should use default
    })

    const config = await loadConfig(TEST_DIR, options)

    expect(config.output).toBe('knip-report.html') // default
    expect(config.autoOpen).toBe(true) // from options
    expect(config.autoStyles).toBe(true) // default
  })

  it('should load config from .js file', async () => {
    const configPath = join(TEST_DIR, 'knip-html-reporter.config.js')
    const configData = `export default {
  output: 'from-js-file.html',
  title: 'JS Config',
  autoOpen: true
}`

    writeFileSync(configPath, configData)

    const config = await loadConfig(TEST_DIR)

    expect(config.output).toBe('from-js-file.html')
    expect(config.title).toBe('JS Config')
    expect(config.autoOpen).toBe(true)
  })

  it('should load config from .mjs file', async () => {
    const configPath = join(TEST_DIR, 'knip-html-reporter.config.mjs')
    const configData = `export default {
  output: 'from-mjs-file.html',
  title: 'MJS Config'
}`

    writeFileSync(configPath, configData)

    const config = await loadConfig(TEST_DIR)

    expect(config.output).toBe('from-mjs-file.html')
    expect(config.title).toBe('MJS Config')
  })

  it('should handle errors in package.json gracefully', async () => {
    const packageJsonPath = join(TEST_DIR, 'package.json')

    // Write invalid JSON
    writeFileSync(packageJsonPath, '{ "name": "test", invalid json }')

    const config = await loadConfig(TEST_DIR)

    // Should return defaults without throwing
    expect(config.output).toBe('knip-report.html')
  })

  it('should prioritize config file over package.json', async () => {
    // Create both a config file and package.json
    const configPath = join(TEST_DIR, '.knip-html-reporter.json')
    writeFileSync(configPath, JSON.stringify({ output: 'from-config.html' }))

    const packageJsonPath = join(TEST_DIR, 'package.json')
    const packageData = {
      name: 'test-package',
      'knip-html-reporter': {
        output: 'from-package.html',
      },
    }
    writeFileSync(packageJsonPath, JSON.stringify(packageData))

    const config = await loadConfig(TEST_DIR)

    // Config file should win
    expect(config.output).toBe('from-config.html')
  })
})
