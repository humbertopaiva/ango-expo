// Path: src/features/company-page/services/custom-product.service.ts

import { api } from "@/src/services/api";
import { CustomProduct } from "../models/custom-product";

class CustomProductService {
  async getCompanyCustomProducts(companyId: string): Promise<CustomProduct[]> {
    try {
      const response = await api.get(`/api/custom-products/${companyId}`);
      // A API retorna um único objeto, mas vamos adaptar para um array para manter o padrão
      const product = response.data.data;
      return product ? [product] : [];
    } catch (error) {
      console.error("Error fetching custom products:", error);
      return [];
    }
  }
}

export const customProductService = new CustomProductService();
