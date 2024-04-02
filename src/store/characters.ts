import { create } from "zustand";

interface CharactersState {
  recognized: string[];
  typed: string[];
  setRecognized(state: string[]): void;
  setTyped(state: string): void;
  deleteName(state: string): void;
  initialize(): void;
}

export const useCharactersStore = create<CharactersState>((set, get) => ({
  recognized: [],
  typed: [],
  setRecognized(recognized) {
    set((prev) => {
      const copiedObj = { ...prev };
      copiedObj.recognized = recognized;
      return copiedObj;
    });
  },
  setTyped(typed) {
    set((prev) => {
      const copiedObj = { ...prev };
      copiedObj.typed = Array.from(new Set([...prev.typed, typed]));
      return copiedObj;
    });
  },
  deleteName(name) {
    set((prev) => {
      const copiedObj = { ...prev };
      copiedObj.recognized = prev.recognized.filter((v) => v !== name);
      copiedObj.typed = prev.typed.filter((v) => v !== name);
      return copiedObj;
    });
  },
  initialize() {
    set((prev) => {
      const copiedObj = { ...prev };
      copiedObj.recognized = [];
      copiedObj.typed = [];
      return copiedObj;
    });
  },
}));
