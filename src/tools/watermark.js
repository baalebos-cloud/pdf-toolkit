import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'

export async function watermarkPDF(file, text = 'CONFIDENTIAL') {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const font = await doc.embedFont(StandardFonts.HelveticaBold)

  doc.getPages().forEach(page => {
    const { width, height } = page.getSize()
    const fontSize = Math.min(width, height) * 0.08
    const textWidth = font.widthOfTextAtSize(text, fontSize)
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.35,
      rotate: degrees(45),
    })
  })
  const out = await doc.save()
  return new Blob([out], { type: 'application/pdf' })
}
