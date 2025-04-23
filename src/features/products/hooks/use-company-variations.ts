// Path: src/features/products/hooks/use-company-variations.ts

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";
import { ProductVariation } from "../models/variation";
import { useEffect } from "react";

export function useCompanyVariations() {
  const queryClient = useQueryClient();
  const companyId = useAuthStore((state) => state.getCompanyId());

  // Usar uma chave específica para esta query
  const queryKey = ["company-variations", companyId];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!companyId) return [];

      try {
        console.log(`Buscando variações da empresa: ${companyId}`);
        const response = await api.get<{
          status: string;
          data: ProductVariation[];
        }>(`/api/products/variations/empresa/${companyId}`, {
          params: {
            _t: Date.now(), // Adicionar timestamp para evitar cache
          },
        });

        // Garantir que retornamos um array mesmo se a API retornar um objeto único
        let variations = response.data?.data || [];
        variations = Array.isArray(variations) ? variations : [variations];

        // Processar cada item para garantir os formatos corretos
        return variations.map((v) => ({
          ...v,
          id: v.id || "",
          nome: v.nome || "",
          variacao: Array.isArray(v.variacao) ? v.variacao : [],
        }));
      } catch (error) {
        console.error("Erro ao buscar variações da empresa:", error);
        return [];
      }
    },
    enabled: !!companyId,
    staleTime: 0, // Sempre pegar dados atualizados
  });

  return {
    variations: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
}
