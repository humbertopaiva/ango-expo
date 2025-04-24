// Path: src/features/addons/services/addons.service.ts
import { api } from "@/src/services/api";
import {
  AddonsList,
  CreateAddonsListDTO,
  UpdateAddonsListDTO,
} from "../models/addon";
import useAuthStore from "@/src/stores/auth";

class AddonsService {
  async getAddonsList() {
    try {
      const companyId = useAuthStore.getState().getCompanyId();
      if (!companyId) {
        console.warn("ID da empresa não encontrado");
        return [];
      }

      const response = await api.get<{ data: AddonsList[]; total: number }>(
        `/api/addons-lists/company/${companyId}`,
        {
          params: {
            _t: Date.now(), // Cache buster
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error("Erro ao buscar listas de adicionais:", error);
      return [];
    }
  }

  async getAddonsListById(id: string) {
    try {
      const response = await api.get<{ data: AddonsList }>(
        `/api/addons-lists/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar lista de adicionais ${id}:`, error);
      throw error;
    }
  }

  async createAddonsList(data: CreateAddonsListDTO) {
    try {
      const response = await api.post<{ data: AddonsList }>(
        "/api/addons-lists",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar lista de adicionais:", error);
      throw error;
    }
  }

  async updateAddonsList(id: string, data: UpdateAddonsListDTO) {
    try {
      const response = await api.patch<{ data: AddonsList }>(
        `/api/addons-lists/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao atualizar lista de adicionais ${id}:`, error);
      throw error;
    }
  }

  async deleteAddonsList(id: string) {
    try {
      await api.delete(`/api/addons-lists/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir lista de adicionais ${id}:`, error);
      throw error;
    }
  }

  async getAddonsListsByCategory(categoryId: number) {
    try {
      const companyId = useAuthStore.getState().getCompanyId();
      if (!companyId) {
        console.warn("ID da empresa não encontrado");
        return [];
      }

      const response = await api.get<{ data: AddonsList[]; total: number }>(
        `/api/addons-lists/category/${categoryId}`,
        {
          params: {
            company: companyId,
            _t: Date.now(), // Cache buster
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error(
        "Erro ao buscar listas de adicionais por categoria:",
        error
      );
      return [];
    }
  }

  async clearAddonsListCache(id: string) {
    try {
      await api.post(`/api/addons-lists/${id}/clear-cache`);
      return true;
    } catch (error) {
      console.error(
        `Erro ao limpar cache da lista de adicionais ${id}:`,
        error
      );
      throw error;
    }
  }
}

export const addonsService = new AddonsService();
