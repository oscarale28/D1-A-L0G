import { createContext, use, useState } from "react";
import type { Character } from "../types";

interface CharacterContextType {
  currentCharacter: Character | null;
  selectCharacter: (character: Character | null) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);

  const selectCharacter = (character: Character | null) => {
    setCurrentCharacter(character);
  };

  return (
    <CharacterContext.Provider value={{ currentCharacter, selectCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}

export const useCharacter = () => {
  const context = use(CharacterContext);
  if (context === undefined) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
};
