import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { pdfToImages } from '../tools/pdfToImage'
import { downloadDataUrl, formatBytes } from '../tools/utils'
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function PdfToJpgPage() {
  const [file, setFile] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setImages([])
    try {
      const imgs = await pdfToImages(file, 2)
      // Convert PNG dataUrls to JPEG
      const jpgs = imgs.map((img, i) => {
        const canvas = document.createElement('canvas')
        const image = new Image()
        image.src = img.dataUrl
        canvas.width = image.width || 800
        canvas.height = image.height || 1000
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0)
        return { dataUrl: canvas.toDataURL('image/jpeg', 0.92), name: `page_${i + 1}.jpg` }
      })
      setImages(jpgs)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept="application/pdf" onFiles={f => { setFile(f[0]); setImages([]) }} label="Drop a PDF to convert to JPG" />
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
        {loading ? 'Converting…' : 'Convert to JPG'}
      </button>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <img src={img.dataUrl} alt={`Page ${i + 1}`} className="w-full" />
              <div className="p-3 flex justify-between items-center">
                <span className="text-xs text-gray-400">Page {i + 1}</span>
                <button onClick={() => downloadDataUrl(img.dataUrl, img.name)} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3">
                  <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Save JPG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
