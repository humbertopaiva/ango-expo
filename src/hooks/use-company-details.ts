// Path: src/hooks/use-company-details.ts
import { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";

export interface CompanyDetails {
  id: string;
  nome: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  cor_primaria: string;
  whatsapp: string | null;
  subcategorias: Array<{
    subcategorias_empresas_id: {
      id: string;
      nome: string;
      slug: string;
      imagem: string;
    };
  }>;
  categoria: {
    id: string;
    nome: string;
    slug: string;
    imagem: string;
  };
  segmento: {
    id: string;
    nome: string;
    slug: string;
  };
  plano: {
    id: string;
    nome: string;
  };
}

export function useCompanyDetails() {
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const companyId = useAuthStore((state) => state.getCompanyId());

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await api.get<{
          status: string;
          data: CompanyDetails;
        }>(`/api/companies/${companyId}`);

        setCompany(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Erro ao carregar dados da empresa")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  return { company, isLoading, error };
}
