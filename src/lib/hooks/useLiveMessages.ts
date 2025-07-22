
import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { type Message } from '../types';

export const useLiveMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const messagesCollection = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(newMessages);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching real-time messages:", error);
      setLoading(false);
    });

    // Cleanup: se ejecuta cuando el componente se desmonta o el chatId cambia
    return () => unsubscribe();

  }, [chatId]);

  return { messages, loading };
};
