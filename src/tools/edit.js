import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'

export async function editMetadata(file, { title, author, subject, keywords }) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  if (title !== undefined) doc.setTitle(title)
  if (author !== undefined) doc.setAuthor(author)
  if (subject !== undefined) doc.setSubject(subject)
  if (keywords !== undefined) doc.setKeywords([keywords])
  doc.setModificationDate(new Date())
  return new Blob([await doc.save()], { type: 'application/pdf' })
}

export async function removeMetadata(file) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  doc.setTitle('')
  doc.setAuthor('')
  doc.setSubject('')
  doc.setKeywords([])
  doc.setProducer('')
  doc.setCreator('')
  return new Blob([await doc.save()], { type: 'application/pdf' })
}

export async function addPageNumbers(file, { position = 'bottom-center', startFrom = 1 } = {}) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const pages = doc.getPages()

  pages.forEach((page, i) => {
    const { width, height } = page.getSize()
    const text = String(startFrom + i)
    const size = 10
    const tw = font.widthOfTextAtSize(text, size)
    let x = width / 2 - tw / 2
    let y = 20
    if (position === 'top-center') y = height - 30
    if (position === 'bottom-right') x = width - tw - 20
    if (position === 'bottom-left') x = 20
    page.drawText(text, { x, y, size, font, color: rgb(0.3, 0.3, 0.3) })
  })
  return new Blob([await doc.save()], { type: 'application/pdf' })
}

export async function flattenPDF(file) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const out = await doc.save({ useObjectStreams: false })
  return new Blob([out], { type: 'application/pdf' })
}

export async function grayscalePDF(file) {
  // Grayscale via canvas rendering with pdfjs then re-packing
  const { pdfToImages } = await import('./pdfToImage.js')
  const images = await pdfToImages(file, 2)
  const newDoc = await PDFDocument.create()

  for (const img of images) {
    const canvas = document.createElement('canvas')
    const image = new Image()
    await new Promise(res => { image.onload = res; image.src = img.dataUrl })
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.filter = 'grayscale(100%)'
    ctx.drawImage(image, 0, 0)
    const grayDataUrl = canvas.toDataURL('image/jpeg', 0.92)
    const base64 = grayDataUrl.split(',')[1]
    const imgBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const embedded = await newDoc.embedJpg(imgBytes)
    const page = newDoc.addPage([embedded.width, embedded.height])
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height })
  }
  return new Blob([await newDoc.save()], { type: 'application/pdf' })
}
