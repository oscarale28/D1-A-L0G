import type { Character } from "@/lib/types"

interface ChatHeaderProps {
  character: Character | null
}

const ChatHeader = ({ character }: ChatHeaderProps) => {
  if (!character) {
    return null
  }

  return (
    <div className="flex items-center gap-x-3 p-4 pt-8 bg-cyan-900/20 border-b border-cyan-900/30">
      <div className="relative">
        <img
          src={character.imageUrl}
          alt={character.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-x-2">
          <h2 className="text-lg font-bold text-cyan-500">{character.name}</h2>
        </div>
        <div className="flex items-center gap-x-1">
          {/**<div
            className={`w-2 h-2 ${character.status === 'online'
              ? 'bg-green-400'
              : 'bg-yellow-400'
              }`}
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          ></div>
          <span className={`text-xs ${character.status === 'online'
            ? ' text-green-400'
            : 'text-yellow-400'
            }`}>
            {character.status}
          </span>**/}
        </div>
      </div>
    </div>
  )
}

export default ChatHeader 