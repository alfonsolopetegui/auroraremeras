import { put, del } from '@vercel/blob'
import sharp from 'sharp'

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/)
  if (!match) throw new Error('Invalid image data')
  return { contentType: match[1], base64: match[2] }
}

async function optimizeImage(buffer: Buffer, originalContentType: string) {
  try {
    let optimizedBuffer = await sharp(buffer)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()

    const MAX_SIZE = 1024 * 1024 // 1MB

    // Si supera 1MB, reducir calidad iterativamente
    let quality = 82
    while (optimizedBuffer.length > MAX_SIZE && quality > 40) {
      quality -= 10
      optimizedBuffer = await sharp(buffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality })
        .toBuffer()
    }

    // Si aún supera 1MB, reducir dimensiones
    if (optimizedBuffer.length > MAX_SIZE) {
      optimizedBuffer = await sharp(buffer)
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer()
    }

    return {
      buffer: optimizedBuffer,
      contentType: 'image/webp',
      ext: 'webp',
    }
  } catch (err) {
    console.error('Image optimization failed, using original buffer', err)
    const fallbackExt = originalContentType.split('/')[1] || 'bin'
    return {
      buffer,
      contentType: originalContentType,
      ext: fallbackExt,
    }
  }
}

export async function uploadProductImage(dataUrl: string) {
  const { contentType, base64 } = parseDataUrl(dataUrl)
  const buffer = Buffer.from(base64, 'base64')

  const { buffer: optimized, contentType: finalContentType, ext } = await optimizeImage(buffer, contentType)

  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const filename = `products/${unique}.${ext}`

  const { url } = await put(filename, optimized, {
    access: 'public',
    contentType: finalContentType,
  })

  return url
}

export async function deleteProductImage(url?: string | null) {
  if (!url) return
  try {
    await del(url)
  } catch (err) {
    console.error('Failed to delete blob', err)
  }
}
