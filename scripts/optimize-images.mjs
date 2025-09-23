#!/usr/bin/env node
import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'

const root = process.cwd()
const sourceDirs = [
  path.join(root, 'public', 'images'),
  path.join(root, 'public', 'content'),
  path.join(root, 'public', 'img')
]

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

const exts = new Set(['.jpg', '.jpeg', '.png'])

async function processImage(file) {
  const ext = path.extname(file).toLowerCase()
  if (!exts.has(ext)) return
  const dir = path.dirname(file)
  const base = path.basename(file, ext)

  const input = await fs.readFile(file)

  const avifPath = path.join(dir, `${base}.avif`)
  const webpPath = path.join(dir, `${base}.webp`)

  // Skip if already exist
  let needAvif = false
  let needWebp = false
  try { await fs.access(avifPath) } catch { needAvif = true }
  try { await fs.access(webpPath) } catch { needWebp = true }

  if (needAvif) {
    await sharp(input)
      .avif({ quality: 45 })
      .toFile(avifPath)
    console.log('✓ AVIF', avifPath)
  }
  if (needWebp) {
    await sharp(input)
      .webp({ quality: 70 })
      .toFile(webpPath)
    console.log('✓ WebP', webpPath)
  }
}

async function walk(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) await walk(p)
      else await processImage(p)
    }
  } catch (e) {
    // ignore missing dirs
  }
}

async function main() {
  for (const d of sourceDirs) {
    await walk(d)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
