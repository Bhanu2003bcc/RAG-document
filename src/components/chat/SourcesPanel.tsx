import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { SourceReference } from '../../types'

export default function SourcesPanel({ sources }: { sources: SourceReference[] }) {
  const [expanded, setExpanded] = useState(false)

  if (!sources?.length) return null

  return (
    <div className="w-full">
      <button onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">
        <FileText className="w-3 h-3" />
        {sources.length} source{sources.length > 1 ? 's' : ''}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {sources.map((s, i) => (
            <div key={i} className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs">
              <p className="font-medium text-blue-400 truncate">{s.documentTitle}</p>
              <p className="text-slate-400 mt-1 line-clamp-2">{s.excerpt}</p>
              <div className="flex justify-between mt-1 text-slate-500">
                <span>Chunk #{s.chunkIndex}</span>
                <span>{Math.round(s.relevanceScore * 100)}% match</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
