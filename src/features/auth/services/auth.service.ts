// src/features/auth/services/auth.service.ts
import { supabase } from "@/src/lib/supabase";
import { LoginFormData } from "../schemas/auth.schema";
import useAuthStore from "@/src/stores/auth";
import { Alert, Platform } from "react-native";

export class AuthService {
  /**
   * Realiza o login do usuário
   */
  async login({ email, password }: LoginFormData) {
    try {
      // Autenticação com o Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw new Error(authError.message);

      // Busca os dados do perfil
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (profileError) throw new Error(profileError.message);

      // Armazena os dados no estado global
      const store = useAuthStore.getState();
      store.setAuth(profileData);

      // Log de sucesso no console
      console.log("Login realizado com sucesso:", email);

      return profileData;
    } catch (error: unknown) {
      console.error("Erro ao realizar login:", error);

      // Customiza a mensagem de erro para o usuário
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email ou senha incorretos");
        }
      }

      // Repassa o erro original
      throw error;
    }
  }

  /**
   * Realiza o logout do usuário
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw new Error(error.message);

      // Limpa os dados de autenticação do estado global
      const store = useAuthStore.getState();
      store.clearAuth();

      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
      throw error;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async checkAuth() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      return data.session !== null;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      return false;
    }
  }

  /**
   * Solicita redefinição de senha
   */
  async requestPasswordReset(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
