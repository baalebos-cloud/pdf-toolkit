import { PDFDocument } from 'pdf-lib'

export async function imagesToPDF(files) {
  const doc = await PDFDocument.create()

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const mime = file.type
    let img

    if (mime === 'image/jpeg' || mime === 'image/jpg') {
      img = await doc.embedJpg(bytes)
    } else {
      img = await doc.embedPng(bytes)
    }

    const page = doc.addPage([img.width, img.height])
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
  }

  const out = await doc.save()
  return new Blob([out], { type: 'application/pdf' })
}
