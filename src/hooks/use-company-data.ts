// Path: src/hooks/use-company-data.ts
import { useState, useEffect, useCallback } from "react";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";
import { storage } from "@/src/lib/storage"; // Já está usando o storage abstrato
import { toastUtils } from "@/src/utils/toast.utils";
import { useToast } from "@gluestack-ui/themed";

export interface Company {
  id: string;
  nome: string;
  logo: string;
  cor_primaria: string;
  categoria: {
    nome: string;
  };
}

export function useCompanyData() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  const companyId = useAuthStore((state) => state.getCompanyId());

  const fetchCompanyData = useCallback(
    async (forceRefresh = false) => {
      if (!companyId) {
        console.log("CompanyId não encontrado:", companyId);
        return;
      }

      // Verificamos se já temos dados em cache e não estamos forçando refresh
      if (!forceRefresh) {
        try {
          const cachedDataStr = await storage.getItem(`company_${companyId}`);
          if (cachedDataStr) {
            const parsedData = JSON.parse(cachedDataStr);
            const cacheTime = parsedData.timestamp || 0;
            const now = Date.now();

            // Se o cache for mais recente que 30 minutos, use-o
            if (now - cacheTime < 30 * 60 * 1000) {
              console.log("Usando dados em cache para a empresa:", companyId);
              setCompany(parsedData.company);
              return;
            }
          }
        } catch (e) {
          console.error("Erro ao ler cache:", e);
        }
      }

      setLoading(true);

      try {
        console.log("Buscando dados da empresa:", companyId);
        const response = await api.get<{ status: string; data: Company }>(
          `/api/companies/${companyId}`
        );
        const companyData = response.data.data;
        console.log("Dados recebidos:", companyData);

        // Salva no cache com timestamp
        await storage.setItem(
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
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao buscar dados da empresa";

        setError(new Error(errorMessage));

        // Exibir toast de erro
        toastUtils.error(toast, "Falha ao carregar dados da empresa");
      } finally {
        setLoading(false);
      }
    },
    [companyId, toast]
  );

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  return {
    company,
    loading,
    error,
    refresh: () => fetchCompanyData(true),
  };
}
