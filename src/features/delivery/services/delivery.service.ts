// Path: src/features/delivery/services/delivery.service.ts
import { api } from "@/src/services/api";
import { DeliveryProfile } from "../models/delivery-profile";
import { Subcategory } from "../models/subcategory";
import { cacheService } from "@/src/services/cache-service";

// Chaves para o cache
const DELIVERY_PROFILES_CACHE_KEY = "delivery_profiles";
const DELIVERY_SUBCATEGORIES_CACHE_KEY = "delivery_subcategories";

// Tempo de expiração do cache (30 minutos)
const CACHE_EXPIRATION = 30 * 60 * 1000;

class DeliveryServiceClass {
  // Cache em memória para os perfis e subcategorias
  private profilesCache: DeliveryProfile[] | null = null;
  private subcategoriesCache: Subcategory[] | null = null;
  private lastProfilesFetch: number = 0;
  private lastSubcategoriesFetch: number = 0;

  async getProfiles(): Promise<DeliveryProfile[]> {
    try {
      // Verificar cache em memória primeiro (mais rápido)
      const now = Date.now();
      if (
        this.profilesCache &&
        now - this.lastProfilesFetch < CACHE_EXPIRATION
      ) {
        console.log("Usando cache em memória para perfis de delivery");
        return this.profilesCache;
      }

      // Verificar cache persistente
      const cachedData = await cacheService.get<DeliveryProfile[]>(
        DELIVERY_PROFILES_CACHE_KEY,
        CACHE_EXPIRATION
      );

      if (cachedData && cachedData.length > 0) {
        console.log("Usando cache persistente para perfis de delivery");
        this.profilesCache = cachedData;
        this.lastProfilesFetch = now;
        return cachedData;
      }

      // Se não encontrou em cache, buscar da API
      console.log("Buscando perfis de delivery da API");
      const response = await api.get("/api/delivery/profiles");
      const profiles = response.data.data || [];

      // Atualizar caches
      this.profilesCache = profiles;
      this.lastProfilesFetch = now;
      await cacheService.set(DELIVERY_PROFILES_CACHE_KEY, profiles);

      return profiles;
    } catch (error) {
      console.error("Erro ao buscar perfis de delivery:", error);

      // Em caso de erro, tentar usar o cache como fallback mesmo que expirado
      if (this.profilesCache && this.profilesCache.length > 0) {
        console.log("Usando cache em memória como fallback após erro");
        return this.profilesCache;
      }

      const cachedData = await cacheService.get<DeliveryProfile[]>(
        DELIVERY_PROFILES_CACHE_KEY
      );
      if (cachedData && cachedData.length > 0) {
        console.log("Usando cache persistente como fallback após erro");
        return cachedData;
      }

      return [];
    }
  }

  async getSubcategories(): Promise<Subcategory[]> {
    try {
      // Verificar cache em memória primeiro
      const now = Date.now();
      if (
        this.subcategoriesCache &&
        this.subcategoriesCache.length > 0 &&
        now - this.lastSubcategoriesFetch < CACHE_EXPIRATION
      ) {
        console.log("Usando cache em memória para subcategorias de delivery");
        return this.subcategoriesCache;
      }

      // Verificar cache persistente
      const cachedData = await cacheService.get<Subcategory[]>(
        DELIVERY_SUBCATEGORIES_CACHE_KEY,
        CACHE_EXPIRATION
      );

      if (cachedData && cachedData.length > 0) {
        console.log("Usando cache persistente para subcategorias de delivery");
        this.subcategoriesCache = cachedData;
        this.lastSubcategoriesFetch = now;
        return cachedData;
      }

      // Se não encontrou em cache, buscar da API
      console.log("Buscando subcategorias de delivery da API");
      const response = await api.get("/api/delivery/subcategories");

      // Extrair as categorias do formato aninhado da resposta
      let subcategories: Subcategory[] = [];

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        // Flatten da estrutura da resposta
        const categorias = response.data.data.flatMap((item: any) =>
          item.categorias && Array.isArray(item.categorias)
            ? item.categorias
            : []
        );

        // Mapear para nosso formato de Subcategory
        subcategories = categorias.map((cat: any) => ({
          id: cat.categorias_empresas_id.id,
          nome: cat.categorias_empresas_id.nome,
          slug: cat.categorias_empresas_id.slug,
          imagem: cat.categorias_empresas_id.imagem,
        }));
      }

      // Atualizar caches
      this.subcategoriesCache = subcategories;
      this.lastSubcategoriesFetch = now;
      await cacheService.set(DELIVERY_SUBCATEGORIES_CACHE_KEY, subcategories);

      return subcategories;
    } catch (error) {
      console.error("Erro ao buscar subcategorias de delivery:", error);

      // Em caso de erro, tentar usar o cache como fallback mesmo que expirado
      if (this.subcategoriesCache && this.subcategoriesCache.length > 0) {
        console.log("Usando cache em memória como fallback após erro");
        return this.subcategoriesCache;
      }

      const cachedData = await cacheService.get<Subcategory[]>(
        DELIVERY_SUBCATEGORIES_CACHE_KEY
      );
      if (cachedData && cachedData.length > 0) {
        console.log("Usando cache persistente como fallback após erro");
        return cachedData;
      }

      return [];
    }
  }

  // Método para limpar o cache (útil para forçar refresh)
  async clearCache() {
    this.profilesCache = null;
    this.subcategoriesCache = null;
    this.lastProfilesFetch = 0;
    this.lastSubcategoriesFetch = 0;

    await cacheService.remove(DELIVERY_PROFILES_CACHE_KEY);
    await cacheService.remove(DELIVERY_SUBCATEGORIES_CACHE_KEY);

    console.log("Cache de delivery limpo");
  }
}

// Exportando como singleton para manter o cache consistente
export const deliveryService = new DeliveryServiceClass();
