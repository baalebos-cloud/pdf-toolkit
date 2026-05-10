import { useRef, useState } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'

export default function Dropzone({ accept, multiple = false, onFiles, label }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const handle = files => {
    const arr = Array.from(files).filter(f => {
      if (!accept) return true
      return accept.split(',').some(a => f.type.includes(a.trim().replace('*', '').replace('.', '')))
    })
    if (arr.length) onFiles(arr)
  }

  return (
    <div
      className={`input-file-zone ${dragging ? 'border-indigo-400 bg-indigo-950/20' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files) }}
    >
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden"
        onChange={e => handle(e.target.files)} />
      <ArrowUpTrayIcon className="w-10 h-10 mx-auto mb-3 text-indigo-400" />
      <p className="text-gray-300 font-medium">{label || 'Drop files here or click to browse'}</p>
      <p className="text-gray-500 text-sm mt-1">All processing happens in your browser — files never leave your device</p>
    </div>
  )
}
