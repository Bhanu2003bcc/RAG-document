import { FileText, Trash2, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Document } from '../../types'
import { formatDistanceToNow } from 'date-fns'

interface Props { doc: Document; onDelete: (id: string) => void }

const STATUS_STYLES = {
  COMPLETED: 'text-green-400',
  PROCESSING: 'text-yellow-400',
  PENDING: 'text-slate-400',
  FAILED: 'text-red-400',
}

const StatusIcon = ({ status }: { status: Document['status'] }) => {
  switch (status) {
    case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-400" />
    case 'PROCESSING': return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
    case 'PENDING': return <Clock className="w-4 h-4 text-slate-400" />
    case 'FAILED': return <AlertCircle className="w-4 h-4 text-red-400" />
  }
}

export default function DocumentCard({ doc, onDelete }: Props) {
  const sizeStr = doc.fileSize > 1024 * 1024
    ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB`
    : `${(doc.fileSize / 1024).toFixed(0)} KB`

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start gap-4 hover:border-slate-600 transition-all">
      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">{doc.title}</h3>
        <p className="text-xs text-slate-500 truncate">{doc.fileName}</p>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <StatusIcon status={doc.status} />
            <span className={STATUS_STYLES[doc.status]}>{doc.status}</span>
          </span>
          {doc.chunkCount > 0 && <span className="text-slate-500">{doc.chunkCount} chunks</span>}
          <span className="text-slate-500">{sizeStr}</span>
          <span className="text-slate-600">{doc.language?.toUpperCase()}</span>
        </div>
        {doc.errorMessage && (
          <p className="text-xs text-red-400 mt-1 truncate">{doc.errorMessage}</p>
        )}
        <p className="text-xs text-slate-600 mt-1">
          {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
        </p>
      </div>
      <button onClick={() => onDelete(doc.id)}
        className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
