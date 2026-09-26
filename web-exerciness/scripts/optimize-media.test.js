// Tests del script de optimización de la media (recorte de GIFs).
import { describe, it, expect, beforeAll } from 'vitest'
import { execFile, execFileSync } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtempSync, rmSync, cpSync, existsSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const exec = promisify(execFile)
const ROOT = process.cwd()
const FIXTURE = join(ROOT, 'test/fixtures/media/box-anim.gif')
const SCRIPT = join(ROOT, 'scripts/optimize-media.py')

const hasTooling = (() => {
  try {
    execFileSync('python3', ['-c', 'import PIL'])
    execFileSync('sh', ['-c', 'command -v magick || command -v convert'])
    return true
  } catch {
    return false
  }
})()

let srcDir
let dstDir

const run = () => exec('python3', [SCRIPT, '--src', srcDir, '--dst', dstDir])

beforeAll(() => {
  srcDir = mkdtempSync(join(tmpdir(), 'optimize-src-'))
  dstDir = mkdtempSync(join(tmpdir(), 'optimize-dst-'))
  cpSync(FIXTURE, join(srcDir, 'box-anim.gif'))
})

describe.skipIf(!hasTooling)('optimize-media.py', () => {
  it('recorta el lienzo al contenido animado preservando frames y duración', async () => {
    const { stdout } = await run()
    expect(stdout).toContain('Listo: 1 recortados')

    const output = join(dstDir, 'box-anim.gif')
    expect(existsSync(output)).toBe(true)

    const size = (await exec('identify', ['-format', '%wx%h', `${output}[0]`])).stdout.trim()
    const frames = String((await exec('identify', [output])).stdout.trim().split('\n').length)
    const firstDelay = (await exec('identify', ['-format', '%T', `${output}[0]`])).stdout.trim()
    expect(size).toBe('134x98')
    expect(frames).toBe('3')
    expect(firstDelay).toBe('10')
  })

  it('no modifica el archivo de origen', () => {
    expect(statSync(join(srcDir, 'box-anim.gif')).size).toBe(statSync(FIXTURE).size)
  })

  it('es idempotente: una segunda pasada no recorta de nuevo', async () => {
    const { stdout } = await run()
    expect(stdout).toContain('Listo: 0 recortados')
  })

  it('limpia los directorios temporales', () => {
    rmSync(srcDir, { recursive: true, force: true })
    rmSync(dstDir, { recursive: true, force: true })
    expect(existsSync(srcDir)).toBe(false)
  })
})
