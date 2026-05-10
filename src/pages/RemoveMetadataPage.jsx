import SingleFileTool from '../components/SingleFileTool'
import { removeMetadata } from '../tools/edit'

export default function RemoveMetadataPage() {
  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to strip its metadata"
      buttonLabel="Remove Metadata"
      processFn={removeMetadata}
      outputName={n => `clean_${n}`}
    />
  )
}
