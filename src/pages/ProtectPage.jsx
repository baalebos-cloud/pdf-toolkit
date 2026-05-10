import { useState } from 'react'
import SingleFileTool from '../components/SingleFileTool'
import { encryptPDF } from '../tools/security'

export default function ProtectPage() {
  const [pass, setPass] = useState('')

  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to protect"
      buttonLabel="Protect PDF"
      processFn={file => encryptPDF(file, pass, pass)}
      outputName={n => `protected_${n}`}
    >
      <div className="space-y-2">
        <label className="text-sm text-gray-400 font-medium">Password</label>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)}
          placeholder="Enter a password…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
        <p className="text-xs text-gray-500">Note: Full encryption requires a server-side tool. This marks the PDF as protected.</p>
      </div>
    </SingleFileTool>
  )
}
