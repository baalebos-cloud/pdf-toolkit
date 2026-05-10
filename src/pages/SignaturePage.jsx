import { useState, useRef, useEffect } from 'react'
import SignaturePad from 'signature_pad'
import Dropzone from '../components/Dropzone'
import { addSignatureToPDF } from '../tools/signature'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const MODES = ['Draw', 'Type']

export default function SignaturePage() {
  const [file, setFile] = useState(null)
  const [mode, setMode] = useState('Draw')
  const [typedSig, setTypedSig] = useState('')
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const canvasRef = useRef(null)
  const padRef = useRef(null)

  useEffect(() => {
    if (mode === 'Draw' && canvasRef.current) {
      padRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgba(0,0,0,0)',
        penColor: '#4f46e5',
      })
    }
    return () => padRef.current?.off()
  }, [mode])

  const getSignatureDataUrl = () => {
    if (mode === 'Draw') {
      if (!padRef.current || padRef.current.isEmpty()) return null
      return padRef.current.toDataURL('image/png')
    }
    // Render typed signature to canvas
    const canvas = document.createElement('canvas')
    canvas.width = 400; canvas.height = 120
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 400, 120)
    ctx.font = 'italic 48px Georgia, serif'
    ctx.fillStyle = '#4f46e5'
    ctx.textBaseline = 'middle'
    ctx.fillText(typedSig, 20, 60)
    return canvas.toDataURL('image/png')
  }

  const run = async () => {
    const dataUrl = getSignatureDataUrl()
    if (!dataUrl) return
    setLoading(true)
    try {
      const blob = await addSignatureToPDF(file, dataUrl, { page: Number(pageNum) })
      downloadBlob(blob, `signed_${file.name}`)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  const canSign = file && (mode === 'Draw' || typedSig.trim())

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept="application/pdf" onFiles={f => { setFile(f[0]); setDone(false) }} label="Drop a PDF to sign" />
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

      {/* Mode toggle */}
      <div className="flex gap-2">
        {MODES.map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${mode === m ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-indigo-500'}`}>
            {m} Signature
          </button>
        ))}
      </div>

      {mode === 'Draw' ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-400 font-medium">Draw your signature below</p>
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900">
            <canvas ref={canvasRef} width={460} height={140} className="w-full touch-none" />
          </div>
          <button onClick={() => padRef.current?.clear()} className="btn-ghost text-xs py-1.5 px-3">Clear</button>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm text-gray-400 font-medium">Type your name</label>
          <input value={typedSig} onChange={e => setTypedSig(e.target.value)}
            placeholder="Your full name…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
          {typedSig && (
            <div className="border border-gray-700 rounded-xl p-4 bg-gray-900">
              <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', color: '#4f46e5' }}>
                {typedSig}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm text-gray-400 font-medium">Place on page</label>
        <input type="number" min={1} value={pageNum} onChange={e => setPageNum(e.target.value)}
          className="w-24 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
      </div>

      {done && (
        <div className="bg-green-950/40 border border-green-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">Signed PDF downloaded successfully.</p>
        </div>
      )}

      <button className="btn-primary w-full" disabled={!canSign || loading} onClick={run}>
        {loading ? 'Signing…' : 'Sign & Download PDF'}
      </button>
    </div>
  )
}
