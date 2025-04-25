// Path: src/features/custom-products/services/custom-products.service.ts
import { api } from "@/src/services/api";
import {
  CustomProduct,
  CreateCustomProductDTO,
  UpdateCustomProductDTO,
} from "../models/custom-product";
import useAuthStore from "@/src/stores/auth";

class CustomProductsService {
  async getCustomProducts() {
    try {
      const companyId = useAuthStore.getState().getCompanyId();
      if (!companyId) {
        console.warn("ID da empresa não encontrado");
        return [];
      }

      const response = await api.get<{ data: CustomProduct[]; total: number }>(
        `/api/custom-products/company/${companyId}`,
        {
          params: {
            _t: Date.now(), // Cache buster
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error("Erro ao buscar produtos personalizados:", error);
      return [];
    }
  }

  async getCustomProductById(id: string) {
    try {
      const response = await api.get<{ data: CustomProduct }>(
        `/api/custom-products/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar produto personalizado ${id}:`, error);
      throw error;
    }
  }

  async createCustomProduct(data: CreateCustomProductDTO) {
    try {
      const response = await api.post<{ data: CustomProduct }>(
        "/api/custom-products",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar produto personalizado:", error);
      throw error;
    }
  }

  async updateCustomProduct(id: string, data: UpdateCustomProductDTO) {
    try {
      const response = await api.patch<{ data: CustomProduct }>(
        `/api/custom-products/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto personalizado ${id}:`, error);
      throw error;
    }
  }

  async deleteCustomProduct(id: string) {
    try {
      await api.delete(`/api/custom-products/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir produto personalizado ${id}:`, error);
      throw error;
    }
  }

  async clearCustomProductCache(id: string) {
    try {
      await api.post(`/api/custom-products/${id}/clear-cache`);
      return true;
    } catch (error) {
      console.error(
        `Erro ao limpar cache do produto personalizado ${id}:`,
        error
      );
      throw error;
    }
  }
}

export const customProductsService = new CustomProductsService();
