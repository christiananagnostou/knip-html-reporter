import type { ReporterOptions } from 'knip'
import type { HtmlReporterConfig } from '../src/types.js'

/**
 * Shared test fixtures and utilities to reduce duplication across test files
 */

export const mockConfig: Required<Omit<HtmlReporterConfig, 'customStyles'>> & Pick<HtmlReporterConfig, 'customStyles'> =
  {
    output: 'test-report.html',
    autoStyles: true,
    autoOpen: false,
    title: 'Test Report',
  }

export const mockCounters: ReporterOptions['counters'] = {
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

export const mockIssues: ReporterOptions['issues'] = {
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

/**
 * Create empty counters (all zeros)
 */
export function createEmptyCounters(): ReporterOptions['counters'] {
  return Object.keys(mockCounters).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}) as ReporterOptions['counters']
}

/**
 * Create empty issues object
 */
export function createEmptyIssues(): ReporterOptions['issues'] {
  return {
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
}

/**
 * Create issues with only unused files
 */
export function createIssuesWithFiles(files: string[]): ReporterOptions['issues'] {
  return {
    ...createEmptyIssues(),
    files: new Set(files),
  }
}

/**
 * Merge partial counters with defaults
 */
export function createCounters(overrides: Partial<ReporterOptions['counters']>): ReporterOptions['counters'] {
  return { ...mockCounters, ...overrides }
}

/**
 * Create a custom config with overrides
 */
export function createConfig(
  overrides: Partial<HtmlReporterConfig>
): Required<Omit<HtmlReporterConfig, 'customStyles'>> & Pick<HtmlReporterConfig, 'customStyles'> {
  return { ...mockConfig, ...overrides } as Required<Omit<HtmlReporterConfig, 'customStyles'>> &
    Pick<HtmlReporterConfig, 'customStyles'>
}
