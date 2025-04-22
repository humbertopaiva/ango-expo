// Path: src/features/products/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import { CreateProductDTO, UpdateProductDTO } from "../models/product";
import useAuthStore from "@/src/stores/auth";

export function useProducts() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  const queryKey = ["products", companyId];

  const { data: products = [], isLoading } = useQuery({
    queryKey,
    queryFn: productService.getProducts,
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<CreateProductDTO, "empresa">) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      // Transformar dados antes de enviar
      const transformedData = {
        ...data,
        empresa: companyId,
        // Se o produto não tem variação (is_variacao_enabled = false), então variacao deve ser null
        variacao: data.variacao || null,
      };

      return productService.createProduct(transformedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
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
        // Se o produto não tem variação (is_variacao_enabled = false), então variacao deve ser null
        variacao: data.variacao || null,
      };

      return productService.updateProduct(id, transformedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar produto:", error);
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
    deleteProduct: productService.deleteProduct,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    hasVariation, // Adicionar função auxiliar
  };
}
