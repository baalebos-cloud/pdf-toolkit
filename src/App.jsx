import { lazy, Suspense, useState } from 'react'
import {
  DocumentDuplicateIcon, ScissorsIcon, ArrowPathIcon, ArrowsPointingInIcon,
  PencilSquareIcon, PhotoIcon, DocumentArrowUpIcon, XMarkIcon, LockClosedIcon,
  BoltIcon, GlobeAltIcon, TrashIcon, Bars3BottomLeftIcon, PlusCircleIcon,
  DocumentTextIcon, TagIcon, HashtagIcon, EyeSlashIcon, KeyIcon, LockOpenIcon,
  DocumentMagnifyingGlassIcon, SwatchIcon, AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon, CodeBracketIcon, DocumentChartBarIcon,
  TableCellsIcon, MagnifyingGlassIcon, ClipboardDocumentListIcon, PencilIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'

const MergePage = lazy(() => import('./pages/MergePage'))
const SplitPage = lazy(() => import('./pages/SplitPage'))
const RotatePage = lazy(() => import('./pages/RotatePage'))
const CompressPage = lazy(() => import('./pages/CompressPage'))
const WatermarkPage = lazy(() => import('./pages/WatermarkPage'))
const PdfToImagePage = lazy(() => import('./pages/PdfToImagePage'))
const ImageToPdfPage = lazy(() => import('./pages/ImageToPdfPage'))
const DeletePagesPage = lazy(() => import('./pages/DeletePagesPage'))
const ReorderPagesPage = lazy(() => import('./pages/ReorderPagesPage'))
const InsertPagePage = lazy(() => import('./pages/InsertPagePage'))
const EditMetadataPage = lazy(() => import('./pages/EditMetadataPage'))
const RemoveMetadataPage = lazy(() => import('./pages/RemoveMetadataPage'))
const PageNumbersPage = lazy(() => import('./pages/PageNumbersPage'))
const FlattenPage = lazy(() => import('./pages/FlattenPage'))
const GrayscalePage = lazy(() => import('./pages/GrayscalePage'))
const UnlockPage = lazy(() => import('./pages/UnlockPage'))
const ProtectPage = lazy(() => import('./pages/ProtectPage'))
const PdfToTextPage = lazy(() => import('./pages/PdfToTextPage'))
const PdfToMarkdownPage = lazy(() => import('./pages/PdfToMarkdownPage'))
const TxtToPdfPage = lazy(() => import('./pages/TxtToPdfPage'))
const SvgToPdfPage = lazy(() => import('./pages/SvgToPdfPage'))
const PdfToJpgPage = lazy(() => import('./pages/PdfToJpgPage'))
const WordToPdfPage = lazy(() => import('./pages/WordToPdfPage'))
const ExcelToPdfPage = lazy(() => import('./pages/ExcelToPdfPage'))
const OcrPage = lazy(() => import('./pages/OcrPage'))
const FormFillerPage = lazy(() => import('./pages/FormFillerPage'))
const SignaturePage = lazy(() => import('./pages/SignaturePage'))
const ImageResizePage = lazy(() => import('./pages/ImageResizePage'))

const CATEGORIES = [
  {
    label: 'Organize',
    tools: [
      { id: 'merge', label: 'Merge PDF', description: 'Combine multiple PDFs into one', icon: DocumentDuplicateIcon, color: 'text-indigo-400', bg: 'bg-indigo-950/40', border: 'border-indigo-900', component: MergePage },
      { id: 'split', label: 'Split PDF', description: 'Extract pages or ranges into separate files', icon: ScissorsIcon, color: 'text-pink-400', bg: 'bg-pink-950/40', border: 'border-pink-900', component: SplitPage },
      { id: 'rotate', label: 'Rotate PDF', description: 'Rotate all pages by 90°, 180° or 270°', icon: ArrowPathIcon, color: 'text-yellow-400', bg: 'bg-yellow-950/40', border: 'border-yellow-900', component: RotatePage },
      { id: 'delete-pages', label: 'Delete Pages', description: 'Remove specific pages from a PDF', icon: TrashIcon, color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-900', component: DeletePagesPage },
      { id: 'reorder', label: 'Reorder Pages', description: 'Rearrange pages in any order', icon: Bars3BottomLeftIcon, color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-900', component: ReorderPagesPage },
      { id: 'insert-page', label: 'Insert Blank Page', description: 'Add a blank page at any position', icon: PlusCircleIcon, color: 'text-teal-400', bg: 'bg-teal-950/40', border: 'border-teal-900', component: InsertPagePage },
    ],
  },
  {
    label: 'Optimize',
    tools: [
      { id: 'compress', label: 'Compress PDF', description: 'Reduce file size without losing quality', icon: ArrowsPointingInIcon, color: 'text-green-400', bg: 'bg-green-950/40', border: 'border-green-900', component: CompressPage },
      { id: 'flatten', label: 'Flatten PDF', description: 'Remove form fields and annotations', icon: AdjustmentsHorizontalIcon, color: 'text-lime-400', bg: 'bg-lime-950/40', border: 'border-lime-900', component: FlattenPage },
      { id: 'grayscale', label: 'Grayscale PDF', description: 'Convert all pages to black & white', icon: SwatchIcon, color: 'text-slate-400', bg: 'bg-slate-800/40', border: 'border-slate-700', component: GrayscalePage },
    ],
  },
  {
    label: 'Security',
    tools: [
      { id: 'watermark', label: 'Watermark PDF', description: 'Stamp custom text on every page', icon: PencilSquareIcon, color: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-900', component: WatermarkPage },
      { id: 'protect', label: 'Protect PDF', description: 'Add password protection to a PDF', icon: LockClosedIcon, color: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-900', component: ProtectPage },
      { id: 'unlock', label: 'Unlock PDF', description: 'Remove restrictions from a PDF', icon: LockOpenIcon, color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-900', component: UnlockPage },
    ],
  },
  {
    label: 'Edit',
    tools: [
      { id: 'edit-metadata', label: 'Edit Metadata', description: 'Change title, author, subject & keywords', icon: TagIcon, color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-900', component: EditMetadataPage },
      { id: 'remove-metadata', label: 'Remove Metadata', description: 'Strip all metadata from a PDF', icon: EyeSlashIcon, color: 'text-gray-400', bg: 'bg-gray-800/40', border: 'border-gray-700', component: RemoveMetadataPage },
      { id: 'page-numbers', label: 'Add Page Numbers', description: 'Stamp page numbers on every page', icon: HashtagIcon, color: 'text-violet-400', bg: 'bg-violet-950/40', border: 'border-violet-900', component: PageNumbersPage },
    ],
  },
  {
    label: 'Convert to PDF',
    tools: [
      { id: 'image-to-pdf', label: 'Image → PDF', description: 'Pack PNG/JPG images into a PDF', icon: DocumentArrowUpIcon, color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-900', component: ImageToPdfPage },
      { id: 'txt-to-pdf', label: 'TXT → PDF', description: 'Convert plain text files to PDF', icon: DocumentTextIcon, color: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-900', component: TxtToPdfPage },
      { id: 'svg-to-pdf', label: 'SVG → PDF', description: 'Convert SVG vector files to PDF', icon: CodeBracketIcon, color: 'text-fuchsia-400', bg: 'bg-fuchsia-950/40', border: 'border-fuchsia-900', component: SvgToPdfPage },
      { id: 'word-to-pdf', label: 'Word → PDF', description: 'Convert .docx Word documents to PDF', icon: DocumentTextIcon, color: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-900', component: WordToPdfPage },
      { id: 'excel-to-pdf', label: 'Excel → PDF', description: 'Convert .xlsx spreadsheets to PDF', icon: TableCellsIcon, color: 'text-green-400', bg: 'bg-green-950/40', border: 'border-green-900', component: ExcelToPdfPage },
    ],
  },
  {
    label: 'Convert from PDF',
    tools: [
      { id: 'pdf-to-png', label: 'PDF → PNG', description: 'Convert each PDF page to a PNG image', icon: PhotoIcon, color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-900', component: PdfToImagePage },
      { id: 'pdf-to-jpg', label: 'PDF → JPG', description: 'Convert each PDF page to a JPG image', icon: PhotoIcon, color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-900', component: PdfToJpgPage },
      { id: 'pdf-to-text', label: 'PDF → Text', description: 'Extract all text content from a PDF', icon: DocumentTextIcon, color: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-900', component: PdfToTextPage },
      { id: 'pdf-to-markdown', label: 'PDF → Markdown', description: 'Convert PDF content to Markdown format', icon: DocumentChartBarIcon, color: 'text-lime-400', bg: 'bg-lime-950/40', border: 'border-lime-900', component: PdfToMarkdownPage },
    ],
  },
  {
    label: 'Image Tools',
    tools: [
      { id: 'image-resize', label: 'Resize Image', description: 'Resize to HD, 4K, social media sizes or custom', icon: ArrowsPointingOutIcon, color: 'text-pink-400', bg: 'bg-pink-950/40', border: 'border-pink-900', component: ImageResizePage },
    ],
  },
  {
    label: 'Advanced',
    tools: [
      { id: 'ocr', label: 'OCR PDF', description: 'Extract text from scanned PDFs and images', icon: MagnifyingGlassIcon, color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-900', component: OcrPage },
      { id: 'form-filler', label: 'Form Filler', description: 'Detect and fill PDF form fields', icon: ClipboardDocumentListIcon, color: 'text-teal-400', bg: 'bg-teal-950/40', border: 'border-teal-900', component: FormFillerPage },
      { id: 'sign', label: 'Sign PDF', description: 'Draw or type a signature onto a PDF', icon: PencilIcon, color: 'text-violet-400', bg: 'bg-violet-950/40', border: 'border-violet-900', component: SignaturePage },
    ],
  },
]

const ALL_TOOLS = CATEGORIES.flatMap(c => c.tools)

const FEATURES = [
  { icon: LockClosedIcon, title: 'Privacy First', desc: 'Files never leave your browser. Zero uploads.' },
  { icon: BoltIcon, title: 'Lightning Fast', desc: 'Client-side processing — no server wait times.' },
  { icon: GlobeAltIcon, title: 'Works Offline', desc: 'Once loaded, use it without an internet connection.' },
]

export default function App() {
  const [activeTool, setActiveTool] = useState(null)
  const [search, setSearch] = useState('')

  const tool = ALL_TOOLS.find(t => t.id === activeTool)

  const filtered = search.trim()
    ? ALL_TOOLS.filter(t =>
        t.label.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      )
    : null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <DocumentDuplicateIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Baalebos PDF ToolKit</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#tools" className="hover:text-white transition-colors">Tools</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <span className="inline-block bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
            100% Browser-Based · Free Forever
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Professional PDF Tools,<br />
            <span className="text-indigo-400">Right in Your Browser</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {ALL_TOOLS.length}+ tools to merge, split, compress, convert and edit PDFs — all client-side.
            Your files never touch a server.
          </p>
          <a href="#tools" className="btn-primary inline-block">Get Started — It's Free</a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 px-4 border-y border-gray-800 bg-gray-900/40">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-950 border border-indigo-800 rounded-xl flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{f.title}</p>
                <p className="text-gray-400 text-sm mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="py-16 px-4 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <h2 className="text-2xl font-bold text-white">All Tools</h2>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tools…"
              className="mx-auto block w-full max-w-sm bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {filtered ? (
            filtered.length === 0
              ? <p className="text-center text-gray-500 py-10">No tools match "{search}"</p>
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map(t => <ToolCard key={t.id} tool={t} onClick={() => setActiveTool(t.id)} />)}
                </div>
              )
          ) : (
            <div className="space-y-12">
              {CATEGORIES.map(cat => (
                <div key={cat.label}>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">{cat.label}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cat.tools.map(t => <ToolCard key={t.id} tool={t} onClick={() => setActiveTool(t.id)} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-500 text-sm">
        <p>Baalebos PDF ToolKit — All processing is done locally in your browser. No data is ever uploaded.</p>
      </footer>

      {/* Tool Modal */}
      {tool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setActiveTool(null)}>
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${tool.bg} border ${tool.border} rounded-xl flex items-center justify-center`}>
                  <tool.icon className={`w-4 h-4 ${tool.color}`} />
                </div>
                <h2 className="font-bold text-white">{tool.label}</h2>
              </div>
              <button onClick={() => setActiveTool(null)} className="btn-ghost p-1.5">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <Suspense fallback={<div className="text-center py-10 text-gray-500 text-sm">Loading tool…</div>}>
                <tool.component />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToolCard({ tool: t, onClick }) {
  return (
    <button onClick={onClick} className="tool-card text-left">
      <div className={`w-11 h-11 ${t.bg} border ${t.border} rounded-xl flex items-center justify-center`}>
        <t.icon className={`w-5 h-5 ${t.color}`} />
      </div>
      <div>
        <p className="font-semibold text-white text-sm">{t.label}</p>
        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{t.description}</p>
      </div>
    </button>
  )
}
