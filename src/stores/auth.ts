// src/stores/auth.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Profile } from "../features/auth/models/auth";
import { storage } from "../lib/storage";

interface AuthState {
  profile: Profile | null;
  isAuthenticated: () => boolean;
  setAuth: (profile: Profile) => void;
  clearAuth: () => void;
  getDirectusToken: () => string | null;
  getCompanyId: () => string | null;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      profile: null,
      isAuthenticated: () => {
        const state = get();
        return !!state.profile?.directus_token;
      },
      setAuth: (profile) => {
        console.log("Definindo autenticação:", profile);
        set({ profile });
      },
      clearAuth: () => {
        console.log("Limpando autenticação");
        set({ profile: null });
      },
      getDirectusToken: () => get().profile?.directus_token || null,
      getCompanyId: () => get().profile?.company_id || null,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const value = await storage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await storage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await storage.removeItem(name);
        },
      })),
    }
  )
);

export default useAuthStore;
