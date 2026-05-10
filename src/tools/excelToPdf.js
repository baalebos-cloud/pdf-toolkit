import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function excelToPDF(file) {
  const XLSX = await import('xlsx')
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
    if (!rows.length) continue

    const pageWidth = 842
    const pageHeight = 595
    const margin = 40
    const rowHeight = 20
    const fontSize = 9
    const usableWidth = pageWidth - margin * 2

    // Calculate column widths
    const colCount = Math.max(...rows.map(r => r.length))
    const colWidth = usableWidth / Math.max(colCount, 1)

    const rowsPerPage = Math.floor((pageHeight - margin * 2 - 20) / rowHeight)
    const chunks = []
    for (let i = 0; i < rows.length; i += rowsPerPage) chunks.push(rows.slice(i, i + rowsPerPage))
    if (!chunks.length) chunks.push([[]])

    for (const chunk of chunks) {
      const page = doc.addPage([pageWidth, pageHeight])
      const startY = pageHeight - margin - 15

      // Sheet name header
      page.drawText(`Sheet: ${sheetName}`, {
        x: margin, y: pageHeight - margin + 5,
        size: 10, font: boldFont, color: rgb(0.3, 0.3, 0.3),
      })

      chunk.forEach((row, rowIdx) => {
        const y = startY - rowIdx * rowHeight
        const isHeader = rowIdx === 0 && chunks[0] === chunk

        // Row background for header
        if (isHeader) {
          page.drawRectangle({
            x: margin, y: y - 4,
            width: usableWidth, height: rowHeight,
            color: rgb(0.2, 0.2, 0.6), opacity: 0.15,
          })
        } else if (rowIdx % 2 === 0) {
          page.drawRectangle({
            x: margin, y: y - 4,
            width: usableWidth, height: rowHeight,
            color: rgb(0.95, 0.95, 0.95), opacity: 0.5,
          })
        }

        row.forEach((cell, colIdx) => {
          const x = margin + colIdx * colWidth
          const cellText = String(cell ?? '').slice(0, 30)
          if (!cellText) return
          page.drawText(cellText, {
            x: x + 3, y: y + 3,
            size: fontSize,
            font: isHeader ? boldFont : font,
            color: rgb(0, 0, 0),
            maxWidth: colWidth - 6,
          })
        })

        // Row border
        page.drawLine({
          start: { x: margin, y: y - 4 },
          end: { x: margin + usableWidth, y: y - 4 },
          thickness: 0.3, color: rgb(0.8, 0.8, 0.8),
        })
      })

      // Column borders
      for (let c = 0; c <= colCount; c++) {
        const x = margin + c * colWidth
        page.drawLine({
          start: { x, y: startY + rowHeight - 4 },
          end: { x, y: startY - chunk.length * rowHeight - 4 },
          thickness: 0.3, color: rgb(0.8, 0.8, 0.8),
        })
      }
    }
  }

  return new Blob([await doc.save()], { type: 'application/pdf' })
}
