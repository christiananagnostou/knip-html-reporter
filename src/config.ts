import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import type { HtmlReporterConfig } from './types.js'
import { DEFAULT_CONFIG } from './types.js'

/**
 * Load configuration from file or use defaults
 */
export async function loadConfig(
  cwd: string,
  options?: string
): Promise<Required<Omit<HtmlReporterConfig, 'customStyles'>> & Pick<HtmlReporterConfig, 'customStyles'>> {
  let config: HtmlReporterConfig = {}

  // If options string is provided (from --reporter-options), parse it
  if (options) {
    try {
      config = JSON.parse(options)
    } catch (error) {
      console.warn('Warning: Could not parse reporter options as JSON')
    }
  } else {
    // Try to load from config files
    config = await loadConfigFile(cwd)
  }

  // Merge with defaults
  return {
    ...DEFAULT_CONFIG,
    ...config,
  }
}

/**
 * Try to load configuration from various config file locations
 */
async function loadConfigFile(cwd: string): Promise<HtmlReporterConfig> {
  const configFiles = ['.knip-html-reporter.json', 'knip-html-reporter.config.js', 'knip-html-reporter.config.mjs']

  for (const file of configFiles) {
    const filePath = resolve(cwd, file)

    if (existsSync(filePath)) {
      try {
        if (file.endsWith('.json')) {
          const content = await readFile(filePath, 'utf-8')
          return JSON.parse(content)
        } else {
          // For JS/MJS files, use dynamic import
          const module = await import(filePath)
          return module.default || module
        }
      } catch (error) {
        console.warn(`Warning: Could not load config from ${file}`)
      }
    }
  }

  // Try package.json
  const packageJsonPath = resolve(cwd, 'package.json')
  if (existsSync(packageJsonPath)) {
    try {
      const content = await readFile(packageJsonPath, 'utf-8')
      const packageJson = JSON.parse(content)
      if (packageJson['knip-html-reporter']) {
        return packageJson['knip-html-reporter']
      }
    } catch (error) {
      // Ignore package.json errors
    }
  }

  return {}
}
