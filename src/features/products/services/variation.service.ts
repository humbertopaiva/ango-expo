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

class VariationService {
  async getVariations() {
    try {
      const response = await api.get<{ data: ProductVariation[] }>(
        "/api/products/variations",
        {
          params: {
            _t: Date.now(), // Adicionar um parâmetro de timestamp para evitar cache do navegador
          },
        }
      );
      return response.data.data || [];
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
            _t: Date.now(), // Adicionar um parâmetro de timestamp para evitar cache do navegador
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
      // Garantir que o formato seja exatamente o esperado pela API
      const payload = {
        nome: data.nome,
        variacao: data.variacao,
      };

      console.log("Enviando payload:", payload);

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
      // Garantir que o formato seja exatamente o esperado pela API
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
      await api.delete(`/api/products/variations/${id}`);
    } catch (error) {
      console.error("Erro ao excluir variação:", error);
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
