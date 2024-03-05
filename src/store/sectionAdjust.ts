import { create } from "zustand";
import { Coordinate } from "@/model/Coordinate";
interface SectionAdjustState extends Coordinate {
  setState: (state: Coordinate) => void;
}
export const sectionAdjustStore = create<SectionAdjustState>((set) => ({
  left: 0,
  top: 0,
  setState(state) {
    set({ ...state });
  },
}));
