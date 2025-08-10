import { findOrCreateChat, sendMessage, generateAndSendCharacterResponse, type CombinedChatItem } from "../services/firestore";
import type { Chat, Message } from "../types";
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { useCharacter } from "./CharacterProvider";
import { useRealTimeChatList } from "../hooks/useRealTimeChatList";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "sonner";

interface ChatListContextType {
  optimisticCombinedList: CombinedChatItem[];
  loadingChats: boolean;
  errorLoadingChats: Error | null;
  sendMessage: (text: string) => Promise<void>;
  currentChat: Chat | null;
  isLoadingChat: boolean;
  chatMessages: Message[];
  generatingResponse: boolean;
}

const ChatListContext = createContext<ChatListContextType | undefined>(undefined);

export const ChatListProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { currentCharacter } = useCharacter();
  const {
    chatList: combinedList,
    loading: loadingChats,
    error: errorLoadingChats
  } = useRealTimeChatList();

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);

  // Effect to find or create current chat
  useEffect(() => {
    if (currentCharacter && user) {
      console.log("Finding or creating chat for character:", currentCharacter.id);
      setIsLoadingChat(true);
      setCurrentChat(null); // Reset current chat
      loadChat()
    }
  }, [currentCharacter, user]);

  const loadChat = useCallback(async () => {
    try {
      setIsLoadingChat(true);
      const chat = await findOrCreateChat(currentCharacter!.id)
      setCurrentChat(chat);

      const messagesCollection = collection(db, `chats/${chat.id}/messages`);
      const q = query(messagesCollection, orderBy('timestamp', 'asc'));

      let hasInitialLoad = false;

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        setChatMessages(newMessages);

        if (!hasInitialLoad) {
          hasInitialLoad = true;
          setIsLoadingChat(false);
        }
      }, (error) => {
        console.error("Error fetching real-time messages:", error);
        setIsLoadingChat(false);
      });

      // Cleanup: se ejecuta cuando el componente se desmonta o el chatId cambia
      return () => {
        unsubscribe();
        setChatMessages([]);
      }

    } catch (error) {
      console.error("Error finding or creating chat:", error);
    } finally {
      setIsLoadingChat(false);
    }
  }, [currentCharacter]);

  // Send message handler
  const handleSendMessage = useCallback(async (text: string) => {
    if (!currentChat || !user || !currentCharacter) return;

    // Add optimistic update
    // addOptimisticUpdate(currentCharacter.id, text);

    try {
      // 1. Envía el mensaje del usuario a FIrebase
      await sendMessage(currentChat.id, text, user.uid);

      // Clear optimistic update after server confirms
      // clearOptimisticUpdate(currentCharacter.id);

      // 2. Marca flag de generando respuesta y agrega mensaje temporal
      setGeneratingResponse(true);
      const tempMessage: Message = {
        id: crypto.randomUUID(),
        text,
        senderId: currentCharacter.id,
        timestamp: Timestamp.now(),
        isTemporary: true // Flag for optimistic update
      };
      setChatMessages(prev => [...prev, tempMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setGeneratingResponse(false);
      toast.error("Failed to send message. Please try again.");
      // Clear optimistic update on error
      // clearOptimisticUpdate(currentCharacter.id);
    }

    // Generate and send character response
    try {
      // 3. Genera y envía la respuesta del personaje
      await generateAndSendCharacterResponse(currentChat.id, currentCharacter.id, text);

      setChatMessages(prev =>
        prev.filter(msg => !msg.isTemporary)
      );
      setGeneratingResponse(false);
    } catch {
      setChatMessages(prev =>
        prev.filter(msg => !msg.isTemporary)
      );
      toast.error("Failed to generate character response. Please try again.");
    } finally {
      setGeneratingResponse(false);
    }
  }, [currentChat, user, currentCharacter]);

  const value = useMemo(() => ({
    optimisticCombinedList: combinedList,
    loadingChats,
    errorLoadingChats,
    sendMessage: handleSendMessage,
    currentChat,
    isLoadingChat,
    chatMessages,
    generatingResponse
  }), [combinedList, loadingChats, handleSendMessage, errorLoadingChats, currentChat, isLoadingChat, chatMessages, generatingResponse]);

  return <ChatListContext.Provider value={value}>{children}</ChatListContext.Provider>;
};

export const useChatList = () => {
  const context = use(ChatListContext);
  if (context === undefined) {
    throw new Error('useChatList must be used within a ChatListProvider');
  }
  return context;
};
