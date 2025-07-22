
import { PanelLeftOpen } from 'lucide-react';
import { useLiveMessages } from '../../lib/hooks/useLiveMessages';
import { type Message, type Character } from '../../lib/types';
import ToggleSidebar from '../layout/ToggleSidebar';
import { useAuth } from '@/lib/providers/AuthProvider';

interface MessageHistoryProps {
  chatId: string;
  currentCharacter: Character | null;
}

const MessageHistory = ({ chatId, currentCharacter }: MessageHistoryProps) => {
  const { messages, loading } = useLiveMessages(chatId);
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
      </div>
    );
  }

  return (
    <>
      {currentCharacter && messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-cyan-900/40 text-4xl mb-4">👋</div>
            <p className="text-cyan-900 text-sm">Start chatting with {currentCharacter.name}!</p>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-10 pt-6 pb-10 space-y-4">
          {messages.map((msg: Message) => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === user?.uid ? 'msg-bubble-user' : 'msg-bubble-character'}`}>
                {msg.text}
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
