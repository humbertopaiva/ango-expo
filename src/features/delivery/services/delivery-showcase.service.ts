// Path: src/features/delivery/services/delivery-showcase.service.ts
import { api } from "@/src/services/api";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";
import { cacheService } from "@/src/services/cache-service";

// Tempo de expiração do cache (30 minutos)
const CACHE_EXPIRATION = 30 * 60 * 1000;

class DeliveryShowcaseService {
  // Cache em memória para as vitrines
  private showcasesCache: Record<
    string,
    {
      data: DeliveryShowcaseItem[];
      timestamp: number;
    }
  > = {};

  async getCompanyShowcase(
    companySlug: string
  ): Promise<DeliveryShowcaseItem[]> {
    try {
      // Verificar cache em memória primeiro (mais rápido)
      const now = Date.now();
      const cacheKey = `showcase_${companySlug}`;

      if (
        this.showcasesCache[companySlug] &&
        now - this.showcasesCache[companySlug].timestamp < CACHE_EXPIRATION
      ) {
        console.log(`Usando cache em memória para vitrine de ${companySlug}`);
        return this.showcasesCache[companySlug].data;
      }

      // Verificar cache persistente
      const cachedData = await cacheService.get<DeliveryShowcaseItem[]>(
        cacheKey,
        CACHE_EXPIRATION
      );

      if (cachedData) {
        console.log(`Usando cache persistente para vitrine de ${companySlug}`);
        this.showcasesCache[companySlug] = {
          data: cachedData,
          timestamp: now,
        };
        return cachedData;
      }

      // Se não encontrou em cache, buscar da API
      console.log(`Buscando vitrine de ${companySlug} da API`);
      const response = await api.get(`/api/vitrine/company/${companySlug}`);
      const showcaseItems = response.data.data || [];

      // Atualizar caches
      this.showcasesCache[companySlug] = {
        data: showcaseItems,
        timestamp: now,
      };
      await cacheService.set(cacheKey, showcaseItems);

      return showcaseItems;
    } catch (error) {
      console.error(`Erro ao buscar vitrine da empresa ${companySlug}:`, error);

      // Em caso de erro, tentar usar o cache como fallback mesmo que expirado
      if (this.showcasesCache[companySlug]) {
        console.log(
          `Usando cache em memória como fallback para ${companySlug}`
        );
        return this.showcasesCache[companySlug].data;
      }

      const cacheKey = `showcase_${companySlug}`;
      const cachedData = await cacheService.get<DeliveryShowcaseItem[]>(
        cacheKey
      );
      if (cachedData) {
        console.log(
          `Usando cache persistente como fallback para ${companySlug}`
        );
        return cachedData;
      }

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

      // Filtra apenas os slugs que não estão no cache ou estão expirados
      const now = Date.now();
      const slugsToFetch = companySlugs.filter((slug) => {
        return (
          !this.showcasesCache[slug] ||
          now - this.showcasesCache[slug].timestamp >= CACHE_EXPIRATION
        );
      });

      console.log(
        `Total de slugs: ${companySlugs.length}, Slugs a buscar: ${slugsToFetch.length}`
      );

      // Busca apenas os dados que não estão em cache
      if (slugsToFetch.length > 0) {
        // Realiza múltiplas requisições em paralelo para os slugs não cacheados
        const promises = slugsToFetch.map((slug) =>
          this.getCompanyShowcase(slug)
        );

        const results = await Promise.all(promises);

        // Atualiza o cache com os novos resultados
        slugsToFetch.forEach((slug, index) => {
          this.showcasesCache[slug] = {
            data: results[index],
            timestamp: now,
          };
        });
      }

      // Combina os resultados do cache
      return companySlugs.reduce((acc, slug) => {
        acc[slug] = this.showcasesCache[slug]?.data || [];
        return acc;
      }, {} as Record<string, DeliveryShowcaseItem[]>);
    } catch (error) {
      console.error("Erro ao buscar múltiplas vitrines:", error);

      // Em caso de erro, retornar o que temos em cache
      return companySlugs.reduce((acc, slug) => {
        acc[slug] = this.showcasesCache[slug]?.data || [];
        return acc;
      }, {} as Record<string, DeliveryShowcaseItem[]>);
    }
  }

  // Método para limpar o cache (útil para forçar refresh)
  async clearCache() {
    this.showcasesCache = {};

    // Limpar cache persistente para todos os showcases
    await cacheService.invalidateWithPrefix("showcase_");

    console.log("Cache de vitrines limpo");
  }
}

export const deliveryShowcaseService = new DeliveryShowcaseService();
