// Path: src/features/company-page/services/custom-product.service.ts

import { api } from "@/src/services/api";
import { CustomProduct } from "../models/custom-product";

class CustomProductService {
  async getCompanyCustomProducts(companyId: string): Promise<CustomProduct[]> {
    try {
      const response = await api.get(
        `/api/custom-products/company/${companyId}/active`,
        { params: { _t: Date.now() } }
      );
      console.log("Custom products response:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching custom products:", error);
      return [];
    }
  }
}

export const customProductService = new CustomProductService();
