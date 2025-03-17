// src/features/commerce/services/commerce.service.ts
import { api } from "@/src/services/api";
import { Category } from "../models/category";
import { Leaflet } from "../models/leaflet";
import { ShowcaseCompany } from "../models/showcase-company";
import { ShowcaseProduct } from "../models/showcase-product";
import { LatestShowcase } from "../models/latest-showcase";

class CommerceService {
  async getCategories() {
    try {
      const response = await api.get("/api/categories/segment/comercio-local");
      return response.data.data as Category[];
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }

  async getLatestLeaflets() {
    try {
      const response = await api.get("/api/encartes/ultimos");
      console.log("XERECA", response.data.data);
      return response.data.data as Leaflet[];
    } catch (error) {
      console.error("Erro ao buscar encartes:", error);
      return [];
    }
  }

  async getLatestShowcaseCompanies() {
    try {
      const response = await api.get("/api/companies/latest/showcase");

      return (response.data.data as LatestShowcase[])
        .filter(
          (item) => item.status === "published" && item.empresa.status === "on"
        )
        .map((item) => ({
          id: item.empresa.id,
          nome: item.empresa.nome,
          slug: item.empresa.slug,
          logo: item.empresa.logo,
          banner: item.empresa.banner,
          cor_primaria: item.empresa.cor_primaria,
          date_updated: item.date_updated || item.date_created,
        })) as ShowcaseCompany[];
    } catch (error) {
      console.error("Erro ao buscar empresas em destaque:", error);
      return [];
    }
  }

  async getCompanyShowcase(companySlug: string) {
    try {
      const response = await api.get(`/api/vitrine/company/${companySlug}`);
      return response.data.data as ShowcaseProduct[];
    } catch (error) {
      console.error(`Erro ao buscar vitrine da empresa ${companySlug}:`, error);
      return [];
    }
  }
}

export const commerceService = new CommerceService();
