// Path: src/features/delivery/services/delivery-showcase.service.ts
import { api } from "@/src/services/api";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";

// Cache key para uso com React Query
export const DELIVERY_SHOWCASE_CACHE_KEY = "delivery_showcase";

class DeliveryShowcaseServiceClass {
  async getCompanyShowcase(
    companySlug: string
  ): Promise<DeliveryShowcaseItem[]> {
    try {
      if (!companySlug) {
        console.error("Slug da empresa não fornecido");
        return [];
      }

      console.log(`Buscando vitrine de ${companySlug} da API`);
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

      // Filtra apenas os slugs válidos
      const validSlugs = companySlugs.filter(
        (slug) => typeof slug === "string" && slug.trim() !== ""
      );

      if (validSlugs.length === 0) {
        return {};
      }

      console.log(`Buscando vitrines para ${validSlugs.length} empresas`);

      // Realiza múltiplas requisições em paralelo para todos os slugs
      const promises = validSlugs.map((slug) =>
        this.getCompanyShowcase(slug).then(
          (items): [string, DeliveryShowcaseItem[]] => [slug, items]
        )
      );

      const results = await Promise.all(promises);

      // Converte resultados para o formato esperado
      return results.reduce((acc, [slug, items]) => {
        acc[slug as string] = items;
        return acc;
      }, {} as Record<string, DeliveryShowcaseItem[]>);
    } catch (error) {
      console.error("Erro ao buscar múltiplas vitrines:", error);
      return {};
    }
  }
}

// Exportando como singleton para manter consistência
export const deliveryShowcaseService = new DeliveryShowcaseServiceClass();
