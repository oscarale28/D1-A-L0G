
import { useState, useEffect } from 'react';
import { onSnapshot, QuerySnapshot, Timestamp, type DocumentData } from 'firebase/firestore';
import { getCombinedChatListQuery, getCharacters, type CombinedChatItem } from '../services/firestore';
import { useAuth } from '../providers/AuthProvider';
import type { Character, Chat } from '../types';

export const useRealTimeChatList = () => {
  const { user } = useAuth();
  const [chatList, setChatList] = useState<CombinedChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      console.log("fetch characters")
      try {
        const characters = await getCharacters();
        setAllCharacters(characters);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error('Unknown error occurred'))
        }
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (!user || allCharacters.length === 0) {
      setLoading(false);
      return;
    }

    console.log("query chat list")

    const query = getCombinedChatListQuery(user.uid);
    const unsubscribe = onSnapshot(query, (snapshot: QuerySnapshot<DocumentData>) => {
      const userChats = snapshot.docs.map(doc => {
        const data = doc.data() as Chat;
        // Handle pending server timestamps for updatedAt
        const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt : (data.updatedAt as any)?._methodName === 'serverTimestamp' ? Timestamp.fromMillis(Date.now()) : data.updatedAt;
        return { ...data, updatedAt: updatedAt };
      });

      const chatsByCharacterId = new Map(userChats.map(chat => [chat.characterId, chat]));

      const combinedList = allCharacters
        .map(character => ({
          character,
          chat: chatsByCharacterId.get(character.id) || null,
        }))
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
  }, [user, allCharacters]);

  return { chatList, loading, error };
};


