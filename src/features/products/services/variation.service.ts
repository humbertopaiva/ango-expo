// Path: src/features/products/services/variation.service.ts
import { api } from "@/src/services/api";
import {
  CreateVariationDTO,
  ProductVariation,
  UpdateVariationDTO,
} from "../models/variation";
import {
  CreateProductVariationItemDTO,
  ProductVariationItem,
  UpdateProductVariationItemDTO,
} from "../models/product-variation-item";
import useAuthStore from "@/src/stores/auth";

class VariationService {
  async getVariations() {
    try {
      // Obter ID da empresa
      const companyId = useAuthStore.getState().getCompanyId();
      if (!companyId) {
        console.warn("ID da empresa não encontrado");
        return [];
      }

      // Buscar variações específicas da empresa em vez de todas
      const response = await api.get<{ data: ProductVariation[] }>(
        `/api/products/variations/empresa/${companyId}`,
        {
          params: {
            _t: Date.now(), // Adicionar parâmetro de timestamp para evitar cache
          },
        }
      );

      // Garantir que o resultado seja sempre um array
      const variations = response.data?.data || [];
      return Array.isArray(variations) ? variations : [variations];
    } catch (error) {
      console.error("Erro ao buscar variações:", error);
      throw error;
    }
  }

  async getVariationById(id: string) {
    try {
      const response = await api.get<{ data: ProductVariation }>(
        `/api/products/variations/${id}`,
        {
          params: {
            _t: Date.now(), // Evitar cache do navegador
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar variação:", error);
      throw error;
    }
  }

  async createVariation(data: CreateVariationDTO) {
    try {
      // Garantir que o formato seja correto
      const payload = {
        nome: data.nome,
        variacao: data.variacao,
        empresa: data.empresa,
      };

      console.log("Criando variação:", payload);

      const response = await api.post<{ data: ProductVariation }>(
        "/api/products/variations",
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar variação:", error);
      throw error;
    }
  }

  async updateVariation(id: string, data: UpdateVariationDTO) {
    try {
      console.log(`Atualizando variação ${id}:`, data);

      // Garantir que o formato seja correto
      const payload = {
        nome: data.nome,
        variacao: data.variacao,
      };

      const response = await api.patch<{ data: ProductVariation }>(
        `/api/products/variations/${id}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar variação:", error);
      throw error;
    }
  }

  async deleteVariation(id: string) {
    try {
      console.log(`Tentando excluir variação ${id}`);

      // Fazer a solicitação DELETE com apenas o ID da variação
      const response = await api.delete(`/api/products/variations/${id}`);

      console.log(`Variação ${id} excluída com sucesso`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir variação ${id}:`, error);
      throw error;
    }
  }

  // Métodos para itens de variação
  async getProductVariationItems(productId: string) {
    try {
      const response = await api.get<{ data: ProductVariationItem[] }>(
        `/api/products/${productId}/variations`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Erro ao buscar itens de variação:", error);
      throw error;
    }
  }

  async createVariationItem(data: CreateProductVariationItemDTO) {
    try {
      // Garantir que o formato seja exatamente o esperado pela API
      const payload = {
        produto: data.produto,
        variacao: data.variacao,
        valor_variacao: data.valor_variacao,
      };

      const response = await api.post<{ data: ProductVariationItem }>(
        "/api/products/variation-items",
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar item de variação:", error);
      throw error;
    }
  }

  async updateVariationItem(id: string, data: UpdateProductVariationItemDTO) {
    try {
      const response = await api.patch<{ data: ProductVariationItem }>(
        `/api/products/variation-items/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar item de variação:", error);
      throw error;
    }
  }

  async deleteVariationItem(id: string) {
    try {
      await api.delete(`/api/products/variation-items/${id}`);
    } catch (error) {
      console.error("Erro ao excluir item de variação:", error);
      throw error;
    }
  }
}

export const variationService = new VariationService();
