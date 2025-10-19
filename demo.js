#!/usr/bin/env node

/**
 * Demo script to show example usage of knip-html-reporter
 *
 * This creates a mock Knip result and generates an HTML report
 * to demonstrate what the output looks like.
 */

import reporter from './dist/index.js'

// Mock Knip analysis results
const mockOptions = {
  report: {
    files: ['src/unused-file.ts', 'src/old-component.tsx'],
  },
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
    files: 2,
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

reporter(mockOptions)
  .then(() => {
    console.log('\n✨ Demo complete!')
    console.log('\nOpen demo-report.html in your browser to see the report.')
    console.log('\nTo use with real Knip results, run:')
    console.log('  npx knip --reporter knip-html-reporter')
  })
  .catch((error) => {
    console.error('Error generating demo:', error)
    process.exit(1)
  })
