// Path: src/features/products/hooks/use-variation-items.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { variationService } from "../services/variation.service";
import {
  CreateVariationItemDTO,
  UpdateVariationItemDTO,
} from "../models/variation";

export function useVariationItems(productId?: string) {
  const queryClient = useQueryClient();
  const queryKey = productId ? ["product-variations", productId] : [];

  const { data: variationItems = [], isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      productId ? variationService.getProductVariationItems(productId) : [],
    enabled: !!productId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateVariationItemDTO) => {
      return variationService.createVariationItem(data);
    },
    onSuccess: () => {
      if (productId) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVariationItemDTO }) =>
      variationService.updateVariationItem(id, data),
    onSuccess: () => {
      if (productId) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: variationService.deleteVariationItem,
    onSuccess: () => {
      if (productId) {
        queryClient.invalidateQueries({ queryKey });
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
