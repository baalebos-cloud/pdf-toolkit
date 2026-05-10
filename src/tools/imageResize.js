export const PRESETS = [
  { label: 'HD', width: 1280, height: 720 },
  { label: 'Full HD', width: 1920, height: 1080 },
  { label: '4K', width: 3840, height: 2160 },
  { label: 'Instagram Square', width: 1080, height: 1080 },
  { label: 'Instagram Portrait', width: 1080, height: 1350 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'Facebook Cover', width: 820, height: 312 },
  { label: 'Facebook Post', width: 1200, height: 630 },
  { label: 'Twitter/X Post', width: 1200, height: 675 },
  { label: 'Twitter/X Header', width: 1500, height: 500 },
  { label: 'LinkedIn Cover', width: 1584, height: 396 },
  { label: 'LinkedIn Post', width: 1200, height: 627 },
  { label: 'YouTube Thumbnail', width: 1280, height: 720 },
  { label: 'WhatsApp DP', width: 500, height: 500 },
  { label: 'A4 (300dpi)', width: 2480, height: 3508 },
  { label: 'Passport Photo', width: 413, height: 531 },
  { label: 'Custom', width: null, height: null },
]

export async function resizeImage(file, width, height, format = 'image/jpeg', quality = 0.92, maintainAspect = false) {
  const img = new Image()
  const url = URL.createObjectURL(file)

  await new Promise((res, rej) => {
    img.onload = res
    img.onerror = rej
    img.src = url
  })
  URL.revokeObjectURL(url)

  let targetW = width
  let targetH = height

  if (maintainAspect && width && height) {
    const ratio = img.width / img.height
    const targetRatio = width / height
    if (ratio > targetRatio) {
      targetH = Math.round(width / ratio)
    } else {
      targetW = Math.round(height * ratio)
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetW || img.width
  canvas.height = targetH || img.height

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return new Promise(res => {
    canvas.toBlob(blob => res(blob), format, quality)
  })
}
