// src/features/dashboard/hooks/use-company-data.ts
import { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";

export interface Company {
  id: string;
  nome: string;
  logo: string;
  cor_primaria: string;
  categoria: {
    nome: string;
  };
  // Outros campos que possam ser necessários
}

export function useCompanyData() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const companyId = useAuthStore((state) => state.getCompanyId());

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;

      // Verifica se já temos dados em cache
      const cachedData = localStorage.getItem(`company_${companyId}`);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          const cacheTime = parsedData.timestamp || 0;
          const now = Date.now();

          // Se o cache for mais recente que 30 minutos, use-o
          if (now - cacheTime < 30 * 60 * 1000) {
            setCompany(parsedData.company);
            return;
          }
        } catch (e) {
          // Se houver erro ao parsear, ignora e busca novamente
          console.error("Erro ao ler cache:", e);
        }
      }

      setLoading(true);

      try {
        const response = await api.get<{ status: string; data: Company }>(
          `/api/companies/${companyId}`
        );
        const companyData = response.data.data;

        // Salva no cache com timestamp
        localStorage.setItem(
          `company_${companyId}`,
          JSON.stringify({
            company: companyData,
            timestamp: Date.now(),
          })
        );

        setCompany(companyData);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados da empresa:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Erro ao buscar dados da empresa")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  return { company, loading, error };
}
