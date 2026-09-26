import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Script de sincronización del dataset de ejercicios.
// Copia los datos y la media desde exercises-dataset-main/ (fuente de verdad,
// gitignored) hacia public/ para que Vite los sirva de forma estática.
//
// Uso: yarn data:sync
/* eslint-disable no-console -- script CLI cuyo propósito es loguear su progreso */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'exercises-dataset-main')
const publicDir = join(root, 'public')

if (!existsSync(sourceDir)) {
  console.error('No se encuentra la carpeta exercises-dataset-main/ en la raíz del proyecto.')
  process.exit(1)
}

const entries = [
  ['data/exercises.json', 'data/exercises.json'],
  ['images', 'images'],
  ['videos', 'videos'],
]

for (const [from, to] of entries) {
  const src = join(sourceDir, from)
  const dest = join(publicDir, to)
  if (!existsSync(src)) {
    console.error(`Falta el origen: ${from}. Sincronización abortada.`)
    process.exit(1)
  }
  mkdirSync(dirname(dest), { recursive: true })
  rmSync(dest, { recursive: true, force: true })
  cpSync(src, dest, { recursive: true })
  console.log(`[sync] ${from} -> ${to}`)
}

console.log('[sync] Dataset sincronizado correctamente.')
