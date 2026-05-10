import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { mergePDFs } from '../tools/merge'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'

export default function MergePage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const addFiles = f => setFiles(prev => [...prev, ...f])
  const remove = i => setFiles(prev => prev.filter((_, idx) => idx !== i))
  const moveUp = i => {
    if (i === 0) return
    setFiles(prev => { const a = [...prev]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a })
  }

  const run = async () => {
    setLoading(true)
    try {
      const blob = await mergePDFs(files)
      downloadBlob(blob, 'merged.pdf')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Dropzone accept="application/pdf" multiple onFiles={addFiles} label="Drop PDF files to merge" />
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-200">{f.name}</p>
                <p className="text-xs text-gray-500">{formatBytes(f.size)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => moveUp(i)} className="btn-ghost p-1.5" title="Move up">
                  <ArrowsUpDownIcon className="w-4 h-4" />
                </button>
                <button onClick={() => remove(i)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button className="btn-primary w-full" disabled={files.length < 2 || loading} onClick={run}>
        {loading ? 'Merging…' : `Merge ${files.length} PDFs`}
      </button>
    </div>
  )
}
