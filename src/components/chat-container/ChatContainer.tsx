import { useState } from 'react'
import type { Character, Message } from '../App'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

interface ChatContainerProps {
  currentCharacter: Character | null
}

const ChatContainer = ({ currentCharacter }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = (text: string) => {
    if (!currentCharacter) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setMessages(prev => [...prev, newMessage])

    // Simular respuesta del personaje después de 1 segundo
    setTimeout(() => {
      const characterResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Gracias por tu mensaje: "${text}". Soy ${currentCharacter.name} y estoy aquí para ayudarte.`,
        sender: 'character',
        timestamp: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        characterId: currentCharacter.id
      }
      setMessages(prev => [...prev, characterResponse])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full border-cyan-900 md:border-l-2 overflow-hidden">
      <ChatHeader character={currentCharacter} />
      <MessageList messages={messages} currentCharacter={currentCharacter} />
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!currentCharacter}
      />
    </div>
  )
}

export default ChatContainer