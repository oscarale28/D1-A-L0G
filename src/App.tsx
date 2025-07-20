import { useState } from 'react'
import StatusBar from './components/layout/StatusBar'
import ChatContainer from './components/chat-container/ChatContainer'
import { SidebarProvider } from './lib/providers/SidebarProvider'
import Backdrop from './components/layout/Backdrop'
import ChatsList from './components/chats-list/ChatsList'

export type Character = {
  id: string
  name: string
  color: string
  status: string
  lastMessage: string
  timestamp: string
  image: string
}

export type Message = {
  id: string
  text: string
  sender: 'user' | 'character'
  timestamp: string
  characterId?: string
}

export type Chat = {
  characterId: string
  messages: Message[]
}

const characters: Character[] = [
  {
    id: "yoda",
    name: "Master Yoda",
    color: "green",
    status: "online",
    lastMessage: "Do or do not, there is no try.",
    timestamp: "2 min ago",
    image: "/public/yoda.jpg",
  },
  {
    id: "vader",
    name: "Darth Vader",
    color: "red",
    status: "online",
    lastMessage: "I find your lack of faith disturbing.",
    timestamp: "5 min ago",
    image: "/public/vader.jpg",
  },
  {
    id: "c3po",
    name: "C-3PO",
    color: "yellow",
    status: "online",
    lastMessage: "Oh, my goodness!",
    timestamp: "1 hour ago",
    image: "/public/c3po.jpg",
  },
  {
    id: "r2d2",
    name: "R2-D2",
    color: "blue",
    status: "away",
    lastMessage: "Bibibi!!!",
    timestamp: "3 hours ago",
    image: "/public/r2d2.jpg",
  }
]

function App() {
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null)

  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 crt-container">
        <Backdrop />
        <StatusBar />
        <main className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr] overflow-hidden">
          <ChatsList
            characters={characters}
            onCharacterSelect={setCurrentCharacter}
            currentCharacter={currentCharacter}
          />
          <ChatContainer currentCharacter={currentCharacter} />
        </main>
      </div>
    </SidebarProvider >
  )
}

export default App
