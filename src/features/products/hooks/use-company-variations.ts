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
        const variations = response.data?.data || [];
        return Array.isArray(variations) ? variations : [variations];
      } catch (error) {
        console.error("Erro ao buscar variações da empresa:", error);
        throw error;
      }
    },
    enabled: !!companyId,
  });

  return {
    variations: data || [],
    isLoading,
    error,
    refetch,
  };
}
