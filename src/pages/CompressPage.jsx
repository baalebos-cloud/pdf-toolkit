import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { compressPDF } from '../tools/compress'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function CompressPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const run = async () => {
    setLoading(true)
    setResult(null)
    try {
      const blob = await compressPDF(file)
      const saved = file.size - blob.size
      const pct = ((saved / file.size) * 100).toFixed(1)
      setResult({ blob, saved, pct, name: `compressed_${file.name}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept="application/pdf" onFiles={f => { setFile(f[0]); setResult(null) }} label="Drop a PDF to compress" />
        : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null) }} className="btn-ghost p-1.5 text-red-400"><XMarkIcon className="w-4 h-4" /></button>
          </div>
        )
      }

      {result && (
        <div className="bg-green-950/40 border border-green-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">
            Saved {formatBytes(result.saved)} ({result.pct}% smaller)
          </p>
        </div>
      )}

      {result
        ? <button className="btn-primary w-full" onClick={() => downloadBlob(result.blob, result.name)}>Download Compressed PDF</button>
        : <button className="btn-primary w-full" disabled={!file || loading} onClick={run}>{loading ? 'Compressing…' : 'Compress PDF'}</button>
      }
    </div>
  )
}
