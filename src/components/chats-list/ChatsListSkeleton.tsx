import ChatCardSkeleton from './ChatCardSkeleton'

const ChatsListSkeleton = () => {
  const skeletonItems = Array.from({ length: 4 }, (_, index) => (
    <ChatCardSkeleton key={index} />
  ))

  return (
    <div className="chats-list-skeleton">
      {skeletonItems}
    </div>
  )
}

export default ChatsListSkeleton 