import { PanelLeftOpen } from "lucide-react"
import type { Message, Character } from "../../App"
import ToggleSidebar from "../layout/ToggleSidebar"

interface MessageListProps {
  messages: Message[]
  currentCharacter: Character | null
}

const MessageList = ({ messages, currentCharacter }: MessageListProps) => {

  return (
    <div className="chat-container relative flex-1 overflow-y-auto flex bg-cyan-900/40">

      {
        !currentCharacter && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-cyan-900/40 text-6xl mb-4">💬</div>
            <p className="text-cyan-900/60 text-sm">Selecciona un personaje para comenzar a chatear</p>
          </div>
        )
      }

      {currentCharacter && messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-cyan-900/40 text-4xl mb-4">👋</div>
            <p className="text-cyan-900/60 text-sm">¡Inicia una conversación con {currentCharacter.name}!</p>
          </div>
        </div>
      )}

      {
        currentCharacter && messages.length > 0 && (
          <div className="flex-1 overflow-y-auto px-10 pt-6 pb-10 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`msg-bubble-${message.sender} max-w-xs lg:max-w-md px-4 py-2 rounded-lg`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-cyan-700' : 'text-gray-400'
                    }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      }



      <ToggleSidebar
        id="toggle-open-sidebar"
        customClasses="block md:hidden left-0 top-1/2 -translate-y-1/2 z-10 bg-cyan-950"
        icon={<PanelLeftOpen className="text-cyan-600 w-5 h-5 cursor-pointer" />}
      />
    </div>
  )
}

export default MessageList 