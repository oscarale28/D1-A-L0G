import { useSidebar } from "@/lib/providers/SidebarProvider"
import type { Character } from "@/lib/types"
import type { Timestamp } from "firebase/firestore"

interface ChatCardProps {
  character: Character
  isSelected?: boolean
  lastMessage?: { text: string; timestamp: Timestamp; senderId: string; id: string } | undefined
  onClick?: () => void
}

const ChatCard = (props: ChatCardProps) => {

  const { character, isSelected, lastMessage, onClick } = props

  const { toggleSidebar } = useSidebar()
  const handleClick = () => {
    toggleSidebar()
    onClick?.()
  }

  return (
    <button
      className={`group chat-card z-100 relative text-left border-cyan-900 border-b-2 p-4 flex items-center gap-x-3 cursor-pointer hover:bg-cyan-900/40 hover:border-transparent transition-all duration-300 ${isSelected ? 'bg-cyan-900/40 border-transparent' : ''
        }`}
      onClick={handleClick}
    >
      <div className="w-12 h-12 aspect-square rounded-full">
        <img src={character.imageUrl} alt={character.name} className="w-full h-full rounded-full object-cover" />
      </div>
      <div className="flex flex-col">
        <p className="text-base mb-0.5 font-bold text-cyan-600">{character.name}</p>
        {lastMessage && (
          <p className="text-sm text-gray-300">
            {lastMessage.text.length > 25 ? `${lastMessage.text.slice(0, 25)}...` : lastMessage.text}
          </p>
        )}
      </div>
      <div
        className={`absolute -bottom-5 right-2 h-12 border-2 border-cyan-900 rotate-45 group-hover:border-transparent group-focus:border-transparent transition-all duration-300 ${isSelected ? 'border-transparent' : ''
          }`}
      ></div>
    </button>
  )
}

export default ChatCard