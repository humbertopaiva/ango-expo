// Path: src/features/company-page/services/custom-product.service.ts

import { api } from "@/src/services/api";
import { CustomProduct } from "../../custom-products/models/custom-product";
import { CustomProductDetail } from "../models/custom-product";

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

  async getCustomProductDetails(
    productId: string
  ): Promise<CustomProductDetail> {
    try {
      const response = await api.get(`/api/custom-products/${productId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching custom product details:", error);
      throw error;
    }
  }
}

export const customProductService = new CustomProductService();
