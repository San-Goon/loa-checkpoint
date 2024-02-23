import { create } from "zustand";

interface TokenState {
  token: string;
  setToken(token: string): void;
}

export const useTokenStore = create<TokenState>((set) => ({
  token:
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "",
  setToken(token) {
    set({ token });
  },
}));
