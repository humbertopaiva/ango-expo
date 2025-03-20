// Path: src/features/category-page/services/category-page.service.ts
import { api } from "@/src/services/api";
import { Subcategory } from "../models/subcategory";
import { CategoryCompany } from "../models/category-company";
import { ShowcaseProduct } from "@/src/features/commerce/models/showcase-product";
import { ShowcaseCompany } from "../../commerce/models/showcase-company";
import { ShowcaseItem } from "../../commerce/models/showcase-item";

class CategoryPageService {
  async getSubcategories(categorySlug: string): Promise<Subcategory[]> {
    try {
      // Rota correta para obter subcategorias
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
      // Rota para buscar empresas por categoria
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
      // Rota para buscar vitrine da categoria
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

  async getCategoryShowcaseCompanies(
    categorySlug: string
  ): Promise<ShowcaseCompany[]> {
    try {
      // Rota para buscar empresas com vitrines por categoria
      const response = await api.get(
        `/api/vitrine/category/${categorySlug}/companies`
      );
      return response.data.data || [];
    } catch (error) {
      console.error(
        `Erro ao buscar empresas com vitrine da categoria ${categorySlug}:`,
        error
      );
      return [];
    }
  }

  async getCompanyVitrineItems(companySlug: string): Promise<ShowcaseItem[]> {
    try {
      const response = await api.get(`/api/vitrine/company/${companySlug}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar vitrine da empresa ${companySlug}:`, error);
      return [];
    }
  }
}

export const categoryPageService = new CategoryPageService();
