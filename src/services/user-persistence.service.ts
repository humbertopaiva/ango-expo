// Path: src/services/user-persistence.service.ts
import { storage } from "@/src/lib/storage";
import { PersonalInfo } from "@/src/features/checkout/models/checkout";

const USER_DATA_KEY = "user_personal_info";

export const userPersistenceService = {
  /**
   * Salva os dados pessoais do usuário
   */
  async saveUserPersonalInfo(data: PersonalInfo): Promise<void> {
    try {
      await storage.setItem(USER_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }
  },

  /**
   * Recupera os dados pessoais do usuário
   */
  async getUserPersonalInfo(): Promise<PersonalInfo | null> {
    try {
      const userData = await storage.getItem(USER_DATA_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error);
      return null;
    }
  },

  /**
   * Limpa os dados pessoais do usuário
   */
  async clearUserPersonalInfo(): Promise<void> {
    try {
      await storage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error("Erro ao limpar dados do usuário:", error);
    }
  },
};
