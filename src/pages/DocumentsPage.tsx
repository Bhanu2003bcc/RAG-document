import { useEffect, useState } from 'react'
import { FileText, RefreshCw, Menu } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { LayoutContextType } from '../components/layout/Layout'
import { Document } from '../types'
import { documentService } from '../services/documentService'
import DocumentCard from '../components/document/DocumentCard'
import UploadZone from '../components/document/UploadZone'
import toast from 'react-hot-toast'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const { toggleSidebar } = useOutletContext<LayoutContextType>()

  useEffect(() => { loadDocuments() }, [])

  // Auto-refresh if any docs are processing
  useEffect(() => {
    const hasProcessing = documents.some(d => d.status === 'PROCESSING' || d.status === 'PENDING')
    if (!hasProcessing) return
    const timer = setInterval(loadDocuments, 3000)
    return () => clearInterval(timer)
  }, [documents])

  const loadDocuments = async () => {
    try {
      const page = await documentService.getDocuments(0, 50)
      setDocuments(page.content)
      setTotal(page.totalElements)
    } catch {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document? All associated data will be removed.')) return
    try {
      await documentService.deleteDocument(id)
      setDocuments(d => d.filter(doc => doc.id !== id))
      toast.success('Document deleted')
    } catch {
      toast.error('Failed to delete document')
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-700 bg-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={toggleSidebar}
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
            aria-label="Open sidebar">
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-semibold text-white truncate">Documents</h1>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{total} document{total !== 1 ? 's' : ''} total</p>
          </div>
        </div>
        <button onClick={loadDocuments}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          title="Refresh documents">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
        <UploadZone onUploaded={loadDocuments} />

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 animate-pulse h-24" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No documents yet</p>
            <p className="text-slate-600 text-sm mt-1">Upload your first document above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
