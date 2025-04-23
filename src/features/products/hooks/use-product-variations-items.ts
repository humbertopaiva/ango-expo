// Path: src/features/products/hooks/use-product-variations-items.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import {
  ProductVariationItem,
  CreateProductVariationItemDTO,
  UpdateProductVariationItemDTO,
} from "../models/product-variation-item";
import { invalidateProductQueries } from "../utils/query-utils";

export function useProductVariationItems(productId?: string) {
  const queryClient = useQueryClient();

  // Definir a query key principal
  // Definir a query key principal
  const mainQueryKey = productId
    ? ["product-variation-items", productId]
    : ["product-variation-items"];

  const {
    data: variationItems = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: mainQueryKey,
    queryFn: async () => {
      try {
        if (!productId) return [];

        console.log(`Buscando variações para o produto ${productId}`);

        // Adicionar um timestamp para evitar cache do navegador/API
        const response = await api.get<{
          data: ProductVariationItem[];
          total?: number;
        }>(`/api/products/${productId}/variations`, {
          params: {
            _t: Date.now(), // Adicionar cache buster
            forceNoCache: true,
          },
          // Ignorar cache do axios
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        console.log(
          `Variações recebidas: ${response.data.data?.length || 0}`,
          response.data.data
        );

        // Se recebeu dados vazios, mas há um total > 0, tentar novamente
        if (
          (!response.data.data || response.data.data.length === 0) &&
          response.data.total &&
          response.data.total > 0
        ) {
          console.warn(
            "Recebeu total > 0 mas dados vazios, tentando novamente..."
          );

          // Esperar um momento e tentar de novo
          await new Promise((resolve) => setTimeout(resolve, 500));

          const retryResponse = await api.get<{
            data: ProductVariationItem[];
            total?: number;
          }>(`/api/products/${productId}/variations`, {
            params: { _t: Date.now() + 1 },
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          });

          return retryResponse.data.data || [];
        }

        return response.data.data || [];
      } catch (error) {
        console.error("Erro ao buscar itens de variação:", error);
        return [];
      }
    },
    enabled: !!productId,
    // Modificações críticas para evitar problemas de cache
    staleTime: 0, // Sempre considerar os dados obsoletos

    refetchOnMount: true, // Sempre buscar ao montar
    refetchOnWindowFocus: true, // Atualizar ao focar janela
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

      // Invalidar e FORÇAR REFETCH do produto específico e suas variações
      if (productId) {
        // Invalidar queries
        invalidateProductQueries(queryClient, productId, {
          invalidateList: true, // Agora também atualizamos a lista
          invalidateDetails: true,
          invalidateVariations: true,
          refetch: true, // Forçar refetch imediatamente
        });

        // Garantir uma refetch imediata
        queryClient.refetchQueries({
          queryKey: ["product-details", productId],
        });
        queryClient.refetchQueries({ queryKey: mainQueryKey });
      }
    },
  });

  // Restante do código sem alteração

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
    onSuccess: (result, variables) => {
      console.log("Item de variação atualizado com sucesso!");

      // Invalidar e forçar refetch
      if (productId) {
        invalidateProductQueries(queryClient, productId, {
          invalidateList: true,
          invalidateDetails: true,
          invalidateVariations: true,
          refetch: true,
        });
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

      // Invalidar e forçar refetch
      if (productId) {
        invalidateProductQueries(queryClient, productId, {
          invalidateList: true,
          invalidateDetails: true,
          invalidateVariations: true,
          refetch: true,
        });
      }
    },
  });

  return {
    variationItems: variationItems || [], // Garantir que nunca seja undefined
    isLoading,
    createVariationItem: createMutation.mutate,
    updateVariationItem: updateMutation.mutate,
    deleteVariationItem: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
}
