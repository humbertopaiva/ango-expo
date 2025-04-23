// Path: src/features/products/hooks/use-variation-types.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";
import { CreateVariationDTO, ProductVariation } from "../models/variation";
import { variationService } from "../services/variation.service";

export function useVariationTypes() {
  const queryClient = useQueryClient();
  const companyId = useAuthStore((state) => state.getCompanyId());

  // Usar uma chave de query específica para facilitar a invalidação
  const queryKey = ["variation-types", companyId];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: variationService.getVariations,
    enabled: !!companyId,
    staleTime: 0,
  });

  // Mutação para criar um novo tipo de variação
  const createMutation = useMutation({
    mutationFn: (data: CreateVariationDTO) => {
      return variationService.createVariation(data);
    },
    onSuccess: () => {
      console.log("Variação criada com sucesso, invalidando queries");

      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey });

      // Invalidar também a query de company-variations
      queryClient.invalidateQueries({
        queryKey: ["company-variations", companyId],
      });

      // Forçar refetch imediatamente
      queryClient.refetchQueries({ queryKey });
    },
  });

  // Mutação para atualizar um tipo de variação
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateVariationDTO>;
    }) => {
      return variationService.updateVariation(id, data);
    },
    onSuccess: () => {
      console.log("Variação atualizada com sucesso, invalidando queries");

      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey });

      // Invalidar também a query de company-variations
      queryClient.invalidateQueries({
        queryKey: ["company-variations", companyId],
      });

      // Forçar refetch imediatamente
      queryClient.refetchQueries({ queryKey });
    },
  });

  // Mutação para excluir um tipo de variação
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return variationService.deleteVariation(id);
    },
    onSuccess: () => {
      console.log("Variação excluída com sucesso, invalidando queries");

      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey });

      // Invalidar também a query de company-variations
      queryClient.invalidateQueries({
        queryKey: ["company-variations", companyId],
      });

      // Forçar refetch imediatamente
      queryClient.refetchQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro na mutação de exclusão:", error);
    },
  });

  return {
    variations: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
    createVariation: createMutation.mutate,
    updateVariation: updateMutation.mutate,
    deleteVariation: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
