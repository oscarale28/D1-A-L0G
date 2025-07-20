import { Send } from 'lucide-react'
import { useState } from 'react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="message-input relative border-t border-cyan-900/30 bg-cyan-950 p-4">
      <form onSubmit={handleSubmit} className="flex gap-x-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Selecciona un chat para escribir..." : "Escribe tu mensaje..."}
            disabled={disabled}
            className="w-full px-4 py-3 bg-black/50 border border-cyan-900 rounded-lg text-cyan-100 placeholder-cyan-900/50 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-900/50 focus:border-cyan-900 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px', clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="message-submit px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-900 text-cyan-900 border border-cyan-900/30 rounded-lg hover:bg-cyan-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5 text-cyan-400" />
        </button>
      </form>
    </div>
  )
}

export default MessageInput 