import SingleFileTool from '../components/SingleFileTool'
import { txtToPDF } from '../tools/convert'

export default function TxtToPdfPage() {
  return (
    <SingleFileTool
      accept="text/plain,.txt"
      label="Drop a .txt file to convert to PDF"
      buttonLabel="Convert to PDF"
      processFn={txtToPDF}
      outputName={n => n.replace('.txt', '.pdf')}
    />
  )
}
