import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { splitPDF } from '../tools/split'
import { downloadBlob, formatBytes } from '../tools/utils'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function SplitPage() {
  const [file, setFile] = useState(null)
  const [ranges, setRanges] = useState([{ from: 1, to: 1 }])
  const [loading, setLoading] = useState(false)

  const updateRange = (i, key, val) =>
    setRanges(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: Number(val) } : r))

  const run = async () => {
    setLoading(true)
    try {
      const blobs = await splitPDF(file, ranges)
      blobs.forEach(({ blob, name }) => downloadBlob(blob, name))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept="application/pdf" onFiles={f => setFile(f[0])} label="Drop a PDF to split" />
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

      <div className="space-y-3">
        <p className="text-sm text-gray-400 font-medium">Page Ranges</p>
        {ranges.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-gray-500 text-sm w-5">{i + 1}.</span>
            <input type="number" min={1} value={r.from} onChange={e => updateRange(i, 'from', e.target.value)}
              className="w-20 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500" />
            <span className="text-gray-500 text-sm">to</span>
            <input type="number" min={1} value={r.to} onChange={e => updateRange(i, 'to', e.target.value)}
              className="w-20 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500" />
            {ranges.length > 1 && (
              <button onClick={() => setRanges(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300">
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button onClick={() => setRanges(prev => [...prev, { from: 1, to: 1 }])} className="btn-ghost flex items-center gap-1.5 text-sm">
          <PlusIcon className="w-4 h-4" /> Add Range
        </button>
      </div>

      <button className="btn-primary w-full" disabled={!file || loading} onClick={run}>
        {loading ? 'Splitting…' : 'Split PDF'}
      </button>
    </div>
  )
}
