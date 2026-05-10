import { useState } from 'react'
import SingleFileTool from '../components/SingleFileTool'
import { reorderPages } from '../tools/organize'

export default function ReorderPagesPage() {
  const [order, setOrder] = useState('')

  const parseOrder = str => str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))

  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to reorder pages"
      buttonLabel="Reorder Pages"
      processFn={file => reorderPages(file, parseOrder(order))}
      outputName={n => `reordered_${n}`}
    >
      <div className="space-y-2">
        <label className="text-sm text-gray-400 font-medium">New page order</label>
        <input value={order} onChange={e => setOrder(e.target.value)}
          placeholder="e.g. 3, 1, 2, 4"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
        <p className="text-xs text-gray-500">Enter page numbers in the desired order, separated by commas.</p>
      </div>
    </SingleFileTool>
  )
}
