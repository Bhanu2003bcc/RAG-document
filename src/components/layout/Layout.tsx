import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export interface LayoutContextType {
  toggleSidebar: () => void
}

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden relative">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden transition-all duration-300 animate-fade-in"
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 overflow-hidden flex flex-col w-full min-w-0">
        <Outlet context={{ toggleSidebar }} />
      </main>
    </div>
  )
}
