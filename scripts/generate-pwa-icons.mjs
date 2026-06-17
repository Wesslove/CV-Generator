import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0)
    }
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, payload) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(payload.length, 0)
  const typeBuf = Buffer.from(type)
  const crcData = Buffer.concat([typeBuf, payload])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(crcData), 0)
  return Buffer.concat([len, typeBuf, payload, crc])
}

function createPng(size) {
  const width = size
  const height = size
  const rowSize = width * 3 + (width % 2)
  const data = Buffer.alloc(rowSize * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * rowSize + x * 3
      const cx = x - width / 2
      const cy = y - height / 2
      const dist = Math.sqrt(cx * cx + cy * cy)
      const inCircle = dist < width * 0.38
      data[i] = inCircle ? 0x89 : 0x1e
      data[i + 1] = inCircle ? 0xb4 : 0x1e
      data[i + 2] = inCircle ? 0xfa : 0x2e
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2

  const compressed = zlib.deflateSync(Buffer.concat([Buffer.from([0x00]), data]))
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const size of [192, 512]) {
  const png = createPng(size)
  fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), png)
  fs.writeFileSync(path.join(publicDir, `android-chrome-${size}x${size}.png`), png)
}

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(32))
console.log('PWA icons generated')
