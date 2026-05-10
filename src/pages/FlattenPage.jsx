import SingleFileTool from '../components/SingleFileTool'
import { flattenPDF } from '../tools/edit'

export default function FlattenPage() {
  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to flatten (remove form fields & annotations)"
      buttonLabel="Flatten PDF"
      processFn={flattenPDF}
      outputName={n => `flattened_${n}`}
    />
  )
}
