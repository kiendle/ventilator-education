#!/usr/bin/env node
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as zlib from 'node:zlib'

function argument(name) {
  const index = process.argv.indexOf(name)
  if (index < 0 || !process.argv[index + 1]) throw new Error(`missing ${name}`)
  return process.argv[index + 1]
}

function pngChunk(type, data) {
  const tag = Buffer.from(type, 'ascii')
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([tag, data])), 0)
  return Buffer.concat([length, tag, data, crc])
}

function encodePng(width, height, rgba) {
  const rows = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width * 4 + 1)
    rows[rowOffset] = 0
    rgba.copy(rows, rowOffset + 1, y * width * 4, (y + 1) * width * 4)
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8
  header[9] = 6
  return Buffer.concat([
    Buffer.from('\x89PNG\r\n\x1a\n', 'binary'),
    pngChunk('IHDR', header),
    pngChunk('IDAT', zlib.deflateSync(rows, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

async function convertWdp(input) {
  const { default: createJpegXrCodec } = await import('jpegxr')
  const decoded = await createJpegXrCodec().then((codec) => codec.decode(input))
  const { width, height, pixelInfo } = decoded
  if (!width || !height || pixelInfo.bitDepth !== '8' || ![3, 4].includes(pixelInfo.channels)) {
    throw new Error(`unsupported JPEG XR pixel format: ${JSON.stringify(pixelInfo)}`)
  }
  const source = Buffer.from(decoded.bytes)
  const channels = pixelInfo.channels
  const rgba = Buffer.alloc(width * height * 4)
  for (let offset = 0, pixel = 0; pixel < width * height; pixel += 1, offset += channels) {
    const target = pixel * 4
    if (pixelInfo.bgr) {
      rgba[target] = source[offset + 2]
      rgba[target + 1] = source[offset + 1]
      rgba[target + 2] = source[offset]
    } else {
      rgba[target] = source[offset]
      rgba[target + 1] = source[offset + 1]
      rgba[target + 2] = source[offset + 2]
    }
    rgba[target + 3] = channels === 4 ? source[offset + 3] : 255
  }
  return encodePng(width, height, rgba)
}

async function convertEmf(input) {
  const canvas = await import('@napi-rs/canvas')
  global.OffscreenCanvas = canvas.Canvas
  global.ImageData = canvas.ImageData
  global.FileReader = class {
    readAsDataURL(blob) {
      blob.arrayBuffer().then((bytes) => {
        this.result = `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(bytes).toString('base64')}`
        if (this.onload) this.onload()
      }).catch((error) => {
        this.error = error
        if (this.onerror) this.onerror(error)
      })
    }
  }
  global.createImageBitmap = async (blob) => canvas.loadImage(Buffer.from(await blob.arrayBuffer()))
  const emfConverter = await import('emf-converter')
  const { convertEmfToDataUrl, convertWmfToDataUrl } = emfConverter.default ?? emfConverter
  const arrayBuffer = input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength)
  const dataUrl = path.extname(argument('--input')).toLowerCase() === '.wmf'
    ? await convertWmfToDataUrl(arrayBuffer)
    : await convertEmfToDataUrl(arrayBuffer)
  if (!dataUrl) throw new Error('metafile conversion returned no image')
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
}

async function main() {
  const format = argument('--format').toLowerCase()
  const inputPath = argument('--input')
  const outputPath = argument('--output')
  const input = await fs.readFile(inputPath)
  const output = format === 'wdp' || format === 'jxr'
    ? await convertWdp(input)
    : format === 'emf' || format === 'wmf'
      ? await convertEmf(input)
      : (() => { throw new Error(`unsupported conversion format: ${format}`) })()
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, output)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
