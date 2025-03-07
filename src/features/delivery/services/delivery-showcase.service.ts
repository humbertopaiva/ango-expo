// Path: src/features/delivery/services/delivery-showcase.service.ts
import { api } from "@/src/services/api";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";

class DeliveryShowcaseService {
  async getCompanyShowcase(
    companySlug: string
  ): Promise<DeliveryShowcaseItem[]> {
    try {
      const response = await api.get(`/api/vitrine/company/${companySlug}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Erro ao buscar vitrine da empresa ${companySlug}:`, error);
      return [];
    }
  }

  async getMultipleShowcases(
    companySlugs: string[]
  ): Promise<Record<string, DeliveryShowcaseItem[]>> {
    try {
      // Se não houver slugs, retorne um objeto vazio
      if (!companySlugs || companySlugs.length === 0) {
        return {};
      }

      // Realiza múltiplas requisições em paralelo
      const promises = companySlugs.map((slug) =>
        this.getCompanyShowcase(slug)
      );
      const results = await Promise.all(promises);

      // Mapeia os resultados de volta aos slugs
      return companySlugs.reduce((acc, slug, index) => {
        acc[slug] = results[index];
        return acc;
      }, {} as Record<string, DeliveryShowcaseItem[]>);
    } catch (error) {
      console.error("Erro ao buscar múltiplas vitrines:", error);
      return {};
    }
  }
}

export const deliveryShowcaseService = new DeliveryShowcaseService();
