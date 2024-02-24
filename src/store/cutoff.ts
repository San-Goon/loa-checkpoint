import { create } from "zustand";

interface CutoffState {
  expLv: string;
  damage: string;
  setCutoff(state: { expLv: string; damage: string }): void;
}

export const useCutoffStore = create<CutoffState>((set) => {
  let cutoffData;
  if (typeof window !== "undefined") {
    const item = localStorage.getItem("cutoff");
    cutoffData = item ? JSON.parse(item) : null;
  }
  return {
    expLv: cutoffData?.expLv || "",
    damage: cutoffData?.damage || "",
    setCutoff(state) {
      set({ ...state });
    },
  };
});
