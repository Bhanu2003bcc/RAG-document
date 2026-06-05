import ReactMarkdown from 'react-markdown'
import { Bot, User } from 'lucide-react'
import { Message } from '../../types'
import { formatDistanceToNow } from 'date-fns'
import SourcesPanel from './SourcesPanel'

interface Props { message: Message; isStreaming?: boolean; streamingContent?: string }

export default function MessageBubble({ message, isStreaming, streamingContent }: Props) {
  const isUser = message.role === 'user'
  const content = isStreaming ? streamingContent || '' : message.content

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-slate-600'}`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-700 text-slate-100 rounded-tl-sm'}`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
              {isStreaming && <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1" />}
            </div>
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <SourcesPanel sources={message.sources} />
        )}
        <span className="text-xs text-slate-500">
          {formatDistanceToNow(new Date(message.createdAt || Date.now()), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}
