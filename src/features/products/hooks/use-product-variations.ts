// Path: src/features/products/hooks/use-product-variations.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { ProductVariationDTO } from "../models/product";
import useAuthStore from "@/src/stores/auth";

export function useProductVariations(productId?: string) {
  const queryClient = useQueryClient();
  const companyId = useAuthStore((state) => state.getCompanyId());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["product-variations", productId],
    queryFn: async () => {
      if (!productId) return [];

      try {
        const response = await api.get(`/api/products/${productId}/variations`);
        // Ensure we return an array even if the API returns no data
        return response.data?.data || [];
      } catch (error) {
        console.error("Erro ao buscar variações do produto:", error);
        // Return empty array instead of throwing to prevent UI crashes
        return [];
      }
    },
    enabled: !!productId,
    // Don't retry failed requests automatically to prevent request flooding
    retry: false,
    // Add a stale time to prevent too many requests
    staleTime: 30 * 1000, // 30 seconds
  });

  const createVariation = useMutation({
    mutationFn: (data: ProductVariationDTO) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      // Ensure the data has all required fields
      const payload = {
        produto: data.produto,
        variacao: data.variacao,
        valor_variacao: data.valor_variacao,
        empresa: companyId,
      };

      return api.post("/api/products/variation-items", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-variations", productId],
      });
    },
  });

  const updateVariation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductVariationDTO>;
    }) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      // Only send fields that are expected by the API
      const payload = {
        produto: data.produto,
        variacao: data.variacao,
        valor_variacao: data.valor_variacao,
        empresa: companyId,
      };

      return api.patch(`/api/products/variation-items/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-variations", productId],
      });
    },
  });

  const deleteVariation = useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/api/products/variation-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-variations", productId],
      });
    },
  });

  return {
    variations: data || [],
    isLoading,
    error,
    refetch,
    createVariation: createVariation.mutate,
    updateVariation: updateVariation.mutate,
    deleteVariation: deleteVariation.mutate,
    isCreating: createVariation.isPending,
    isUpdating: updateVariation.isPending,
    isDeleting: deleteVariation.isPending,
  };
}
