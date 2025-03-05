// src/features/leaflets/services/leaflet.service.ts
import { api } from "@/src/services/api";
import { Leaflet } from "../models/leaflet";

class LeafletService {
  async getLatestLeaflets(): Promise<Leaflet[]> {
    try {
      const response = await api.get<{ data: Leaflet[] }>(
        "/api/encartes/ultimos"
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar encartes:", error);
      throw error;
    }
  }

  async getLeafletsByCategory(categorySlug: string): Promise<Leaflet[]> {
    try {
      const response = await api.get<{ data: Leaflet[] }>(
        `/api/encartes/categoria/${categorySlug}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Erro ao buscar encartes da categoria ${categorySlug}:`,
        error
      );
      throw error;
    }
  }

  async getLeafletsByCompany(companySlug: string): Promise<Leaflet[]> {
    try {
      const response = await api.get<{ data: Leaflet[] }>(
        `/api/encartes/empresa/${companySlug}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Erro ao buscar encartes da empresa ${companySlug}:`,
        error
      );
      throw error;
    }
  }
}

export const leafletService = new LeafletService();
