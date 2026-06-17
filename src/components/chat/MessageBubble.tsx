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
    <div className={`flex gap-2 md:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-slate-600'} shadow-sm`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[85%] md:max-w-[75%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl shadow-sm ${isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-700 text-slate-100 rounded-tl-sm'}`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none leading-relaxed break-words">
              <ReactMarkdown>{content}</ReactMarkdown>
              {isStreaming && <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1 align-middle" />}
            </div>
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="w-full px-1">
            <SourcesPanel sources={message.sources} />
          </div>
        )}
        <span className="text-[10px] text-slate-500 px-1">
          {formatDistanceToNow(new Date(message.createdAt || Date.now()), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}
