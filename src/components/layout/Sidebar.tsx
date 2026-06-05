import { NavLink, useNavigate } from 'react-router-dom'
import { MessageSquare, FileText, LogOut, Plus, Bot } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useChatStore } from '../../store/chatStore'
import { chatService } from '../../services/chatService'
import { useEffect, useState } from 'react'
import { Conversation } from '../../types'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { conversations, setConversations, setActiveConversation, reset } = useChatStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const page = await chatService.getConversations(0, 30)
      setConversations(page.content)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    reset()
    navigate('/chat')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await chatService.deleteConversation(id)
      setConversations(conversations.filter(c => c.id !== id))
      toast.success('Conversation deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Bot className="w-7 h-7 text-blue-400" />
          <span className="font-bold text-lg text-white">RAG System</span>
        </div>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 pb-2 space-y-1">
        <NavLink to="/chat" className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
          <MessageSquare className="w-4 h-4" /> Chat
        </NavLink>
        <NavLink to="/documents" className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
          <FileText className="w-4 h-4" /> Documents
        </NavLink>
      </nav>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider px-2 py-2">Recent Chats</p>
        {loading ? (
          <div className="text-slate-500 text-xs px-2">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-slate-500 text-xs px-2">No conversations yet</div>
        ) : (
          conversations.map(conv => (
            <div key={conv.id} className="group relative">
              <NavLink to={`/chat/${conv.id}`}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm transition-colors truncate ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}>
                <div className="truncate">{conv.title || 'New conversation'}</div>
                <div className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                </div>
              </NavLink>
              <button
                onClick={e => handleDeleteConversation(e, conv.id)}
                className="absolute right-2 top-2 hidden group-hover:flex items-center justify-center w-5 h-5 rounded text-slate-500 hover:text-red-400">
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* User */}
      <div className="p-3 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="truncate">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
