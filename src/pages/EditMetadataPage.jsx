import { useState } from 'react'
import SingleFileTool from '../components/SingleFileTool'
import { editMetadata } from '../tools/edit'

export default function EditMetadataPage() {
  const [meta, setMeta] = useState({ title: '', author: '', subject: '', keywords: '' })
  const set = k => e => setMeta(m => ({ ...m, [k]: e.target.value }))

  const fields = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'subject', label: 'Subject' },
    { key: 'keywords', label: 'Keywords' },
  ]

  return (
    <SingleFileTool
      accept="application/pdf"
      label="Drop a PDF to edit its metadata"
      buttonLabel="Save Metadata"
      processFn={file => editMetadata(file, meta)}
      outputName={n => `meta_${n}`}
    >
      <div className="space-y-3">
        {fields.map(f => (
          <div key={f.key} className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">{f.label}</label>
            <input value={meta[f.key]} onChange={set(f.key)} placeholder={`Enter ${f.label.toLowerCase()}…`}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
        ))}
      </div>
    </SingleFileTool>
  )
}
