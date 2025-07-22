import { useQuery } from '@tanstack/react-query';
import { onSnapshot, QuerySnapshot, Timestamp, type DocumentData } from 'firebase/firestore';
import { getCombinedChatListQuery, type CombinedChatItem } from '../services/firestore';
import { useAuth } from '../providers/AuthProvider';
import { useCharacters } from './useCharacters';
import type { Chat } from '../types';
import { useEffect, useState } from 'react';

export const useUserChats = () => {
  const { user } = useAuth();
  const { data: characters = [], isLoading: charactersLoading, error: charactersError } = useCharacters();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

      setChats(userChats);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, characters.length]);

  // Combine characters and chats
  const combinedList: CombinedChatItem[] = characters.map(character => {
    const chat = chats.find(c => c.characterId === character.id) || null;
    return { character, chat };
  }).sort((a, b) => {
    const timeA = a.chat?.updatedAt instanceof Timestamp ? a.chat.updatedAt.toMillis() : 0;
    const timeB = b.chat?.updatedAt instanceof Timestamp ? b.chat.updatedAt.toMillis() : 0;

    if (timeA === 0 && timeB !== 0) return 1;
    if (timeA !== 0 && timeB === 0) return -1;
    if (timeA !== 0 && timeB !== 0) {
      return timeB - timeA;
    }
    return a.character.name.localeCompare(b.character.name);
  });

  return {
    data: combinedList,
    isLoading: charactersLoading || loading,
    error: charactersError || error,
  };
}; 