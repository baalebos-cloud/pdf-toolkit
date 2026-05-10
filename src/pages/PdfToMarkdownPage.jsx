import SingleFileTool from '../components/SingleFileTool'
import { pdfToMarkdown } from '../tools/convert'

export default function PdfToMarkdownPage() {
  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to convert to Markdown"
      buttonLabel="Convert to Markdown"
      processFn={pdfToMarkdown}
      outputName={n => n.replace('.pdf', '.md')}
    />
  )
}
