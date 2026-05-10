import { useState } from 'react'
import SingleFileTool from '../components/SingleFileTool'
import { addPageNumbers } from '../tools/edit'

const POSITIONS = ['bottom-center', 'bottom-right', 'bottom-left', 'top-center']

export default function PageNumbersPage() {
  const [position, setPosition] = useState('bottom-center')
  const [startFrom, setStartFrom] = useState(1)

  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to add page numbers"
      buttonLabel="Add Page Numbers"
      processFn={file => addPageNumbers(file, { position, startFrom: Number(startFrom) })}
      outputName={n => `numbered_${n}`}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400 font-medium">Position</label>
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map(p => (
              <button key={p} onClick={() => setPosition(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${position === p ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-indigo-500'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-400 font-medium">Start from</label>
          <input type="number" min={1} value={startFrom} onChange={e => setStartFrom(e.target.value)}
            className="w-24 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
        </div>
      </div>
    </SingleFileTool>
  )
}
