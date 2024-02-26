import { create } from "zustand";

interface ImageAdjustState {
  left: number;
  top: number;
  setState: (state: { left: number; top: number }) => void;
}

export const imageAdjustStore = create<ImageAdjustState>((set) => ({
  left: 0,
  top: 0,
  setState(state) {
    set({ ...state });
  },
}));
