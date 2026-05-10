import { useState } from 'react'
import SingleFileTool from '../components/SingleFileTool'
import { insertBlankPage } from '../tools/organize'

export default function InsertPagePage() {
  const [after, setAfter] = useState(1)

  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to insert a blank page"
      buttonLabel="Insert Blank Page"
      processFn={file => insertBlankPage(file, Number(after))}
      outputName={n => `inserted_${n}`}
    >
      <div className="space-y-2">
        <label className="text-sm text-gray-400 font-medium">Insert after page</label>
        <input type="number" min={0} value={after} onChange={e => setAfter(e.target.value)}
          className="w-32 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
        <p className="text-xs text-gray-500">Use 0 to insert before the first page.</p>
      </div>
    </SingleFileTool>
  )
}
