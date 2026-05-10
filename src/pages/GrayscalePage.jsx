import SingleFileTool from '../components/SingleFileTool'
import { grayscalePDF } from '../tools/edit'

export default function GrayscalePage() {
  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to convert to grayscale"
      buttonLabel="Convert to Grayscale"
      processFn={grayscalePDF}
      outputName={n => `grayscale_${n}`}
    />
  )
}
