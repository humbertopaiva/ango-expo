// src/features/leaflets/services/leaflet.service.ts
import { api } from "@/src/services/api";
import { Leaflet } from "../models/leaflet";

interface CategoryGroup {
  name: string;
  slug: string;
  leaflets: Leaflet[];
  id: string;
}

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

  async getLeafletsByCategories(): Promise<Record<string, CategoryGroup>> {
    try {
      const response = await api.get<{ data: Leaflet[] }>(
        "/api/encartes/ultimos"
      );
      const leaflets = response.data.data;

      // Agrupar encartes por categoria
      const groupedLeaflets = leaflets.reduce((acc, leaflet) => {
        const categorySlug = leaflet.empresa.categoria.slug;
        const categoryName = leaflet.empresa.categoria.nome;
        const categoryId = leaflet.empresa.categoria.id;

        if (!acc[categorySlug]) {
          acc[categorySlug] = {
            name: categoryName,
            slug: categorySlug,
            id: categoryId,
            leaflets: [],
          };
        }

        acc[categorySlug].leaflets.push(leaflet);
        return acc;
      }, {} as Record<string, CategoryGroup>);

      return groupedLeaflets;
    } catch (error) {
      console.error("Erro ao buscar encartes por categoria:", error);
      return {};
    }
  }
}

export const leafletService = new LeafletService();
