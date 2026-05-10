import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { pdfToImages } from '../tools/pdfToImage'
import { downloadDataUrl, formatBytes } from '../tools/utils'
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function PdfToImagePage() {
  const [file, setFile] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setImages([])
    try {
      const imgs = await pdfToImages(file)
      setImages(imgs)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept="application/pdf" onFiles={f => { setFile(f[0]); setImages([]) }} label="Drop a PDF to convert to images" />
        : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setImages([]) }} className="btn-ghost p-1.5 text-red-400"><XMarkIcon className="w-4 h-4" /></button>
          </div>
        )
      }

      <button className="btn-primary w-full" disabled={!file || loading} onClick={run}>
        {loading ? 'Converting…' : 'Convert to PNG Images'}
      </button>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <img src={img.dataUrl} alt={`Page ${i + 1}`} className="w-full" />
              <div className="p-3 flex justify-between items-center">
                <span className="text-xs text-gray-400">Page {i + 1}</span>
                <button onClick={() => downloadDataUrl(img.dataUrl, img.name)} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3">
                  <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
