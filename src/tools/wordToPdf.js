import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function wordToPDF(file) {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer })

  // Strip HTML tags to get plain text with basic structure
  const text = html
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '  • $1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  const fontSize = 11
  const lineHeight = fontSize * 1.5
  const margin = 60
  const pageWidth = 595
  const pageHeight = 842
  const maxWidth = pageWidth - margin * 2

  const rawLines = text.split('\n')
  const lines = []

  for (const raw of rawLines) {
    const trimmed = raw.trimEnd()
    if (!trimmed) { lines.push({ text: '', bold: false }); continue }
    const isBold = /^[A-Z\s]{4,}$/.test(trimmed) || trimmed.endsWith(':')
    const f = isBold ? boldFont : font
    const words = trimmed.split(' ')
    let line = ''
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (f.widthOfTextAtSize(test, fontSize) > maxWidth) {
        lines.push({ text: line, bold: isBold })
        line = word
      } else {
        line = test
      }
    }
    if (line) lines.push({ text: line, bold: isBold })
  }

  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight)
  const chunks = []
  for (let i = 0; i < lines.length; i += linesPerPage) chunks.push(lines.slice(i, i + linesPerPage))
  if (!chunks.length) chunks.push([{ text: '', bold: false }])

  for (const chunk of chunks) {
    const page = doc.addPage([pageWidth, pageHeight])
    chunk.forEach((line, i) => {
      if (!line.text) return
      page.drawText(line.text, {
        x: margin,
        y: pageHeight - margin - i * lineHeight,
        size: fontSize,
        font: line.bold ? boldFont : font,
        color: rgb(0, 0, 0),
      })
    })
  }

  return new Blob([await doc.save()], { type: 'application/pdf' })
}
