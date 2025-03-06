// Path: src/features/commerce/services/vitrine.service.ts
import { api } from "@/src/services/api";
import { ShowcaseItem } from "../models/showcase-item";
import { ShowcaseCompany } from "../models/showcase-company";

class VitrineService {
  async getRecentVitrines(limit: number = 5): Promise<ShowcaseCompany[]> {
    try {
      // Primeiro buscamos as empresas com vitrines atualizadas recentemente
      const response = await api.get("/api/companies/latest/showcase");
      const showcaseCompanies = response.data.data
        .filter(
          (item: any) =>
            item.status === "published" && item.empresa.status === "on"
        )
        .map((item: any) => ({
          id: item.empresa.id,
          nome: item.empresa.nome,
          slug: item.empresa.slug,
          logo: item.empresa.logo,
          banner: item.empresa.banner,
          cor_primaria: item.empresa.cor_primaria,
          date_updated: item.date_updated || item.date_created,
        }))
        .slice(0, limit) as ShowcaseCompany[];

      return showcaseCompanies;
    } catch (error) {
      console.error("Erro ao buscar empresas com vitrines:", error);
      return [];
    }
  }

  async getCompanyVitrineItems(companySlug: string): Promise<ShowcaseItem[]> {
    try {
      const response = await api.get(`/api/vitrine/company/${companySlug}`);
      return response.data.data as ShowcaseItem[];
    } catch (error) {
      console.error(`Erro ao buscar vitrine da empresa ${companySlug}:`, error);
      return [];
    }
  }
}

export const vitrineService = new VitrineService();
