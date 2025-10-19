import { writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { platform } from 'node:os'

const execAsync = promisify(exec)

/**
 * Write HTML content to a file
 */
export async function writeHtmlFile(html: string, outputPath: string, cwd: string): Promise<string> {
  const absolutePath = resolve(cwd, outputPath)

  // Ensure directory exists
  const dir = dirname(absolutePath)
  await mkdir(dir, { recursive: true })

  await writeFile(absolutePath, html, 'utf-8')
  return absolutePath
}

/**
 * Open a file in the default browser
 */
export async function openInBrowser(filePath: string): Promise<void> {
  const os = platform()
  let command: string

  switch (os) {
    case 'darwin': // macOS
      command = `open "${filePath}"`
      break
    case 'win32': // Windows
      command = `start "" "${filePath}"`
      break
    default: // Linux and others
      command = `xdg-open "${filePath}"`
      break
  }

  try {
    await execAsync(command)
  } catch (error) {
    console.error('Failed to open browser:', error)
    throw error
  }
}
