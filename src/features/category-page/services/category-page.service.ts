// Path: src/features/category-page/services/category-page.service.ts
import { api } from "@/src/services/api";
import { Subcategory } from "../models/subcategory";
import { CategoryCompany } from "../models/category-company";
import { ShowcaseProduct } from "@/src/features/commerce/models/showcase-product";

class CategoryPageService {
  async getSubcategories(categorySlug: string): Promise<Subcategory[]> {
    try {
      const response = await api.get(
        `/api/categories/${categorySlug}/subcategories`
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
      return [];
    }
  }

  async getCompaniesByCategory(
    categorySlug: string
  ): Promise<CategoryCompany[]> {
    try {
      const response = await api.get(`/api/companies/category/${categorySlug}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `Erro ao buscar empresas da categoria ${categorySlug}:`,
        error
      );
      return [];
    }
  }

  async getCategoryShowcase(categorySlug: string): Promise<ShowcaseProduct[]> {
    try {
      const response = await api.get(`/api/vitrine/category/${categorySlug}`);
      return response.data.data;
    } catch (error) {
      console.error(
        `Erro ao buscar vitrine da categoria ${categorySlug}:`,
        error
      );
      return [];
    }
  }
}

export const categoryPageService = new CategoryPageService();
