// Path: src/features/products/hooks/use-product-variations-items.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import {
  ProductVariationItem,
  CreateProductVariationItemDTO,
  UpdateProductVariationItemDTO,
} from "../models/product-variation-item";

export function useProductVariationItems(productId?: string) {
  const queryClient = useQueryClient();
  const queryKey = productId
    ? ["product-variation-items", productId]
    : ["product-variation-items"];

  const { data: variationItems = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!productId) return [];
      const response = await api.get<{ data: ProductVariationItem[] }>(
        `/api/products/${productId}/variations`
      );
      return response.data.data || [];
    },
    enabled: !!productId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProductVariationItemDTO) => {
      return api.post<{ data: ProductVariationItem }>(
        "/api/products/variation-items",
        data
      );
    },
    onSuccess: () => {
      // Invalidar a query de variações deste produto específico
      queryClient.invalidateQueries({ queryKey });

      // Invalidar também as queries de produtos para atualizar a lista de produtos
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Invalidar a query de detalhes do produto específico
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["product-details", productId],
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductVariationItemDTO;
    }) => {
      return api.patch<{ data: ProductVariationItem }>(
        `/api/products/variation-items/${id}`,
        data
      );
    },
    onSuccess: () => {
      // Invalidar a query de variações deste produto específico
      queryClient.invalidateQueries({ queryKey });

      // Invalidar também as queries de produtos para atualizar a lista de produtos
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Invalidar a query de detalhes do produto específico
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["product-details", productId],
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/api/products/variation-items/${id}`);
    },
    onSuccess: () => {
      // Invalidar a query de variações deste produto específico
      queryClient.invalidateQueries({ queryKey });

      // Invalidar também as queries de produtos para atualizar a lista de produtos
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Invalidar a query de detalhes do produto específico
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["product-details", productId],
        });
      }
    },
  });

  return {
    variationItems,
    isLoading,
    createVariationItem: createMutation.mutate,
    updateVariationItem: updateMutation.mutate,
    deleteVariationItem: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
