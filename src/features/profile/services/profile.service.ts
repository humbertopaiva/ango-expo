import { api } from "@/src/services/api";
import { Profile, UpdateProfileDTO } from "../models/profile";
import useAuthStore from "@/src/stores/auth";

class ProfileService {
  async getProfile(companyId: string) {
    try {
      const response = await api.get<{ data: Profile }>(`/api/profiles`, {
        params: {
          company: companyId,
          _t: Date.now(),
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  }

  async updateProfile(id: string, data: UpdateProfileDTO) {
    try {
      const response = await api.patch<{ data: Profile }>(
        `/api/profiles/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
