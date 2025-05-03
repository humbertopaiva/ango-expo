// Path: src/features/delivery/services/delivery.service.ts
import { api } from "@/src/services/api";
import { DeliveryProfile } from "../models/delivery-profile";
import { Subcategory } from "../models/subcategory";

// Chaves para o cache do React Query
export const DELIVERY_PROFILES_CACHE_KEY = "delivery_profiles";
export const DELIVERY_SUBCATEGORIES_CACHE_KEY = "delivery_subcategories";

class DeliveryServiceClass {
  async getProfiles(): Promise<DeliveryProfile[]> {
    try {
      console.log("Buscando perfis de delivery da API");
      const response = await api.get("/api/delivery/profiles");
      const profiles = response.data.data || [];
      return profiles;
    } catch (error) {
      console.error("Erro ao buscar perfis de delivery:", error);
      return [];
    }
  }

  async getSubcategories(): Promise<Subcategory[]> {
    try {
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

      return subcategories;
    } catch (error) {
      console.error("Erro ao buscar subcategorias de delivery:", error);
      return [];
    }
  }
}

// Exportando como singleton para manter consistência
export const deliveryService = new DeliveryServiceClass();
