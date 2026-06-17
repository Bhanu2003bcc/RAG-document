import { NavLink, useNavigate } from 'react-router-dom'
import { MessageSquare, FileText, LogOut, Plus, Bot, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useChatStore } from '../../store/chatStore'
import { chatService } from '../../services/chatService'
import { useEffect, useState } from 'react'
import { Conversation } from '../../types'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
    onClose()
    navigate('/chat')
  }

  const handleLogout = () => {
    logout()
    onClose()
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
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo & Close Button */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-7 h-7 text-blue-400" />
          <span className="font-bold text-lg text-white">RAG System</span>
        </div>
        <button onClick={onClose}
          className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Close sidebar">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 pb-2 space-y-1">
        <NavLink to="/chat" onClick={onClose} className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
          <MessageSquare className="w-4 h-4" /> Chat
        </NavLink>
        <NavLink to="/documents" onClick={onClose} className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
          <FileText className="w-4 h-4" /> Documents
        </NavLink>
      </nav>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 custom-scrollbar">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-2">Recent Chats</p>
        {loading ? (
          <div className="text-slate-500 text-xs px-2 flex items-center gap-2 py-1">
            <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
            Loading...
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-slate-500 text-xs px-2 py-1">No conversations yet</div>
        ) : (
          <div className="space-y-0.5">
            {conversations.map(conv => (
              <div key={conv.id} className="group relative">
                <NavLink to={`/chat/${conv.id}`} onClick={onClose}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm transition-colors truncate pr-8 ${isActive ? 'bg-slate-700 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-750 hover:text-slate-200'}`}>
                  <div className="truncate">{conv.title || 'New conversation'}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                  </div>
                </NavLink>
                <button
                  onClick={e => handleDeleteConversation(e, conv.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-5 h-5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-600/50 transition-colors"
                  title="Delete chat">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <div className="p-3 border-t border-slate-700 bg-slate-800/50">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700 flex-shrink-0"
            title="Log Out">
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
