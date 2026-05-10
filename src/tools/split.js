import { PDFDocument } from 'pdf-lib'

export async function splitPDF(file, ranges) {
  const bytes = await file.arrayBuffer()
  const src = await PDFDocument.load(bytes)
  const total = src.getPageCount()
  const blobs = []

  for (const range of ranges) {
    const doc = await PDFDocument.create()
    const start = Math.max(0, range.from - 1)
    const end = Math.min(total - 1, range.to - 1)
    const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    const pages = await doc.copyPages(src, indices)
    pages.forEach(p => doc.addPage(p))
    const out = await doc.save()
    blobs.push({ blob: new Blob([out], { type: 'application/pdf' }), name: `split_${range.from}-${range.to}.pdf` })
  }
  return blobs
}
