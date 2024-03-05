import { create } from "zustand";

interface CharactersState {
  recognized: string[];
  added: string[];
  setRecognized(state: string[]): void;
}

export const useCharactersStore = create<CharactersState>((set, get) => ({
  recognized: [],
  added: [],
  setRecognized(state) {
    const { recognized } = get();
    set({
      recognized: Array.from(new Set([...recognized, ...state])),
      added: [...state].filter((item) => !recognized.includes(item)),
    });
  },
}));
