/**
 * Configuration options for the HTML reporter
 */
export interface HtmlReporterConfig {
  /**
   * Path to the output HTML file
   * @default 'knip-report.html'
   */
  output?: string

  /**
   * Automatically include default styles in the HTML output
   * @default true
   */
  autoStyles?: boolean

  /**
   * Automatically open the HTML file in the default browser after generation
   * @default false
   */
  autoOpen?: boolean

  /**
   * Custom CSS file path to include in the HTML output
   */
  customStyles?: string

  /**
   * Title for the HTML report
   * @default 'Knip Analysis Report'
   */
  title?: string
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<Omit<HtmlReporterConfig, 'customStyles'>> = {
  output: 'knip-report.html',
  autoStyles: true,
  autoOpen: false,
  title: 'Knip Analysis Report',
}
