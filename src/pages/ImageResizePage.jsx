import { useState, useEffect } from 'react'
import Dropzone from '../components/Dropzone'
import { resizeImage, PRESETS } from '../tools/imageResize'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon, CheckCircleIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline'

const FORMATS = [
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'WebP', value: 'image/webp', ext: 'webp' },
]

const CATEGORIES = [
  { label: 'Standard', presets: ['HD', 'Full HD', '4K'] },
  { label: 'Instagram', presets: ['Instagram Square', 'Instagram Portrait', 'Instagram Story'] },
  { label: 'Facebook', presets: ['Facebook Cover', 'Facebook Post'] },
  { label: 'Twitter / X', presets: ['Twitter/X Post', 'Twitter/X Header'] },
  { label: 'LinkedIn', presets: ['LinkedIn Cover', 'LinkedIn Post'] },
  { label: 'Other', presets: ['YouTube Thumbnail', 'WhatsApp DP', 'A4 (300dpi)', 'Passport Photo'] },
  { label: 'Custom', presets: ['Custom'] },
]

export default function ImageResizePage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 })
  const [selected, setSelected] = useState('Full HD')
  const [custom, setCustom] = useState({ w: '', h: '' })
  const [format, setFormat] = useState(FORMATS[0])
  const [quality, setQuality] = useState(92)
  const [maintainAspect, setMaintainAspect] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    const img = new Image()
    img.onload = () => setOriginalSize({ w: img.width, h: img.height })
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  const preset = PRESETS.find(p => p.label === selected)
  const isCustom = selected === 'Custom'
  const targetW = isCustom ? Number(custom.w) : preset?.width
  const targetH = isCustom ? Number(custom.h) : preset?.height

  const run = async () => {
    if (!targetW || !targetH) return
    setLoading(true)
    setResult(null)
    try {
      const blob = await resizeImage(file, targetW, targetH, format.value, quality / 100, maintainAspect)
      setResult({ blob, size: blob.size })
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    const base = file.name.replace(/\.[^.]+$/, '')
    downloadBlob(result.blob, `${base}_${targetW}x${targetH}.${format.ext}`)
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <Dropzone
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onFiles={f => { setFile(f[0]); setResult(null) }}
          label="Drop an image to resize (JPG, PNG, WebP)"
        />
      ) : (
        <div className="flex gap-3 items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
          {preview && <img src={preview} className="w-12 h-12 object-cover rounded-lg" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatBytes(file.size)} · {originalSize.w}×{originalSize.h}px</p>
          </div>
          <button onClick={() => { setFile(null); setPreview(null); setResult(null) }} className="btn-ghost p-1.5 text-red-400">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preset Picker */}
      <div className="space-y-3">
        <p className="text-sm text-gray-400 font-medium">Choose a size</p>
        {CATEGORIES.map(cat => (
          <div key={cat.label}>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1.5">{cat.label}</p>
            <div className="flex flex-wrap gap-2">
              {cat.presets.map(name => {
                const p = PRESETS.find(x => x.label === name)
                return (
                  <button key={name} onClick={() => setSelected(name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selected === name ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-indigo-500'}`}>
                    {name}
                    {p?.width && <span className="ml-1 text-gray-400 font-normal">{p.width}×{p.height}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom dimensions */}
      {isCustom && (
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Width (px)</label>
            <input type="number" min={1} value={custom.w} onChange={e => setCustom(c => ({ ...c, w: e.target.value }))}
              placeholder="e.g. 800"
              className="w-28 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <span className="text-gray-500 mt-5">×</span>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Height (px)</label>
            <input type="number" min={1} value={custom.h} onChange={e => setCustom(c => ({ ...c, h: e.target.value }))}
              placeholder="e.g. 600"
              className="w-28 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
        </div>
      )}

      {/* Options row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Format */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium">Output Format</label>
          <div className="flex gap-2">
            {FORMATS.map(f => (
              <button key={f.value} onClick={() => setFormat(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${format.value === f.value ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-indigo-500'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Maintain aspect ratio */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium">Aspect Ratio</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={maintainAspect} onChange={e => setMaintainAspect(e.target.checked)}
              className="w-4 h-4 accent-indigo-500" />
            <span className="text-sm text-gray-300">Maintain aspect ratio</span>
          </label>
        </div>
      </div>

      {/* Quality slider (JPG/WebP only) */}
      {format.value !== 'image/png' && (
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-medium flex justify-between">
            <span>Quality</span>
            <span className="text-indigo-400">{quality}%</span>
          </label>
          <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))}
            className="w-full accent-indigo-500" />
          <div className="flex justify-between text-xs text-gray-600">
            <span>Smaller file</span>
            <span>Best quality</span>
          </div>
        </div>
      )}

      {/* Result info */}
      {result && (
        <div className="bg-green-950/40 border border-green-800 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
            <div>
              <p className="text-sm text-green-300 font-medium">Resized to {targetW}×{targetH}px</p>
              <p className="text-xs text-green-600">{formatBytes(result.size)} · {format.label}</p>
            </div>
          </div>
          <button onClick={download} className="btn-primary text-sm py-2 px-4">Download</button>
        </div>
      )}

      {!result && (
        <button className="btn-primary w-full flex items-center justify-center gap-2"
          disabled={!file || (!targetW || !targetH) || loading} onClick={run}>
          <ArrowsPointingOutIcon className="w-4 h-4" />
          {loading ? 'Resizing…' : `Resize to ${targetW && targetH ? `${targetW}×${targetH}` : '…'}`}
        </button>
      )}
    </div>
  )
}
