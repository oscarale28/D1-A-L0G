
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp, orderBy, limit, updateDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { type Character, type Chat, type Message } from "../types";

// --- Servicios ---

/**
 * Obtiene la lista de personajes desde Firestore.
 */
export const getCharacters = async (): Promise<Character[]> => {
  const charactersCollection = collection(db, "characters");
  const snapshot = await getDocs(charactersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
};

/**
 * Obtiene la lista de chats de un usuario.
 */
export const getUserChats = async (userId: string): Promise<Chat[]> => {
  const chatsCollection = collection(db, "chats");
  const q = query(chatsCollection, where("userId", "==", userId), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
};

/**
 * Obtiene los mensajes de un chat específico.
 */
export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const messagesCollection = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesCollection, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
};

/**
 * Envía un nuevo mensaje en un chat y actualiza el chat padre.
 * @returns El objeto Chat actualizado optimísticamente.
 */
export const sendMessage = async (chatId: string, text: string, senderId: string): Promise<Chat> => {
  const messageTimestamp = serverTimestamp();
  const messagesCollection = collection(db, `chats/${chatId}/messages`);
  const chatRef = doc(db, "chats", chatId);

  // 1. Guardar el mensaje del usuario en Firestore
  await addDoc(messagesCollection, {
    text,
    senderId,
    timestamp: messageTimestamp,
  });

  // Obtener el chat actual para la actualización optimista
  const currentChatDoc = await getDoc(chatRef);
  const currentChatData = currentChatDoc.data() as Chat;

  // Crear un objeto Chat optimista con la hora actual del cliente
  const optimisticChat: Chat = {
    ...currentChatData,
    id: chatId,
    lastMessageText: text,
    lastMessageTimestamp: Timestamp.now(), // Usar timestamp del cliente para optimismo
    updatedAt: Timestamp.now(), // Usar timestamp del cliente para optimismo
  };

  // Actualizar el chat padre con el último mensaje del usuario (Firestore)
  await updateDoc(chatRef, {
    lastMessageText: text,
    lastMessageTimestamp: messageTimestamp,
    updatedAt: messageTimestamp,
  });

  return optimisticChat; // Siempre devuelve el chat optimista
};

/**
 * Crea un nuevo chat si no existe uno previo entre el usuario y el personaje.
 * Si ya existe, devuelve el chat existente.
 */
export const findOrCreateChat = async (characterId: string): Promise<Chat> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Usuario no autenticado.");

  const chatsCollection = collection(db, "chats");
  const q = query(chatsCollection,
    where("userId", "==", userId),
    where("characterId", "==", characterId),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    // El chat ya existe
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Chat;
  } else {
    // El chat no existe, hay que crearlo
    const newChatRef = await addDoc(chatsCollection, {
      userId,
      characterId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageText: "", // Inicializar con cadena vacía
      lastMessageTimestamp: serverTimestamp(), // Inicializar con timestamp
    });
    const newChatDoc = await getDoc(newChatRef);
    return { id: newChatDoc.id, ...newChatDoc.data() } as Chat;
  }
};

// --- Nueva función combinada para la lista de chats/personajes ---
export interface CombinedChatItem {
  character: Character;
  chat: Chat | null;
}

export const getCombinedChatListQuery = (userId: string) => {
  const chatsCollection = collection(db, "chats");
  return query(chatsCollection, where("userId", "==", userId), orderBy("updatedAt", "desc"));
}

export const getCombinedChatList = async (userId: string): Promise<CombinedChatItem[]> => {
  const [allCharacters, userChats] = await Promise.all([
    getCharacters(),
    getDocs(getCombinedChatListQuery(userId)).then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat)))
  ]);

  const chatsByCharacterId = new Map(userChats.map(chat => [chat.characterId, chat]));

  const combinedList = allCharacters
    .map(character => ({
      character,
      chat: chatsByCharacterId.get(character.id) || null,
    }))
    .sort((a, b) => {
      const timeA = a.chat?.updatedAt?.toDate ? a.chat.updatedAt.toDate().getTime() : 0;
      const timeB = b.chat?.updatedAt?.toDate ? b.chat.updatedAt.toDate().getTime() : 0;

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

  return combinedList;
};

