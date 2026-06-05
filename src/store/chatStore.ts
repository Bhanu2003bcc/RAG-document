import { create } from 'zustand'
import { Conversation, Message, SourceReference } from '../types'

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Message[]
  isStreaming: boolean
  streamingContent: string
  sources: SourceReference[]
  setConversations: (convs: Conversation[]) => void
  setActiveConversation: (id: string | null) => void
  setMessages: (msgs: Message[]) => void
  addMessage: (msg: Message) => void
  updateLastMessage: (content: string) => void
  setStreaming: (v: boolean) => void
  appendStreamChunk: (chunk: string) => void
  setSources: (sources: SourceReference[]) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isStreaming: false,
  streamingContent: '',
  sources: [],
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set(s => ({ messages: [...s.messages, msg] })),
  updateLastMessage: (content) => set(s => {
    const msgs = [...s.messages]
    if (msgs.length > 0) msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content, streaming: false }
    return { messages: msgs, streamingContent: '' }
  }),
  setStreaming: (isStreaming) => set({ isStreaming, streamingContent: isStreaming ? '' : '' }),
  appendStreamChunk: (chunk) => set(s => ({ streamingContent: s.streamingContent + chunk })),
  setSources: (sources) => set({ sources }),
  reset: () => set({ messages: [], activeConversationId: null, sources: [], streamingContent: '', isStreaming: false }),
}))
