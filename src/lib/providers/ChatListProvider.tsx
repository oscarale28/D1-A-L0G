import { findOrCreateChat, sendMessage, generateAndSendCharacterResponse, type CombinedChatItem } from "../services/firestore";
import type { Chat } from "../types";
import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { useCharacter } from "./CharacterProvider";
import { useRealTimeChatList } from "../hooks/useRealTimeChatList";

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
    chatList: combinedList,
    loading: loadingChats,
    error: errorLoadingChats,
    addOptimisticUpdate,
    clearOptimisticUpdate
  } = useRealTimeChatList();

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

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

    // Add optimistic update
    addOptimisticUpdate(currentCharacter.id, text);

    try {
      // Send message to Firestore
      await sendMessage(currentChat.id, text, user.uid);

      // Clear optimistic update after server confirms
      clearOptimisticUpdate(currentCharacter.id);

      // Generate character response (replaces Firebase Cloud Function)
      // This runs in the background and doesn't block the UI
      generateAndSendCharacterResponse(
        currentChat.id,
        currentCharacter.id,
        user.uid
      ).catch(error => {
        console.error("Failed to generate character response:", error);
      });

    } catch (err) {
      console.error("Failed to send message:", err);
      // Clear optimistic update on error
      clearOptimisticUpdate(currentCharacter.id);
    }
  };

  const value = {
    optimisticCombinedList: combinedList, // Rename for consistency
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
