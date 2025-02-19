// services/auth.service.ts
import { supabase } from "../lib/supabase";
import useAuthStore from "../stores/auth";

import { LoginFormData } from "../types/auth";

export class AuthService {
  async login({ email, password }: LoginFormData) {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) throw new Error(authError.message);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .single();

    if (profileError) throw new Error(profileError.message);

    const store = useAuthStore.getState();
    store.setAuth(profileData);

    return profileData;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    const store = useAuthStore.getState();
    store.clearAuth();
    if (error) throw new Error(error.message);
  }
}

export const authService = new AuthService();
