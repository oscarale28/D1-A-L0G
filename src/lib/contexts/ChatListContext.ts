import { createContext } from "react";
import type { Chat } from "../types";
import type { CombinedChatItem } from "../services/firestore";

interface ChatListContextType {
    optimisticCombinedList: CombinedChatItem[];
    loadingChats: boolean;
    errorLoadingChats: Error | null;
    sendMessage: (text: string) => Promise<void>;
    currentChat: Chat | null;
    isLoadingChat: boolean;
}

export const ChatListContext = createContext<ChatListContextType | undefined>(undefined); 