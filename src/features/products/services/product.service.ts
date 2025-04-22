// Path: src/features/products/services/product.service.ts
import { api } from "@/src/services/api";
import { Product, CreateProductDTO, UpdateProductDTO } from "../models/product";
import useAuthStore from "@/src/stores/auth";

class ProductService {
  async getProducts() {
    try {
      const companyId = useAuthStore.getState().getCompanyId();
      if (!companyId) {
        console.warn("ID da empresa não encontrado");
        return [];
      }

      const response = await api.get<{ data: Product[] }>("/api/products", {
        params: {
          company: companyId,
          _t: Date.now(), // Adicionar um parâmetro de timestamp para evitar cache do navegador
        },
      });

      return response.data.data || [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  }

  async createProduct(data: CreateProductDTO) {
    try {
      const response = await api.post<{ data: Product }>("/api/products", data);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    try {
      const response = await api.patch<{ data: Product }>(
        `/api/products/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      await api.delete(`/api/products/${id}`);
      return true;
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      throw error;
    }
  }

  async getProductById(id: string) {
    try {
      const response = await api.get<{ data: Product }>(`/api/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  }
}

export const productService = new ProductService();
