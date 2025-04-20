// Path: src/features/products/hooks/use-variation-types.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";
import { ProductVariation, CreateVariationDTO } from "../models/variation";

export function useVariationTypes() {
  const queryClient = useQueryClient();
  const companyId = useAuthStore((state) => state.getCompanyId());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["variation-types", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      try {
        const response = await api.get<{
          status: string;
          data: ProductVariation[];
        }>(`/api/products/variations/empresa/${companyId}`);

        return response.data?.data || [];
      } catch (error) {
        console.error("Erro ao buscar tipos de variação:", error);
        throw error;
      }
    },
    enabled: !!companyId,
  });

  // Mutação para criar um novo tipo de variação
  const createMutation = useMutation({
    mutationFn: (data: CreateVariationDTO) => {
      return api.post<{ data: ProductVariation }>(
        "/api/products/variations",
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variation-types", companyId],
      });
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
      return api.patch<{ data: ProductVariation }>(
        `/api/products/variations/${id}`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variation-types", companyId],
      });
    },
  });

  // Mutação para excluir um tipo de variação
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/api/products/variations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variation-types", companyId],
      });
    },
  });

  return {
    variations: data || [],
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
