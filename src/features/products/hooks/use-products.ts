// Path: src/features/products/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import { CreateProductDTO, UpdateProductDTO } from "../models/product";
import useAuthStore from "@/src/stores/auth";
import { invalidateProductQueries } from "../utils/query-utils";

export function useProducts() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  const queryKey = ["products", companyId];

  const { data: products = [], isLoading } = useQuery({
    queryKey,
    queryFn: productService.getProducts,
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<CreateProductDTO, "empresa">) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      // Transformar dados antes de enviar
      const transformedData = {
        ...data,
        empresa: companyId,
        variacao: data.variacao || null,
      };

      return productService.createProduct(transformedData);
    },
    onSuccess: (newProduct) => {
      // Apenas invalidar a lista de produtos
      invalidateProductQueries(queryClient, undefined, {
        invalidateList: true,
        invalidateDetails: false,
        invalidateVariations: false,
        refetch: false,
      });
    },
    onError: (error: any) => {
      console.error("Erro ao criar produto:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDTO }) => {
      // Transformar dados antes de enviar
      const transformedData = {
        ...data,
        variacao: data.variacao || null,
      };

      return productService.updateProduct(id, transformedData);
    },
    onSuccess: (updatedProduct, variables) => {
      // Invalidar apenas o produto específico
      invalidateProductQueries(queryClient, variables.id, {
        invalidateList: true,
        invalidateDetails: true,
        invalidateVariations: false,
        refetch: false,
      });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar produto:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: (_, deletedProductId) => {
      // Apenas invalidar a lista de produtos
      invalidateProductQueries(queryClient, undefined, {
        invalidateList: true,
        invalidateDetails: false,
        invalidateVariations: false,
        refetch: false,
      });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir produto:", error);
    },
  });

  // Função auxiliar para verificar se um produto tem variação
  const hasVariation = (product: any): boolean => {
    return !!product.variacao;
  };

  return {
    products: Array.isArray(products) ? products : [],
    isLoading,
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    hasVariation,
  };
}
