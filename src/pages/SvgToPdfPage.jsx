import SingleFileTool from '../components/SingleFileTool'
import { svgToPDF } from '../tools/convert'

export default function SvgToPdfPage() {
  return (
    <SingleFileTool
      accept="image/svg+xml,.svg"
      label="Drop an SVG file to convert to PDF"
      buttonLabel="Convert to PDF"
      processFn={svgToPDF}
      outputName={n => n.replace('.svg', '.pdf')}
    />
  )
}
