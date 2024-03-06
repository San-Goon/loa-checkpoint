import { create } from "zustand";

interface CharactersState {
  recognized: string[];
  added: string[];
  typed: string;
  setRecognized(state: string[]): void;
  setTyped(state: string): void;
}

export const useCharactersStore = create<CharactersState>((set, get) => ({
  recognized: [],
  added: [],
  typed: "",
  setRecognized(state) {
    const { recognized } = get();
    set({
      recognized: Array.from(new Set([...recognized, ...state])),
      added: [...state].filter((item) => !recognized.includes(item)),
    });
  },
  setTyped(typed) {
    set({ typed });
  },
}));
