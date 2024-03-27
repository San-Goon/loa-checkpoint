import { create } from "zustand";

interface ActionsState {
  blacklist: { name: string; memo: string }[];
  add: (name: string) => void;
  remove: (name: string) => void;
  updateMemo: (name: string, newMemo: string) => void;
}

export const useBlacklistStore = create<ActionsState>((set) => ({
  blacklist:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("blacklist") || "[]")
      : [],
  add: (name) =>
    set((state) => {
      const isNameExists = state.blacklist.some((item) => item.name === name);
      if (!isNameExists) {
        const updatedBlacklist = [...state.blacklist, { name, memo: "" }];
        if (typeof window !== "undefined") {
          localStorage.setItem("blacklist", JSON.stringify(updatedBlacklist));
        }
        return {
          blacklist: updatedBlacklist,
        };
      }
      return state;
    }),
  remove: (name) =>
    set((state) => {
      const updatedBlacklist = state.blacklist.filter(
        (item) => item.name !== name,
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("blacklist", JSON.stringify(updatedBlacklist));
      }
      return { blacklist: updatedBlacklist };
    }),
  updateMemo: (name, newMemo) =>
    set((state) => {
      const updatedBlacklist = state.blacklist.map((item) =>
        item.name === name ? { ...item, memo: newMemo } : item,
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("blacklist", JSON.stringify(updatedBlacklist));
      }
      return { blacklist: updatedBlacklist };
    }),
}));
