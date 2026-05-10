import SingleFileTool from '../components/SingleFileTool'
import { wordToPDF } from '../tools/wordToPdf'

export default function WordToPdfPage() {
  return (
    <SingleFileTool
      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      label="Drop a .docx Word file to convert to PDF"
      buttonLabel="Convert to PDF"
      processFn={wordToPDF}
      outputName={n => n.replace(/\.docx?$/i, '.pdf')}
    />
  )
}
