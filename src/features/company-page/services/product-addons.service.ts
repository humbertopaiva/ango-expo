// Path: src/features/company-page/services/product-addons.service.ts

import { api } from "@/src/services/api";
import { ProductAddonList } from "../models/product-addon-list";

export const productAddonsService = {
  /**
   * Busca listas de adicionais para uma categoria de produto específica
   * @param categoryId ID da categoria de produto
   * @param companyId ID da empresa
   * @returns Lista de adicionais disponíveis
   */
  async getAddonListsByCategory(
    categoryId: number | string,
    companyId: string
  ): Promise<ProductAddonList[]> {
    try {
      const response = await api.get<{
        status: string;
        data: ProductAddonList[];
      }>(`/api/addons-lists/category/${categoryId}`, {
        params: { company: companyId },
      });

      return response.data.data || [];
    } catch (error) {
      console.error("Erro ao buscar listas de adicionais:", error);
      return [];
    }
  },
};
