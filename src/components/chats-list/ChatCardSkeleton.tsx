const ChatCardSkeleton = () => {
  return (
    <div className="chat-card-skeleton relative text-left border-cyan-900 border-b-2 p-4 flex items-center gap-x-3 animate-pulse">
      <div className="w-12 h-12 aspect-square rounded-full bg-cyan-900/30"></div>
      <div className="flex flex-col flex-1">
        <div className="h-4 bg-cyan-900/30 rounded mb-1 w-24"></div>
        <div className="h-3 bg-gray-700/30 rounded w-32"></div>
      </div>
      <div className="absolute -bottom-5 right-2 h-12 border-2 border-cyan-900/30 rotate-45"></div>
    </div>
  )
}

export default ChatCardSkeleton 