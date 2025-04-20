// Path: src/features/products/hooks/use-variations.ts
// Versão aprimorada com tratamento de dados

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { variationService } from "../services/variation.service";
import {
  CreateVariationDTO,
  UpdateVariationDTO,
  ProductVariation,
} from "../models/variation";

export function useVariations() {
  const queryClient = useQueryClient();
  const queryKey = ["variations"];

  const { data: rawVariations = [], isLoading } = useQuery({
    queryKey,
    queryFn: variationService.getVariations,
  });

  // Garantir que cada item tenha as propriedades necessárias
  const variations = (rawVariations || []).map(
    (variation): ProductVariation => ({
      id: variation.id || "",
      nome: variation.nome || "",
      variacao: Array.isArray(variation.variacao) ? variation.variacao : [],
    })
  );

  const createMutation = useMutation({
    mutationFn: (data: CreateVariationDTO) => {
      return variationService.createVariation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVariationDTO }) =>
      variationService.updateVariation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: variationService.deleteVariation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    variations,
    isLoading,
    createVariation: createMutation.mutate,
    updateVariation: updateMutation.mutate,
    deleteVariation: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
