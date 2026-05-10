import { useState } from 'react'
import Dropzone from '../components/Dropzone'
import { getFormFields, fillFormFields } from '../tools/formFiller'
import { downloadBlob, formatBytes } from '../tools/utils'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function FormFillerPage() {
  const [file, setFile] = useState(null)
  const [fields, setFields] = useState([])
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [done, setDone] = useState(false)

  const loadFile = async f => {
    setFile(f)
    setFields([])
    setValues({})
    setDone(false)
    setDetecting(true)
    try {
      const detected = await getFormFields(f)
      setFields(detected)
    } finally {
      setDetecting(false)
    }
  }

  const setValue = (name, val) => setValues(v => ({ ...v, [name]: val }))

  const run = async () => {
    setLoading(true)
    try {
      const blob = await fillFormFields(file, values)
      downloadBlob(blob, `filled_${file.name}`)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!file
        ? <Dropzone accept="application/pdf" onFiles={f => loadFile(f[0])} label="Drop a PDF form to fill" />
        : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-200">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setFields([]); setValues({}); setDone(false) }} className="btn-ghost p-1.5 text-red-400">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )
      }

      {detecting && <p className="text-sm text-indigo-300 text-center animate-pulse">Detecting form fields…</p>}

      {!detecting && file && fields.length === 0 && (
        <div className="bg-yellow-950/40 border border-yellow-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300">No fillable form fields detected in this PDF.</p>
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400 font-medium">{fields.length} field{fields.length !== 1 ? 's' : ''} detected</p>
          {fields.map(f => (
            <div key={f.name} className="space-y-1">
              <label className="text-xs text-gray-400 font-medium flex items-center gap-2">
                {f.name}
                <span className="text-gray-600 font-normal">({f.type})</span>
              </label>
              {f.type === 'CheckBox'
                ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!values[f.name]}
                      onChange={e => setValue(f.name, e.target.checked)}
                      className="w-4 h-4 accent-indigo-500" />
                    <span className="text-sm text-gray-300">Check this field</span>
                  </label>
                )
                : (
                  <input value={values[f.name] || ''} onChange={e => setValue(f.name, e.target.value)}
                    placeholder={`Enter ${f.name}…`}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                )
              }
            </div>
          ))}
        </div>
      )}

      {done && (
        <div className="bg-green-950/40 border border-green-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">Form filled and downloaded successfully.</p>
        </div>
      )}

      <button className="btn-primary w-full" disabled={!file || fields.length === 0 || loading} onClick={run}>
        {loading ? 'Filling Form…' : 'Fill & Download PDF'}
      </button>
    </div>
  )
}
