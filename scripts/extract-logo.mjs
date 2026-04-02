import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const src = fs.readFileSync(
  "C:/Users/mlc/Downloads/mlc_create_website.jsx",
  "utf8",
)
const m = src.match(/LOGO_SRC = "(data:image[^"]+)"/)
if (!m) throw new Error("LOGO_SRC not found")
const b64 = m[1].split(",")[1]
const out = path.join(root, "public", "mlc-logo.png")
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, Buffer.from(b64, "base64"))
console.log("Wrote", out)
