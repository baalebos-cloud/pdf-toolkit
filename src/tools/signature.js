import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function addSignatureToPDF(file, signatureDataUrl, options = {}) {
  const { page: pageNum = 1, x = 50, y = 50, width = 200, height = 60 } = options
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)

  const pages = doc.getPages()
  const page = pages[Math.min(pageNum - 1, pages.length - 1)]
  const { height: pageHeight } = page.getSize()

  // Convert dataUrl to bytes
  const base64 = signatureDataUrl.split(',')[1]
  const imgBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  const img = await doc.embedPng(imgBytes)

  page.drawImage(img, {
    x,
    y: pageHeight - y - height,
    width,
    height,
  })

  // Add signed date below signature
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  page.drawText(`Signed: ${date}`, {
    x,
    y: pageHeight - y - height - 14,
    size: 8,
    font,
    color: rgb(0.4, 0.4, 0.4),
  })

  return new Blob([await doc.save()], { type: 'application/pdf' })
}
