import ChatCard from './ChatCard';
import { useCharacter } from '@/lib/providers/CharacterProvider';
import { useChatList } from '@/lib/providers/ChatListProvider';

const ChatsList = () => {
  const { currentCharacter, selectCharacter } = useCharacter();
  const { optimisticCombinedList, loadingChats, errorLoadingChats } = useChatList();

  if (loadingChats) {
    return <div className='progress-bar' />;
  }

  if (errorLoadingChats) {
    return <div className="text-red-500">Error loading data: {errorLoadingChats.message}</div>;
  }

  // Ensure data is available before proceeding
  if (!optimisticCombinedList) {
    return null; // Or a more specific loading/error state
  }

  return (
    <>
      {optimisticCombinedList.map(({ character, chat }) => (
        <ChatCard
          key={character.id}
          character={character}
          lastMessage={chat ? { text: chat.lastMessageText || "", timestamp: chat.lastMessageTimestamp || chat.updatedAt, senderId: "", id: "" } : undefined}
          isSelected={currentCharacter?.id === character.id}
          onClick={() => selectCharacter(character)}
        />
      ))}
    </>
  )
}

export default ChatsList