import { useState } from 'react'
import SingleFileTool from '../components/SingleFileTool'
import { deletePages } from '../tools/organize'

export default function DeletePagesPage() {
  const [input, setInput] = useState('')

  const parsePages = str => {
    const pages = new Set()
    str.split(',').forEach(part => {
      const [a, b] = part.trim().split('-').map(Number)
      if (b) for (let i = a; i <= b; i++) pages.add(i)
      else if (!isNaN(a)) pages.add(a)
    })
    return [...pages]
  }

  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to delete pages from"
      buttonLabel="Delete Pages"
      processFn={file => deletePages(file, parsePages(input))}
      outputName={n => `deleted_${n}`}
    >
      <div className="space-y-2">
        <label className="text-sm text-gray-400 font-medium">Pages to delete</label>
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="e.g. 1, 3, 5-8"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
        <p className="text-xs text-gray-500">Separate pages with commas. Use ranges like 5-8.</p>
      </div>
    </SingleFileTool>
  )
}
