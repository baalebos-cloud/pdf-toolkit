import { PDFDocument, degrees } from 'pdf-lib'

export async function rotatePDF(file, angle = 90) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  doc.getPages().forEach(page => {
    page.setRotation(degrees((page.getRotation().angle + angle) % 360))
  })
  const out = await doc.save()
  return new Blob([out], { type: 'application/pdf' })
}
