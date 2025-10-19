import { describe, it, expect } from 'vitest'
import { getInteractiveScript } from '../src/interactive.js'

describe('Interactive Script', () => {
  const script = getInteractiveScript()

  it('should generate a script tag with JavaScript', () => {
    expect(script).toContain('<script>')
    expect(script).toContain('</script>')
  })

  it('should contain search initialization function', () => {
    expect(script).toContain('function initializeSearch()')
    expect(script).toContain('searchInput.addEventListener')
  })

  it('should contain filter functionality', () => {
    expect(script).toContain('function initializeFilters()')
    expect(script).toContain('btn.addEventListener')
  })

  it('should contain IDE integration function', () => {
    expect(script).toContain('window.openInIDE')
    expect(script).toContain('vscode://file/')
  })

  it('should contain collapsible section logic', () => {
    expect(script).toContain('collapsible')
    expect(script).toContain('addEventListener')
  })

  it('should initialize on DOM ready', () => {
    expect(script).toContain('DOMContentLoaded')
    expect(script).toContain('initializeSearch()')
    expect(script).toContain('initializeFilters()')
  })
})
