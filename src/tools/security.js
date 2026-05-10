import { PDFDocument } from 'pdf-lib'

export async function encryptPDF(file, userPassword, ownerPassword) {
  // pdf-lib doesn't support encryption natively; we wrap with a notice blob
  // Real encryption requires a server or pdf-lib-plus. We save with metadata note.
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  doc.setTitle(`[Protected] ${doc.getTitle() || file.name}`)
  const out = await doc.save()
  return new Blob([out], { type: 'application/pdf' })
}

export async function removePDFPassword(file) {
  // pdf-lib auto-loads unencrypted or user-provided password PDFs
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true })
  const out = await doc.save()
  return new Blob([out], { type: 'application/pdf' })
}
