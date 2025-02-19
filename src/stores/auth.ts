import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Profile {
  id: string;
  directus_token: string;
  updated_at: string;
  created_at: string;
  directus_user_id: string;
  plan: string | null;
  company_id: string;
}

interface AuthState {
  profile: Profile | null;
  isAuthenticated: () => boolean;
  setAuth: (profile: Profile) => void;
  clearAuth: () => void;
  getDirectusToken: () => string | null;
  getCompanyId: () => string | null;
}

export const useAuthStore = create<AuthState>()(
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
