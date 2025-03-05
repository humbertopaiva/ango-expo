// src/features/delivery/services/delivery.service.ts
import { api } from "@/src/services/api";
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliverySubcategory } from "../models/delivery-subcategory";
import { DeliveryShowcaseProduct } from "../models/delivery-showcase";

class DeliveryService {
  async getDeliveryProfiles(): Promise<DeliveryProfile[]> {
    try {
      const response = await api.get("/api/delivery/profiles");

      // Garantindo que os objetos estão completos e imagens são tratadas corretamente
      const profiles = response.data.data.map((profile: any) => ({
        ...profile,
        // Use essas placeholders ou remova para usar o fallback do ImagePreview
        banner: null, // Evitando problemas de CORS
        logo: null, // Evitando problemas de CORS
        empresa: {
          ...profile.empresa,
          subcategorias: Array.isArray(profile.empresa?.subcategorias)
            ? profile.empresa.subcategorias.filter(
                (s: any) => s && s.subcategorias_empresas_id
              )
            : [],
        },
      }));

      return profiles;
    } catch (error) {
      console.error("Erro ao buscar perfis de delivery:", error);
      return [];
    }
  }

  async getDeliverySubcategories(): Promise<DeliverySubcategory[]> {
    try {
      const response = await api.get("/api/delivery/subcategories");

      // Garantindo valores válidos
      return (response.data.data || []).map(
        (subcategory: any, index: number) => ({
          id: subcategory?.id || `subcategory-${index}`,
          nome: subcategory?.nome || `Categoria ${index + 1}`,
          slug: subcategory?.slug || `categoria-${index}`,
          imagem: null, // Evitando problemas de CORS
        })
      );
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
      return [];
    }
  }

  async getDeliveryShowcase(): Promise<DeliveryShowcaseProduct[]> {
    try {
      const response = await api.get("/api/vitrine/subcategory/delivery");

      // Garantindo valores válidos
      return (response.data.data || []).map((product: any, index: number) => ({
        id: product?.id || `product-${index}`,
        nome: product?.nome || `Produto ${index + 1}`,
        descricao: product?.descricao || null,
        preco: product?.preco || "0,00",
        preco_promocional: product?.preco_promocional || null,
        imagem: null, // Evitando problemas de CORS
        empresa: {
          id: product?.empresa?.id || `empresa-${index}`,
          nome: product?.empresa?.nome || "Empresa",
          slug: product?.empresa?.slug || `empresa-${index}`,
        },
      }));
    } catch (error) {
      console.error("Erro ao buscar produtos em destaque:", error);
      return [];
    }
  }
}

export const deliveryService = new DeliveryService();
