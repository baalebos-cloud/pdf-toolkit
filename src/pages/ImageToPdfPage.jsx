import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { imagesToPDF } from '../tools/imageToPdf'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function ImageToPdfPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const addFiles = f => setFiles(prev => [...prev, ...f])
  const remove = i => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const run = async () => {
    setLoading(true)
    try {
      const blob = await imagesToPDF(files)
      downloadBlob(blob, 'images.pdf')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Dropzone accept="image/png,image/jpeg,image/jpg" multiple onFiles={addFiles} label="Drop PNG or JPG images" />

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-200">{f.name}</p>
                <p className="text-xs text-gray-500">{formatBytes(f.size)}</p>
              </div>
              <button onClick={() => remove(i)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button className="btn-primary w-full" disabled={files.length === 0 || loading} onClick={run}>
        {loading ? 'Converting…' : `Convert ${files.length} Image${files.length !== 1 ? 's' : ''} to PDF`}
      </button>
    </div>
  )
}
