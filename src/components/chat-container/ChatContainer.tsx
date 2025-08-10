
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageHistory from './MessageHistory';
import { useCharacter } from '@/lib/providers/CharacterProvider';
import ToggleSidebar from '../layout/ToggleSidebar';
import { PanelLeftOpen } from 'lucide-react';
import { useChatList } from '@/lib/providers/ChatListProvider';

const ChatContainer = () => {
  const { currentCharacter } = useCharacter();
  const { currentChat, isLoadingChat } = useChatList();

  if (!currentCharacter) {
    return (
      <div className="flex flex-col h-full border-cyan-900 md:border-l-2 items-center justify-center bg-gray-800/50">
        <p className="text-gray-400">Select a character to start chatting.</p>
        <ToggleSidebar
          id="toggle-open-sidebar"
          customClasses="block md:hidden left-0 top-1/2 -translate-y-1/2 z-10 bg-cyan-950"
          icon={<PanelLeftOpen className="text-cyan-600 w-5 h-5 cursor-pointer" />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-cyan-900 md:border-l-2 overflow-hidden">
      <ChatHeader character={currentCharacter} />
      <div className="chat-container relative flex-1 overflow-y-auto flex bg-cyan-900/40">

        {isLoadingChat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="progress-bar" />
          </div>
        ) : (
          currentChat && <MessageHistory currentCharacter={currentCharacter} />
        )}
      </div>
      <MessageInput
        disabled={!currentChat || isLoadingChat}
      />
    </div >
  );
};

export default ChatContainer;
