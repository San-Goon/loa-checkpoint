import { create } from "zustand";

interface ActionsState {
  OCR: boolean;
  setOCR(state: boolean): void;
}

export const useActionsStore = create<ActionsState>((set) => ({
  OCR: false,
  setOCR(state) {
    set({ OCR: state });
  },
}));
