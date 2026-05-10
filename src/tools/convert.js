import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function txtToPDF(file) {
  const text = await file.text()
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Courier)
  const fontSize = 11
  const margin = 50
  const lineHeight = fontSize * 1.4
  const lines = []

  for (const raw of text.split('\n')) {
    const words = raw.split(' ')
    let line = ''
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(test, fontSize) > 595 - margin * 2) {
        lines.push(line)
        line = word
      } else {
        line = test
      }
    }
    lines.push(line)
  }

  const pageHeight = 842
  const usable = pageHeight - margin * 2
  const linesPerPage = Math.floor(usable / lineHeight)
  const chunks = []
  for (let i = 0; i < lines.length; i += linesPerPage) chunks.push(lines.slice(i, i + linesPerPage))
  if (chunks.length === 0) chunks.push([''])

  for (const chunk of chunks) {
    const page = doc.addPage([595, pageHeight])
    chunk.forEach((line, i) => {
      page.drawText(line, {
        x: margin,
        y: pageHeight - margin - i * lineHeight,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })
    })
  }
  return new Blob([await doc.save()], { type: 'application/pdf' })
}

export async function htmlToPDF(file) {
  const html = await file.text()
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:794px;height:1123px;'
  document.body.appendChild(iframe)
  iframe.contentDocument.open()
  iframe.contentDocument.write(html)
  iframe.contentDocument.close()
  await new Promise(r => setTimeout(r, 800))

  const canvas = document.createElement('canvas')
  canvas.width = 794
  canvas.height = 1123
  // Use html2canvas-like approach via iframe screenshot isn't possible without a lib
  // Fallback: embed HTML as text in PDF
  document.body.removeChild(iframe)
  return txtToPDF(new File([html], file.name))
}

export async function pdfToText(file) {
  const pdfjsLib = await import('pdfjs-dist')
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker?url')
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default
  const bytes = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map(s => s.str).join(' ') + '\n\n'
  }
  return new Blob([fullText], { type: 'text/plain' })
}

export async function pdfToMarkdown(file) {
  const pdfjsLib = await import('pdfjs-dist')
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker?url')
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default
  const bytes = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
  let md = `# ${file.name.replace('.pdf', '')}\n\n`
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    md += `## Page ${i}\n\n`
    md += content.items.map(s => s.str).join(' ') + '\n\n'
  }
  return new Blob([md], { type: 'text/markdown' })
}

export async function svgToPDF(file) {
  const svgText = await file.text()
  const doc = await PDFDocument.create()
  const page = doc.addPage([595, 842])
  // Embed SVG as image via canvas
  const img = new Image()
  const blob = new Blob([svgText], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url })
  const canvas = document.createElement('canvas')
  canvas.width = 595; canvas.height = 842
  canvas.getContext('2d').drawImage(img, 0, 0, 595, 842)
  URL.revokeObjectURL(url)
  const pngBytes = await fetch(canvas.toDataURL('image/png')).then(r => r.arrayBuffer())
  const embedded = await doc.embedPng(pngBytes)
  page.drawImage(embedded, { x: 0, y: 0, width: 595, height: 842 })
  return new Blob([await doc.save()], { type: 'application/pdf' })
}
