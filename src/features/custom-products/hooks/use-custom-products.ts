// Path: src/features/custom-products/hooks/use-custom-products.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customProductsService } from "../services/custom-products.service";
import {
  CreateCustomProductDTO,
  UpdateCustomProductDTO,
} from "../models/custom-product";
import useAuthStore from "@/src/stores/auth";

export function useCustomProducts() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  const queryKey = ["custom-products", companyId];

  const { data: customProducts = [], isLoading } = useQuery({
    queryKey,
    queryFn: customProductsService.getCustomProducts,
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCustomProductDTO) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      // Certifique-se de adicionar o ID da empresa
      const enrichedData = {
        ...data,
        empresa: companyId,
      };

      return customProductsService.createCustomProduct(enrichedData);
    },
    onSuccess: () => {
      // Invalidar a lista de produtos personalizados
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao criar produto personalizado:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCustomProductDTO;
    }) => {
      return customProductsService.updateCustomProduct(id, data);
    },
    onSuccess: () => {
      // Invalidar a lista de produtos personalizados
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar produto personalizado:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customProductsService.deleteCustomProduct(id),
    onSuccess: () => {
      // Invalidar a lista de produtos personalizados
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir produto personalizado:", error);
    },
  });

  return {
    customProducts: Array.isArray(customProducts) ? customProducts : [],
    isLoading,
    createCustomProduct: createMutation.mutate,
    updateCustomProduct: updateMutation.mutate,
    deleteCustomProduct: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook para obter um produto personalizado específico por ID
export function useCustomProductById(id: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["custom-product", id],
    queryFn: () => (id ? customProductsService.getCustomProductById(id) : null),
    enabled: !!id,
  });

  const refetch = () => {
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({ queryKey: ["custom-product", id] });
    queryClient.invalidateQueries({ queryKey: ["custom-products"] });
  };

  return {
    customProduct: data,
    isLoading,
    error,
    refetch,
  };
}
