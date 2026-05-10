import { PDFDocument } from 'pdf-lib'

export async function compressPDF(file) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes, { updateMetadata: false })
  const out = await doc.save({ useObjectStreams: true })
  return new Blob([out], { type: 'application/pdf' })
}
