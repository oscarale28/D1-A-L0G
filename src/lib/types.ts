
import { Timestamp } from "firebase/firestore";

export interface Character {
  id: string;
  name: string;
  imageUrl: string; // Cambiado de imagePath a imageUrl
  prompt: string;
  color?: string;
  status?: string;
}

export interface Chat {
  id: string;
  userId: string;
  characterId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessageText?: string; // Nuevo campo para el texto del último mensaje
  lastMessageTimestamp?: Timestamp; // Nuevo campo para el timestamp del último mensaje
}

export interface Message {
  id: string;
  senderId: string; // Can be a user UID or a character ID
  text: string;
  timestamp: Timestamp;
}
