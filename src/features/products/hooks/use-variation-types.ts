// Path: src/features/products/hooks/use-variation-types.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";
import { CreateVariationDTO, ProductVariation } from "../models/variation";

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
      // Invalidar queries relacionadas às variações
      queryClient.invalidateQueries({
        queryKey: ["variation-types", companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["company-variations", companyId],
      });

      // Invalidar também as queries de produtos, já que produtos podem ter variações
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      // Invalidar queries relacionadas às variações
      queryClient.invalidateQueries({
        queryKey: ["variation-types", companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["company-variations", companyId],
      });

      // Invalidar também as queries de produtos, já que produtos podem ter variações
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Invalidar todas as queries de detalhes de produtos
      queryClient.invalidateQueries({
        queryKey: ["product-details"],
      });
    },
  });

  // Mutação para excluir um tipo de variação
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/api/products/variations/${id}`);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas às variações
      queryClient.invalidateQueries({
        queryKey: ["variation-types", companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["company-variations", companyId],
      });

      // Invalidar também as queries de produtos, já que produtos podem ter variações
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Invalidar todas as queries de detalhes de produtos
      queryClient.invalidateQueries({
        queryKey: ["product-details"],
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
