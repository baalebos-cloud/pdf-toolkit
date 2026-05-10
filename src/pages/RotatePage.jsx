import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { rotatePDF } from '../tools/rotate'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'

const ANGLES = [90, 180, 270]

export default function RotatePage() {
  const [file, setFile] = useState(null)
  const [angle, setAngle] = useState(90)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    try {
      const blob = await rotatePDF(file, angle)
      downloadBlob(blob, `rotated_${file.name}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept="application/pdf" onFiles={f => setFile(f[0])} label="Drop a PDF to rotate" />
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
        <p className="text-sm text-gray-400 font-medium">Rotation Angle</p>
        <div className="flex gap-3">
          {ANGLES.map(a => (
            <button key={a} onClick={() => setAngle(a)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm border transition-colors ${angle === a ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-indigo-500'}`}>
              {a}°
            </button>
          ))}
        </div>
      </div>

      <button className="btn-primary w-full" disabled={!file || loading} onClick={run}>
        {loading ? 'Rotating…' : `Rotate ${angle}°`}
      </button>
    </div>
  )
}
