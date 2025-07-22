
import { useState, useEffect } from 'react';
import { onSnapshot, QuerySnapshot, Timestamp, type DocumentData } from 'firebase/firestore';
import { getCombinedChatListQuery, type CombinedChatItem } from '../services/firestore';
import { useAuth } from '../providers/AuthProvider';
import type { Chat } from '../types';
import { useCharacters } from './useCharacters';

export const useRealTimeChatList = () => {
  const { user } = useAuth();
  const { data: characters = [], isLoading: charactersLoading, error: charactersError } = useCharacters();
  const [chatList, setChatList] = useState<CombinedChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, { text: string; timestamp: number }>>(new Map());

  useEffect(() => {
    if (!user || characters.length === 0) {
      setLoading(false);
      return;
    }

    const query = getCombinedChatListQuery(user.uid);
    const unsubscribe = onSnapshot(query, (snapshot: QuerySnapshot<DocumentData>) => {
      const userChats = snapshot.docs.map(doc => {
        const data = doc.data() as Chat;
        let updatedAt = data.updatedAt;
        if (!(updatedAt instanceof Timestamp)) {
          if (
            typeof updatedAt === 'object' &&
            updatedAt !== null &&
            '_methodName' in updatedAt &&
            (updatedAt as { _methodName?: string })._methodName === 'serverTimestamp'
          ) {
            updatedAt = Timestamp.fromMillis(Date.now());
          }
        }
        return { ...data, updatedAt };
      });

      const chatsByCharacterId = new Map(userChats.map(chat => [chat.characterId, chat]));

      const combinedList = characters
        .map(character => {
          const chat = chatsByCharacterId.get(character.id) || null;
          const optimisticUpdate = optimisticUpdates.get(character.id);

          if (optimisticUpdate && chat) {
            return {
              character,
              chat: {
                ...chat,
                lastMessageText: optimisticUpdate.text,
                updatedAt: Timestamp.fromMillis(optimisticUpdate.timestamp),
              },
            };
          }

          return { character, chat };
        })
        .sort((a, b) => {
          const timeA = a.chat?.updatedAt instanceof Timestamp ? a.chat.updatedAt.toMillis() : 0;
          const timeB = b.chat?.updatedAt instanceof Timestamp ? b.chat.updatedAt.toMillis() : 0;

          // Prioritize items with a chat (more recent activity)
          if (timeA === 0 && timeB !== 0) return 1; // a (no chat) comes after b (has chat)
          if (timeA !== 0 && timeB === 0) return -1; // a (has chat) comes before b (no chat)

          // If both have chats, sort by timestamp (newest first)
          if (timeA !== 0 && timeB !== 0) {
            return timeB - timeA;
          }

          // If neither has a chat, sort by character name
          return a.character.name.localeCompare(b.character.name);
        });

      setChatList(combinedList);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, characters, optimisticUpdates]);

  // Function to add optimistic update
  const addOptimisticUpdate = (characterId: string, text: string) => {
    setOptimisticUpdates(prev => new Map(prev).set(characterId, {
      text,
      timestamp: Date.now()
    }));
  };

  // Function to clear optimistic update (called when server confirms)
  const clearOptimisticUpdate = (characterId: string) => {
    setOptimisticUpdates(prev => {
      const newMap = new Map(prev);
      newMap.delete(characterId);
      return newMap;
    });
  };

  return {
    chatList,
    loading: charactersLoading || loading,
    error: charactersError || error,
    addOptimisticUpdate,
    clearOptimisticUpdate
  };
};


