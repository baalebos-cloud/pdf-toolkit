import SingleFileTool from '../components/SingleFileTool'
import { pdfToText } from '../tools/convert'

export default function PdfToTextPage() {
  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to extract text"
      buttonLabel="Extract Text"
      processFn={pdfToText}
      outputName={n => n.replace('.pdf', '.txt')}
    />
  )
}
