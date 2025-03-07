// Path: src/features/delivery/services/delivery.service.ts
import { api } from "@/src/services/api";
import { DeliveryProfile } from "../models/delivery-profile";
import { Subcategory } from "../models/subcategory";

class DeliveryService {
  async getProfiles(): Promise<DeliveryProfile[]> {
    try {
      const response = await api.get("/api/delivery/profiles");
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar perfis de delivery:", error);
      return [];
    }
  }

  async getSubcategories(): Promise<Subcategory[]> {
    try {
      const response = await api.get("/api/delivery/subcategories");

      // Extrair as categorias do formato aninhado da resposta
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
        return categorias.map((cat: any) => ({
          id: cat.categorias_empresas_id.id,
          nome: cat.categorias_empresas_id.nome,
          slug: cat.categorias_empresas_id.slug,
          imagem: cat.categorias_empresas_id.imagem,
        }));
      }

      return [];
    } catch (error) {
      console.error("Erro ao buscar subcategorias de delivery:", error);
      return [];
    }
  }
}

export const deliveryService = new DeliveryService();
