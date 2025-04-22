// Path: src/features/products/hooks/use-product-variations-items.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import {
  ProductVariationItem,
  CreateProductVariationItemDTO,
  UpdateProductVariationItemDTO,
} from "../models/product-variation-item";
import { invalidateAllProductQueries } from "../utils/query-utils";

export function useProductVariationItems(productId?: string) {
  const queryClient = useQueryClient();

  // Definir várias chaves de query para aumentar a chance de sucesso na invalidação
  const mainQueryKey = productId
    ? ["product-variation-items", productId]
    : ["product-variation-items"];

  const { data: variationItems = [], isLoading } = useQuery({
    queryKey: mainQueryKey,
    queryFn: async () => {
      try {
        if (!productId) return [];

        console.log(`Buscando variações para o produto ${productId}`);

        const response = await api.get<{ data: ProductVariationItem[] }>(
          `/api/products/${productId}/variations`,
          {
            params: {
              _t: Date.now(), // Cache buster
            },
          }
        );

        console.log(`Variações recebidas: ${response.data.data?.length || 0}`);
        return response.data.data || [];
      } catch (error) {
        console.error("Erro ao buscar itens de variação:", error);
        return [];
      }
    },
    enabled: !!productId,
    staleTime: 0, // Sem cache em memória, sempre buscar dados frescos
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProductVariationItemDTO) => {
      console.log("Criando item de variação:", data);
      return api.post<{ data: ProductVariationItem }>(
        "/api/products/variation-items",
        data
      );
    },
    onSuccess: (result, variables) => {
      console.log("Item de variação criado com sucesso!");

      // Invalidar TODAS as queries
      invalidateAllProductQueries(queryClient);

      // Forçar um refetch específico da lista de variações deste produto
      if (productId) {
        queryClient.refetchQueries({ queryKey: mainQueryKey, exact: true });
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
      console.log(`Atualizando item de variação ${id}:`, data);
      return api.patch<{ data: ProductVariationItem }>(
        `/api/products/variation-items/${id}`,
        data
      );
    },
    onSuccess: (result) => {
      console.log("Item de variação atualizado com sucesso!");

      // Invalidar TODAS as queries
      invalidateAllProductQueries(queryClient);

      // Forçar um refetch específico da lista de variações deste produto
      if (productId) {
        queryClient.refetchQueries({ queryKey: mainQueryKey, exact: true });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      console.log(`Excluindo item de variação ${id}`);
      return api.delete(`/api/products/variation-items/${id}`);
    },
    onSuccess: (result, id) => {
      console.log(`Item de variação ${id} excluído com sucesso!`);

      // Invalidar TODAS as queries
      invalidateAllProductQueries(queryClient);

      // Forçar um refetch específico da lista de variações deste produto
      if (productId) {
        queryClient.refetchQueries({ queryKey: mainQueryKey, exact: true });
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
    refetch: () =>
      queryClient.refetchQueries({ queryKey: mainQueryKey, exact: true }),
  };
}
