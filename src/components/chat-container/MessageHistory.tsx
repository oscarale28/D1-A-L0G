
import { PanelLeftOpen } from 'lucide-react';
import ToggleSidebar from '../layout/ToggleSidebar';
import { useAuth } from '@/lib/providers/AuthProvider';
import { useChatList } from '@/lib/providers/ChatListProvider';
import { Character, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface MessageHistoryProps {
  currentCharacter: Character | null;
}

const MessageHistory = ({ currentCharacter }: MessageHistoryProps) => {
  const { chatMessages, isLoadingChat } = useChatList();
  const { user } = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (isLoadingChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
      </div>
    );
  }

  return (
    <>
      {/* Empty chat history */}
      {currentCharacter && chatMessages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-cyan-900/40 text-4xl mb-4">👋</div>
            <p className="text-cyan-900 text-sm">Start chatting with {currentCharacter.name}!</p>
          </div>
        </div>
      )}

      {/* Message history */}
      {chatMessages.length > 0 && (
        <div
          className="flex-1 overflow-y-auto px-10 pt-6 pb-10 space-y-4"
          ref={messagesContainerRef}
        >
          {chatMessages.map((msg: Message) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div className={
                cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                  msg.senderId === user?.uid ? 'msg-bubble-user' : 'msg-bubble-character',
                  msg.isTemporary && 'animate-pulse'
                )
              }>
                {msg.isTemporary ? "Typing..." : msg.text}
              </div>
            </div>
          ))}
        </div>
      )}

      <ToggleSidebar
        id="toggle-open-sidebar"
        customClasses="block md:hidden left-0 top-1/2 -translate-y-1/2 z-10 bg-cyan-950"
        icon={<PanelLeftOpen className="text-cyan-600 w-5 h-5 cursor-pointer" />}
      />
    </>
  );
};

export default MessageHistory;
