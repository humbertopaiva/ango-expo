// Path: src/hooks/use-company-data.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";
import { toastUtils } from "@/src/utils/toast.utils";
import { useToast } from "@gluestack-ui/themed";
import { cacheService } from "@/src/services/cache-service";

// Tempo de expiração do cache em milissegundos (30 minutos)
const CACHE_EXPIRATION = 30 * 60 * 1000;

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
  const initialized = useRef(false);
  const fetchingRef = useRef(false);
  const lastCompanyId = useRef<string | null>(null);

  const companyId = useAuthStore((state) => state.getCompanyId());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  // Função para limpar os dados da empresa
  const clearCompanyData = useCallback(() => {
    setCompany(null);
    initialized.current = false;
    lastCompanyId.current = null;
  }, []);

  const fetchCompanyData = useCallback(
    async (forceRefresh = false) => {
      // Verificar se existe um ID de empresa e se está autenticado
      if (!companyId || !isAuthenticated) {
        console.log("CompanyId não encontrado ou usuário não autenticado");
        clearCompanyData();
        return;
      }

      // Evitar buscar dados para o mesmo ID repetidamente
      if (lastCompanyId.current === companyId && !forceRefresh) {
        return;
      }

      // Evitar múltiplas chamadas simultâneas
      if (fetchingRef.current) {
        console.log("Já existe uma requisição em andamento");
        return;
      }

      const cacheKey = `company_${companyId}`;

      // Verificar cache se não estiver forçando um refresh
      if (!forceRefresh) {
        try {
          const cachedData = await cacheService.get<Company>(
            cacheKey,
            CACHE_EXPIRATION
          );
          if (cachedData) {
            setCompany(cachedData);
            lastCompanyId.current = companyId;
            return;
          }
        } catch (error) {
          console.error("Erro ao verificar cache:", error);
        }
      }

      // Marcar como em andamento
      fetchingRef.current = true;
      setLoading(true);

      try {
        console.log("Buscando dados da empresa:", companyId);
        const response = await api.get<{ status: string; data: Company }>(
          `/api/companies/${companyId}`
        );
        const companyData = response.data.data;

        // Salvar no cache
        await cacheService.set(cacheKey, companyData);

        setCompany(companyData);
        lastCompanyId.current = companyId;
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados da empresa:", err);

        // Tentar usar dados em cache como fallback mesmo se forcedRefresh
        try {
          const cachedData = await cacheService.get<Company>(cacheKey);
          if (cachedData) {
            setCompany(cachedData);
            lastCompanyId.current = companyId;
            console.log("Usando cache como fallback após erro na API");
          } else {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "Erro ao buscar dados da empresa";

            setError(new Error(errorMessage));

            // Exibir toast apenas se não temos dados
            toastUtils.error(toast, "Falha ao carregar dados da empresa");
          }
        } catch (cacheError) {
          console.error(
            "Erro ao verificar cache após falha na API:",
            cacheError
          );
        }
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    },
    [companyId, isAuthenticated, clearCompanyData, toast]
  );

  // Função para atualizar apenas certos campos da empresa
  const updateCompanyFields = useCallback(
    async (fields: Partial<Company>) => {
      if (!companyId || !company) return;

      const cacheKey = `company_${companyId}`;

      // Atualizar estado local imediatamente para resposta instantânea na UI
      const updatedCompany = { ...company, ...fields };
      setCompany(updatedCompany);

      // Atualizar no cache
      await cacheService.set(cacheKey, updatedCompany);

      return updatedCompany;
    },
    [companyId, company]
  );

  // Efeito para lidar com mudanças de autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      clearCompanyData();
    }
  }, [isAuthenticated, clearCompanyData]);

  // Efeito para carregar dados iniciais e lidar com mudanças de ID
  useEffect(() => {
    // Se não estiver autenticado, não fazer nada
    if (!isAuthenticated) {
      return;
    }

    // Se o ID da empresa mudou ou ainda não inicializamos e temos um ID
    if (
      companyId &&
      (lastCompanyId.current !== companyId || !initialized.current)
    ) {
      fetchCompanyData();
      initialized.current = true;
    }
  }, [fetchCompanyData, companyId, isAuthenticated]);

  return {
    company,
    loading,
    error,
    refresh: () => fetchCompanyData(true),
    updateCompanyFields,
    clearCompanyData,
  };
}
