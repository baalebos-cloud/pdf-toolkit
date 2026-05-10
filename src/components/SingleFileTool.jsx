import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function SingleFileTool({ accept, label, buttonLabel, processFn, outputName, children }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const run = async () => {
    setLoading(true)
    setDone(false)
    try {
      const result = await processFn(file)
      const name = typeof outputName === 'function' ? outputName(file.name) : outputName
      downloadBlob(result, name)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept={accept} onFiles={f => { setFile(f[0]); setDone(false) }} label={label} />
        : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setDone(false) }} className="btn-ghost p-1.5 text-red-400">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )
      }
      {children}
      {done && (
        <div className="bg-green-950/40 border border-green-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">Done! File downloaded successfully.</p>
        </div>
      )}
      <button className="btn-primary w-full" disabled={!file || loading} onClick={run}>
        {loading ? 'Processing…' : buttonLabel}
      </button>
    </div>
  )
}
