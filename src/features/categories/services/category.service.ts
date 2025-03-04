// Path: src/features/categories/services/category.service.ts

import { api } from "@/src/services/api";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category";
import useAuthStore from "@/src/stores/auth";
import { cacheService } from "@/src/services/cache-service";

const CATEGORIES_CACHE_KEY = "categories";

class CategoryService {
  async getCategories() {
    try {
      const companyId = useAuthStore.getState().getCompanyId();
      if (!companyId) {
        throw new Error("ID da empresa não encontrado");
      }

      const cacheKey = `${CATEGORIES_CACHE_KEY}_${companyId}`;

      // Tentar obter do cache primeiro
      const cachedData = await cacheService.get<Category[]>(cacheKey);
      if (cachedData) {
        console.log("Obtendo categorias do cache");
        return cachedData;
      }

      console.log("Buscando categorias da API...");
      const response = await api.get<{ data: Category[] }>(
        "/api/product-categories",
        {
          params: {
            company: companyId,
            _t: Date.now(), // Cache buster
          },
        }
      );

      const categories = response.data.data;

      // Salvar no cache
      await cacheService.set(cacheKey, categories);

      return categories;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      throw error;
    }
  }

  async getCategoryById(id: string) {
    try {
      const companyId = useAuthStore.getState().getCompanyId();
      if (!companyId) {
        throw new Error("ID da empresa não encontrado");
      }

      const cacheKey = `${CATEGORIES_CACHE_KEY}_${companyId}_${id}`;

      // Tentar obter do cache primeiro
      const cachedData = await cacheService.get<Category>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await api.get<{ data: Category }>(
        `/api/product-categories/${id}`
      );

      const category = response.data.data;

      // Salvar no cache
      await cacheService.set(cacheKey, category);

      return category;
    } catch (error) {
      console.error(`Erro ao buscar categoria ${id}:`, error);
      throw error;
    }
  }

  async createCategory(data: CreateCategoryDTO) {
    try {
      const response = await api.post<{ data: Category }>(
        "/api/product-categories",
        data
      );

      // Invalidar cache de categorias
      const companyId = useAuthStore.getState().getCompanyId();
      if (companyId) {
        console.log("Invalidando cache após criar categoria");
        await cacheService.invalidateWithPrefix(
          `${CATEGORIES_CACHE_KEY}_${companyId}`
        );
      }

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

      // Invalidar cache de categorias
      const companyId = useAuthStore.getState().getCompanyId();
      if (companyId) {
        console.log("Invalidando cache após atualizar categoria");
        await cacheService.invalidateWithPrefix(
          `${CATEGORIES_CACHE_KEY}_${companyId}`
        );
        await cacheService.remove(`${CATEGORIES_CACHE_KEY}_${companyId}_${id}`);
      }

      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      await api.delete(`/api/product-categories/${id}`);

      // Invalidar cache de categorias
      const companyId = useAuthStore.getState().getCompanyId();
      if (companyId) {
        console.log("Invalidando cache após excluir categoria");
        await cacheService.invalidateWithPrefix(
          `${CATEGORIES_CACHE_KEY}_${companyId}`
        );
        await cacheService.remove(`${CATEGORIES_CACHE_KEY}_${companyId}_${id}`);
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
