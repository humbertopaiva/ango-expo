// Path: src/features/products/hooks/use-product-variations.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { ProductVariationDTO } from "../models/product";

export function useProductVariations(productId?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["product-variations", productId],
    queryFn: async () => {
      if (!productId) return [];

      try {
        const response = await api.get(`/api/products/${productId}/variations`);
        return response.data.data || [];
      } catch (error) {
        console.error("Erro ao buscar variações do produto:", error);
        throw error;
      }
    },
    enabled: !!productId,
  });

  const createVariation = useMutation({
    mutationFn: (data: ProductVariationDTO) => {
      return api.post<{ data: any }>("/api/products/variation-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-variations", productId],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      return api.patch<{ data: any }>(
        `/api/products/variation-items/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-variations", productId],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
