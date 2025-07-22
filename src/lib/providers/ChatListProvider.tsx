import { findOrCreateChat, sendMessage, type CombinedChatItem } from "../services/firestore";
import type { Chat } from "../types";
import { createContext, use, useEffect, useOptimistic, useState, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { useCharacter } from "./CharacterProvider";
import { useRealTimeChatList } from "../hooks/useRealTimeChatList";
import { Timestamp } from "firebase/firestore";


interface ChatListContextType {
  optimisticCombinedList: CombinedChatItem[];
  loadingChats: boolean;
  errorLoadingChats: Error | null;
  sendMessage: (text: string) => Promise<void>;
  currentChat: Chat | null;
  isLoadingChat: boolean;
}

const ChatListContext = createContext<ChatListContextType | undefined>(undefined);

export const ChatListProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { currentCharacter } = useCharacter();
  const {
    chatList: realTimeCombinedList,
    loading: loadingChats,
    error: errorLoadingChats
  } = useRealTimeChatList();

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Initialize optimistic state with the real-time data
  const [optimisticCombinedList, setOptimisticCombinedList] = useOptimistic(
    realTimeCombinedList,
    (state: CombinedChatItem[], newOptimisticItem: { chatId: string; lastMessageText: string; userId: string; characterId: string; }) => {
      // Find the chat to update optimistically
      const updatedList = state.map(item => {
        if (item.chat?.id === newOptimisticItem.chatId) {
          return {
            ...item,
            chat: {
              ...item.chat,
              lastMessageText: newOptimisticItem.lastMessageText,
              updatedAt: Timestamp.now(), // Optimistic timestamp
            },
          };
        }
        return item;
      });

      return updatedList
    }
  );

  // Effect to find or create current chat
  useEffect(() => {
    if (currentCharacter && user) {
      setIsLoadingChat(true);
      setCurrentChat(null); // Reset current chat
      findOrCreateChat(currentCharacter.id)
        .then(chat => setCurrentChat(chat))
        .finally(() => setIsLoadingChat(false));
    }
  }, [currentCharacter, user]);

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!currentChat || !user || !currentCharacter) return;

    // Apply optimistic update to the combined list
    setOptimisticCombinedList({
      chatId: currentChat.id,
      lastMessageText: text,
      userId: user.uid,
      characterId: currentCharacter.id,
    });

    try {
      // Send message to Firestore
      await sendMessage(currentChat.id, text, user.uid);
      // The real-time listener will eventually update the list with server timestamp
    } catch (err) {
      console.error("Failed to send message:", err);
      // TODO: Implement rollback for optimistic update if needed
    }
  };

  const value = {
    optimisticCombinedList,
    loadingChats,
    errorLoadingChats,
    sendMessage: handleSendMessage,
    currentChat,
    isLoadingChat,
  };

  return <ChatListContext.Provider value={value}>{children}</ChatListContext.Provider>;
};

export const useChatList = () => {
  const context = use(ChatListContext);
  if (context === undefined) {
    throw new Error('useChatList must be used within a ChatListProvider');
  }
  return context;
};
