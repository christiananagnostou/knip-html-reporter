#!/usr/bin/env node

/**
 * Demo script to show example usage of knip-html-reporter.
 * This creates a mock Knip result and generates an HTML report
 * to demonstrate what the output looks like with real interactive features.
 */

import reporter from './dist/index.js'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

// Mock Knip analysis results (using JSDoc type hint to ignore type errors)
/** @type {any} */
const mockOptions = {
  report: {
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
    types: true,
    nsTypes: false,
    enumMembers: false,
    classMembers: true,
    duplicates: false,
  },
  issues: {
    files: new Set(['src/unused-file.ts', 'src/old-component.tsx', 'public/scripts/old-script.js']),
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
      'src/components/Button.tsx': {
        UnusedProps: {
          type: 'types',
          symbol: 'UnusedProps',
          filePath: 'src/components/Button.tsx',
          workspace: '.',
          line: 5,
          col: 12,
          pos: 88,
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
    types: {
      'src/components/Button.tsx': {
        UnusedProps: {
          type: 'types',
          symbol: 'UnusedProps',
          filePath: 'src/components/Button.tsx',
          workspace: '.',
          line: 5,
          col: 12,
          pos: 88,
        },
      },
    },
    nsTypes: {},
    enumMembers: {},
    classMembers: {
      'src/components/Button.tsx': {
        unusedMethod: {
          type: 'classMembers',
          symbol: 'unusedMethod',
          filePath: 'src/components/Button.tsx',
          workspace: '.',
          line: 20,
          col: 3,
          pos: 345,
        },
      },
    },
    duplicates: {},
  },
  counters: {
    files: 3,
    _files: 0,
    dependencies: 1,
    devDependencies: 0,
    optionalPeerDependencies: 0,
    unlisted: 2,
    binaries: 0,
    unresolved: 1,
    exports: 2,
    nsExports: 0,
    types: 1,
    nsTypes: 0,
    duplicates: 0,
    classMembers: 1,
    enumMembers: 0,
    processed: 0,
    total: 11,
  },
  configurationHints: {},
  tagHints: {},
  preprocessorOptions: {},
  includedWorkspaceDirs: [],
  isDisableConfigHints: false,
  isTreatConfigHintsAsErrors: false,
  cwd: process.cwd(),
  isProduction: false,
  isShowProgress: false,
  options: JSON.stringify({
    output: 'demo-report.html',
    autoOpen: false,
    title: 'Demo Knip Analysis Report',
  }),
}

// Generate the demo report
console.log('Generating demo HTML report...\n')
;(async () => {
  try {
    await reporter(mockOptions)

    console.log('\nDemo complete!')
    console.log('\nReport generated: demo-report.html')
    console.log('\nThis report includes:')
    console.log('  • Interactive search')
    console.log('  • Filter buttons by issue type')
    console.log('  • IDE integration buttons')
    console.log('\nTry these in the report:')
    console.log('  1. Type "unused" in the search box')
    console.log('  2. Click filter buttons to show specific issue types')
    console.log('  3. Click to open files in VS Code')
    console.log('  4. Click file names to collapse/expand sections')
    console.log('\nOpening report in browser...')

    // Open the report in browser
    const platform = process.platform
    let command

    if (platform === 'darwin') {
      command = 'open demo-report.html'
    } else if (platform === 'win32') {
      command = 'start demo-report.html'
    } else {
      command = 'xdg-open demo-report.html'
    }

    await execAsync(command)

    console.log('\nTo use with real Knip results:')
    console.log('  npx knip --reporter knip-html-reporter')
  } catch (error) {
    console.error('Error generating demo:', error)
    process.exit(1)
  }
})()
