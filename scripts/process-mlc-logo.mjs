import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

const INPUT = process.argv[2]
if (!INPUT) {
  console.error("Usage: node scripts/process-mlc-logo.mjs <input.png>")
  process.exit(1)
}

const { data, info } = await sharp(INPUT)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const out = Buffer.alloc(width * height * 4)

for (let i = 0; i < width * height; i++) {
  const o = i * 4
  const p = i * channels
  const r = data[p]
  const g = data[p + 1]
  const b = data[p + 2]
  const lum = (r + g + b) / 3

  // Near-white background → transparent
  if (lum > 232 && r > 225 && g > 225 && b > 225) {
    out[o] = 0
    out[o + 1] = 0
    out[o + 2] = 0
    out[o + 3] = 0
    continue
  }

  // Dark glyph → white, alpha from darkness (smooth edges)
  const ink = Math.min(1, (255 - lum) / 255)
  const a = Math.min(255, Math.round(ink * 280))
  out[o] = 255
  out[o + 1] = 255
  out[o + 2] = 255
  out[o + 3] = a
}

const png = await sharp(out, {
  raw: { width, height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toBuffer()

const publicDir = path.join(root, "public")
const appDir = path.join(root, "src", "app")
await mkdir(publicDir, { recursive: true })
await mkdir(appDir, { recursive: true })

const publicPath = path.join(publicDir, "mlc-m-logo.png")
const iconPath = path.join(appDir, "icon.png")

await writeFile(publicPath, png)
await writeFile(iconPath, png)

console.log("Wrote", publicPath)
console.log("Wrote", iconPath)
