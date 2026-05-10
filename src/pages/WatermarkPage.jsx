import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { watermarkPDF } from '../tools/watermark'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function WatermarkPage() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    try {
      const blob = await watermarkPDF(file, text)
      downloadBlob(blob, `watermarked_${file.name}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept="application/pdf" onFiles={f => setFile(f[0])} label="Drop a PDF to watermark" />
        : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <button onClick={() => setFile(null)} className="btn-ghost p-1.5 text-red-400"><XMarkIcon className="w-4 h-4" /></button>
          </div>
        )
      }

      <div className="space-y-2">
        <label className="text-sm text-gray-400 font-medium">Watermark Text</label>
        <input value={text} onChange={e => setText(e.target.value)} maxLength={40}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="e.g. CONFIDENTIAL, DRAFT…" />
      </div>

      <button className="btn-primary w-full" disabled={!file || !text.trim() || loading} onClick={run}>
        {loading ? 'Adding Watermark…' : 'Add Watermark'}
      </button>
    </div>
  )
}
