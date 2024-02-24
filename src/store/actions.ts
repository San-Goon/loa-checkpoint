import { create } from "zustand";

interface ActionsState {
  OCR: boolean;
  setOCR(state: boolean): void;
}

export const useActionsStore = create<ActionsState>((set) => ({
  OCR: false,
  setOCR(state) {
    localStorage.setItem("OCR", state.toString());
    set({ OCR: state });
  },
}));
