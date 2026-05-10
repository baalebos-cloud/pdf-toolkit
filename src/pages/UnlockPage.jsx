import SingleFileTool from '../components/SingleFileTool'
import { removePDFPassword } from '../tools/security'

export default function UnlockPage() {
  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a password-free or unlocked PDF"
      buttonLabel="Unlock PDF"
      processFn={removePDFPassword}
      outputName={n => `unlocked_${n}`}
    />
  )
}
