import api from './api'
import { Conversation, ApiResponse, PageResponse } from '../types'
import { useAuthStore } from '../store/authStore'

export const chatService = {
  chat: async (message: string, conversationId?: string) => {
    const { data } = await api.post('/chat', { message, conversationId, stream: false })
    return data.data
  },
  getConversations: async (page = 0, size = 20) => {
    const { data } = await api.get<ApiResponse<PageResponse<Conversation>>>(`/chat/conversations?page=${page}&size=${size}`)
    return data.data
  },
  getConversation: async (id: string) => {
    const { data } = await api.get<ApiResponse<Conversation>>(`/chat/conversations/${id}`)
    return data.data
  },
  deleteConversation: async (id: string) => {
    await api.delete(`/chat/conversations/${id}`)
  },
  createStream: (message: string, conversationId?: string) => {
    const token = useAuthStore.getState().token
    const baseURL = import.meta.env.VITE_API_URL || '/api'
    return fetch(`${baseURL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message, conversationId, stream: true, maxResults: 5 }),
    })
  }
}
