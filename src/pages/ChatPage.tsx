import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Bot, MessageSquare } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { chatService } from '../services/chatService'
import { Message, SourceReference } from '../types'
import MessageBubble from '../components/chat/MessageBubble'
import ChatInput from '../components/chat/ChatInput'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const bottomRef = useRef<HTMLDivElement>(null)
  const {
    messages, setMessages, addMessage, appendStreamChunk, streamingContent,
    isStreaming, setStreaming, setSources, sources, activeConversationId, setActiveConversation
  } = useChatStore()

  useEffect(() => {
    if (conversationId && conversationId !== activeConversationId) {
      loadConversation(conversationId)
    } else if (!conversationId) {
      setMessages([])
      setActiveConversation(null)
    }
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const loadConversation = async (id: string) => {
    try {
      const conv = await chatService.getConversation(id)
      setActiveConversation(id)
      const msgs: Message[] = (conv.messages || []).map(m => ({
        ...m,
        sources: m.sources ? (typeof m.sources === 'string' ? JSON.parse(m.sources) : m.sources) : []
      }))
      setMessages(msgs)
    } catch {
      toast.error('Failed to load conversation')
      navigate('/chat')
    }
  }

  const handleSend = async (text: string) => {
    if (isStreaming) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    addMessage(userMsg)
    setStreaming(true)
    setSources([])

    const placeholderMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      streaming: true,
    }
    addMessage(placeholderMsg)

    try {
      const response = await chatService.createStream(text, conversationId || activeConversationId || undefined)
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let finalConvId = conversationId || activeConversationId
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        const lines = text.split('\n')

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim()
            try {
              const parsed = JSON.parse(data)
              if (Array.isArray(parsed)) {
                setSources(parsed as SourceReference[])
              } else if (parsed.conversationId) {
                finalConvId = parsed.conversationId
                if (!conversationId) navigate(`/chat/${finalConvId}`, { replace: true })
              }
            } catch { /* not JSON */ }
          } else if (line.startsWith('event:chunk')) {
            // handled in next iteration
          } else if (line.startsWith('data:') === false && line.trim() && !line.startsWith('event:')) {
            fullContent += line
            appendStreamChunk(line)
          }
        }

        // Better SSE parsing
        const events = text.split('\n\n')
        for (const event of events) {
          if (!event.trim()) continue
          const eventLines = event.split('\n')
          let eventName = ''
          let eventData = ''
          for (const el of eventLines) {
            if (el.startsWith('event:')) eventName = el.slice(6).trim()
            if (el.startsWith('data:')) eventData = el.slice(5).trim()
          }
          if (eventName === 'chunk' && eventData) {
            appendStreamChunk(eventData)
            fullContent = ''
          } else if (eventName === 'sources' && eventData) {
            try { setSources(JSON.parse(eventData)) } catch { }
          } else if (eventName === 'done' && eventData) {
            try {
              const doneData = JSON.parse(eventData)
              if (doneData.conversationId && !conversationId) {
                navigate(`/chat/${doneData.conversationId}`, { replace: true })
                setActiveConversation(doneData.conversationId)
              }
            } catch { }
          }
        }
      }

      // Finalize the streaming message
      useChatStore.getState().updateLastMessage(useChatStore.getState().streamingContent || fullContent)

    } catch (e) {
      toast.error('Failed to get response')
      useChatStore.getState().updateLastMessage('Sorry, an error occurred. Please try again.')
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800">
        <h1 className="font-semibold text-white">
          {conversationId ? 'Conversation' : 'New Chat'}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Ask about your documents</h2>
              <p className="text-slate-400 mt-1 text-sm">Upload documents and ask questions — I'll find the answers.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-lg mt-4">
              {['Summarize my latest document', 'What are the key findings?', 'Compare documents A and B', 'Find all mentions of...'].map(hint => (
                <button key={hint} onClick={() => handleSend(hint)}
                  className="text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300 transition-colors">
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={{...msg, sources: msg.sources || (i === messages.length - 1 && msg.role === 'assistant' ? sources : [])}}
              isStreaming={msg.streaming && isStreaming}
              streamingContent={streamingContent}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  )
}
