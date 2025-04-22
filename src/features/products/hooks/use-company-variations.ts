// Path: src/features/products/hooks/use-company-variations.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";
import { ProductVariation } from "../models/variation";

export function useCompanyVariations() {
  const companyId = useAuthStore((state) => state.getCompanyId());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["company-variations", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      try {
        const response = await api.get<{
          status: string;
          data: ProductVariation[];
        }>(`/api/products/variations/empresa/${companyId}`);

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
    staleTime: 1000 * 60, // 1 minuto de cache, igual ao das categorias
    retry: 2, // Tentar novamente até 2 vezes em caso de falha
  });

  return {
    variations: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
}
