// src/features/categories/services/category.service.ts
import { api } from "@/src/services/api";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category";
import useAuthStore from "@/src/stores/auth";

class CategoryService {
  async getCategories() {
    try {
      const response = await api.get<{ data: Category[] }>(
        "/api/product-categories",
        {
          params: {
            company: useAuthStore.getState().getCompanyId(),
            _t: Date.now(), // Cache buster
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      throw error;
    }
  }

  async createCategory(data: CreateCategoryDTO) {
    try {
      const response = await api.post<{ data: Category }>(
        "/api/product-categories",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
  }

  async updateCategory(id: string, data: UpdateCategoryDTO) {
    try {
      const response = await api.patch<{ data: Category }>(
        `/api/product-categories/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      await api.delete(`/api/product-categories/${id}`);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
