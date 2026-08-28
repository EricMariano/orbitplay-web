// Regenerates src/api-types/generated.ts from the OpenAPI contract.
//
// Usage:
//   pnpm gen:api                      # regenerate types from the versioned openapi.json
//   pnpm gen:api http://localhost:3000/openapi.json   # pull latest contract, then generate
//   pnpm gen:api ../orbitplay-api/openapi.json         # copy from a local path, then generate
//
// Both src/api-types/openapi.json and generated.ts are versioned so the build
// works without the API running and any contract change shows up in the PR diff.
// generated.ts is NEVER edited by hand — fix the API (or the provisional
// openapi.json) instead.

import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const OPENAPI_PATH = resolve(root, 'src/api-types/openapi.json')
const OUTPUT_PATH = resolve(root, 'src/api-types/generated.ts')

const source = process.argv[2]

async function refreshContract(src) {
  let raw
  if (/^https?:\/\//.test(src)) {
    console.log(`↓ Fetching contract from ${src}`)
    const res = await fetch(src)
    if (!res.ok) throw new Error(`Failed to fetch ${src}: ${res.status} ${res.statusText}`)
    raw = await res.text()
  } else {
    const localPath = resolve(process.cwd(), src)
    console.log(`• Copying contract from ${localPath}`)
    raw = await readFile(localPath, 'utf8')
  }
  // Validate + normalize before persisting.
  const parsed = JSON.parse(raw)
  await writeFile(OPENAPI_PATH, `${JSON.stringify(parsed, null, 2)}\n`)
  console.log(`✓ Wrote ${OPENAPI_PATH}`)
}

async function main() {
  if (source) {
    await refreshContract(source)
  }

  const schema = JSON.parse(await readFile(OPENAPI_PATH, 'utf8'))
  const ast = await openapiTS(schema)
  const banner =
    '/**\n' +
    ' * GENERATED FILE — do not edit by hand.\n' +
    ' * Produced by `pnpm gen:api` from src/api-types/openapi.json.\n' +
    ' * Fix the API contract instead.\n' +
    ' */\n\n'
  await writeFile(OUTPUT_PATH, banner + astToString(ast))
  console.log(`✓ Wrote ${OUTPUT_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
