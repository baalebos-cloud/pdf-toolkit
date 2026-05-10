import { createWorker } from 'tesseract.js'

export async function ocrPDF(file, onProgress) {
  const pdfjsLib = await import('pdfjs-dist')
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker?url')
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default

  const bytes = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
  const worker = await createWorker('eng', 1, {
    logger: m => onProgress && onProgress(m),
  })

  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 2 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise

    const { data: { text } } = await worker.recognize(canvas)
    fullText += `--- Page ${i} ---\n${text}\n\n`
  }

  await worker.terminate()
  return new Blob([fullText], { type: 'text/plain' })
}

export async function ocrImage(file, onProgress) {
  const worker = await createWorker('eng', 1, {
    logger: m => onProgress && onProgress(m),
  })
  const { data: { text } } = await worker.recognize(file)
  await worker.terminate()
  return new Blob([text], { type: 'text/plain' })
}
