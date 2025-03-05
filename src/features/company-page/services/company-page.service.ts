// src/features/company-page/services/company-page.service.ts
import { api } from "@/src/services/api";
import { CompanyProfile } from "../models/company-profile";
import { CompanyConfig } from "../models/company-config";
import { CompanyProduct } from "../models/company-product";

class CompanyPageService {
  async getCompanyProfile(companySlug: string): Promise<CompanyProfile> {
    try {
      const response = await api.get(`/api/companies/profile/${companySlug}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching company profile:", error);
      throw error;
    }
  }

  async getCompanyProducts(companySlug: string): Promise<CompanyProduct[]> {
    try {
      const response = await api.get(`/api/products/company/${companySlug}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching company products:", error);
      return [];
    }
  }

  async getCompanyConfig(companySlug: string): Promise<CompanyConfig> {
    try {
      const response = await api.get(
        `/api/config/company?companySlug=${companySlug}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching company config:", error);
      return {};
    }
  }

  async getCompanyShowcase(companySlug: string): Promise<CompanyProduct[]> {
    try {
      const response = await api.get(`/api/vitrine/company/${companySlug}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching company showcase:", error);
      return [];
    }
  }
}

export const companyPageService = new CompanyPageService();
