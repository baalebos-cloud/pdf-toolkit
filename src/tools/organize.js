import { PDFDocument } from 'pdf-lib'

export async function deletePages(file, pagesToDelete) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const total = doc.getPageCount()
  const toRemove = pagesToDelete.map(n => n - 1).filter(i => i >= 0 && i < total).sort((a, b) => b - a)
  toRemove.forEach(i => doc.removePage(i))
  return new Blob([await doc.save()], { type: 'application/pdf' })
}

export async function reorderPages(file, newOrder) {
  const bytes = await file.arrayBuffer()
  const src = await PDFDocument.load(bytes)
  const doc = await PDFDocument.create()
  const indices = newOrder.map(n => n - 1)
  const pages = await doc.copyPages(src, indices)
  pages.forEach(p => doc.addPage(p))
  return new Blob([await doc.save()], { type: 'application/pdf' })
}

export async function insertBlankPage(file, afterPage) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const ref = doc.getPage(Math.min(afterPage - 1, doc.getPageCount() - 1))
  const { width, height } = ref.getSize()
  doc.insertPage(afterPage, [width, height])
  return new Blob([await doc.save()], { type: 'application/pdf' })
}
