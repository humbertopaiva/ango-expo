// src/features/leaflets/services/leaflet.service.ts

import { api } from "@/src/services/api";
import { Leaflet, CreateLeafletDTO, UpdateLeafletDTO } from "../models/leaflet";
import useAuthStore from "@/src/stores/auth";

class LeafletService {
  async getLeaflets() {
    try {
      const companyId = useAuthStore.getState().getCompanyId();
      const response = await api.get<{ data: Leaflet[] }>("/api/encartes", {
        params: {
          company: companyId,
          _t: Date.now(),
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar encartes:", error);
      throw error;
    }
  }

  async getLeafletById(id: string) {
    try {
      const response = await api.get<{ data: Leaflet }>(`/api/encartes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar encarte com id ${id}:`, error);
      throw error;
    }
  }

  async createLeaflet(data: CreateLeafletDTO) {
    try {
      const response = await api.post<{ data: Leaflet }>("/api/encartes", data);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar encarte:", error);
      throw error;
    }
  }

  async updateLeaflet(id: string, data: UpdateLeafletDTO) {
    try {
      const response = await api.patch<{ data: Leaflet }>(
        `/api/encartes/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar encarte:", error);
      throw error;
    }
  }

  async deleteLeaflet(id: string) {
    try {
      await api.delete(`/api/encartes/${id}`);
    } catch (error) {
      console.error("Erro ao excluir encarte:", error);
      throw error;
    }
  }

  async getLeafletCount() {
    try {
      const companyId = useAuthStore.getState().getCompanyId();
      const response = await api.get<{ count: number }>("/api/encartes", {
        params: {
          company: companyId,
          aggregate: {
            count: "id",
          },
        },
      });
      return response.data.count;
    } catch (error) {
      console.error("Erro ao contar encartes:", error);
      throw error;
    }
  }
}

export const leafletService = new LeafletService();
