import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { ocrPDF, ocrImage } from '../tools/ocr'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function OcrPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState(null)

  const isPDF = file?.type === 'application/pdf'

  const run = async () => {
    setLoading(true)
    setResult(null)
    setProgress('Starting OCR…')
    try {
      const onProgress = m => {
        if (m.status === 'recognizing text') {
          setProgress(`Recognizing… ${Math.round((m.progress || 0) * 100)}%`)
        } else {
          setProgress(m.status)
        }
      }
      const blob = isPDF
        ? await ocrPDF(file, onProgress)
        : await ocrImage(file, onProgress)
      setResult(blob)
      setProgress('Done!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone
            accept="application/pdf,image/png,image/jpeg,image/jpg"
            onFiles={f => { setFile(f[0]); setResult(null); setProgress('') }}
            label="Drop a PDF or image to extract text via OCR"
          />
        : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); setProgress('') }} className="btn-ghost p-1.5 text-red-400">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )
      }

      {loading && (
        <div className="bg-indigo-950/40 border border-indigo-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <DocumentMagnifyingGlassIcon className="w-5 h-5 text-indigo-400 shrink-0 animate-pulse" />
          <p className="text-sm text-indigo-300 capitalize">{progress}</p>
        </div>
      )}

      {result && (
        <button className="btn-primary w-full" onClick={() => downloadBlob(result, file.name.replace(/\.[^.]+$/, '_ocr.txt'))}>
          Download Extracted Text
        </button>
      )}

      {!result && (
        <button className="btn-primary w-full" disabled={!file || loading} onClick={run}>
          {loading ? 'Running OCR…' : 'Extract Text with OCR'}
        </button>
      )}

      <p className="text-xs text-gray-500 text-center">OCR runs entirely in your browser using Tesseract. Large PDFs may take a moment.</p>
    </div>
  )
}
