
import { Timestamp } from "firebase/firestore";

export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  prompt: string;
  color?: string;
  status?: CharacterStatus;
}

export type CharacterStatus = 'online' | 'away' | 'busy' | 'offline';

export interface Chat {
  id: string;
  userId: string;
  characterId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessageText?: string;
  lastMessageTimestamp?: Timestamp;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
}
