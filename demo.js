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
  report: {},
  issues: {
    'package.json': {
      dependencies: [{ name: 'unused-package', line: 12, col: 5, pos: 234 }],
      devDependencies: [],
      unlisted: [{ name: 'react' }, { name: '@types/node' }],
      exports: [],
      types: [],
      duplicates: [],
    },
    'src/index.ts': {
      dependencies: [],
      devDependencies: [],
      unlisted: [],
      unresolved: [{ name: './missing-module', line: 3, col: 20, pos: 45 }],
      exports: [
        { name: 'unusedFunction', line: 10, col: 14, pos: 156 },
        { name: 'unusedHelper', line: 25, col: 14, pos: 402 },
      ],
      types: [],
      duplicates: [],
    },
    'src/components/Button.tsx': {
      dependencies: [],
      devDependencies: [],
      unlisted: [],
      exports: [],
      types: [{ name: 'UnusedProps', line: 5, col: 12, pos: 88 }],
      classMembers: {
        Button: [{ name: 'unusedMethod', line: 20, col: 3, pos: 345 }],
      },
      duplicates: [],
    },
  },
  counters: {
    files: 0,
    dependencies: 1,
    devDependencies: 0,
    unlisted: 2,
    unresolved: 1,
    exports: 2,
    types: 1,
    duplicates: 0,
    classMembers: 1,
    enumMembers: 0,
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
console.log('🎨 Generating demo HTML report...\n')
;(async () => {
  try {
    await reporter(mockOptions)

    console.log('\n✨ Demo complete!')
    console.log('\n📄 Report generated: demo-report.html')
    console.log('\n🔍 This report includes:')
    console.log('  • Interactive search')
    console.log('  • Filter buttons by issue type')
    console.log('  • ⚡ IDE integration buttons')
    console.log('  • Collapsible file sections')
    console.log('\n💡 Try these in the report:')
    console.log('  1. Type "unused" in the search box')
    console.log('  2. Click filter buttons to show specific issue types')
    console.log('  3. Click ⚡ buttons to open files in VS Code')
    console.log('  4. Click file names to collapse/expand sections')
    console.log('\n🚀 Opening report in browser...')

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

    console.log('\n📖 To use with real Knip results:')
    console.log('  npx knip --reporter knip-html-reporter')
  } catch (error) {
    console.error('Error generating demo:', error)
    process.exit(1)
  }
})()
