import type { Character } from "@/App"
import { useSidebar } from "@/lib/providers/SidebarProvider"

interface ChatCardProps {
  character: Character
  isSelected?: boolean
  onClick?: () => void
}

const ChatCard = ({ character, isSelected = false, onClick }: ChatCardProps) => {

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
        <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <div className="text-base mb-0.5 font-bold text-cyan-600">{character.name}</div>
        <div className="text-sm text-gray-400">{character.lastMessage}</div>
      </div>
      <div
        className={`absolute -bottom-5 right-2 h-12 border-2 border-cyan-900 rotate-45 group-hover:border-transparent group-focus:border-transparent transition-all duration-300 ${isSelected ? 'border-transparent' : ''
          }`}
      ></div>
    </button>
  )
}

export default ChatCard