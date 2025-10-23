import type { Reporter } from 'knip'
import { loadConfig } from './config.js'
import { generateHtml } from './html-generator.js'
import { writeHtmlFile, openInBrowser } from './utils.js'

/**
 * Knip HTML Reporter
 * Transforms Knip analysis results into beautiful HTML reports
 */
const reporter: Reporter = async (options) => {
  const { issues, counters, cwd } = options

  // Load configuration from file or use defaults
  const config = await loadConfig(cwd, options.options)

  // Generate HTML from Knip results
  const html = generateHtml({
    issues,
    counters,
    config,
    cwd,
  })

  // Write HTML file
  const outputPath = await writeHtmlFile(html, config.output, cwd)

  console.log(`\nHTML report generated: ${outputPath}`)

  // Optionally open in browser
  if (config.autoOpen) {
    await openInBrowser(outputPath)
    console.log('Opened report in browser')
  }
}

export default reporter
export type { HtmlReporterConfig } from './types.js'
