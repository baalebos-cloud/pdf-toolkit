import SingleFileTool from '../components/SingleFileTool'
import { excelToPDF } from '../tools/excelToPdf'

export default function ExcelToPdfPage() {
  return (
    <SingleFileTool
      accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      label="Drop an Excel file (.xlsx) to convert to PDF"
      buttonLabel="Convert to PDF"
      processFn={excelToPDF}
      outputName={n => n.replace(/\.xlsx?$/i, '.pdf')}
    />
  )
}
