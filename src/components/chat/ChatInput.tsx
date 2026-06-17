import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface Props { onSend: (msg: string) => void; disabled?: boolean }

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  return (
    <div className="border-t border-slate-700 p-3 md:p-4 bg-slate-800">
      <div className="flex items-end gap-2 md:gap-3 bg-slate-700 rounded-xl px-3.5 py-2.5 md:px-4 md:py-3 border border-slate-600 focus-within:border-blue-500 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask anything about your documents..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm resize-none outline-none max-h-36 md:max-h-48 disabled:opacity-50"
        />
        <button onClick={handleSend} disabled={disabled || !value.trim()}
          className="flex-shrink-0 w-8.5 h-8.5 md:w-9 md:h-9 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
          {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </div>
      <p className="hidden sm:block text-[11px] text-slate-500 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
