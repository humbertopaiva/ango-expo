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
    onSuccess: (newProduct) => {
      // Invalidar a query de produtos
      queryClient.invalidateQueries({ queryKey });

      // Invalidar a query de detalhes do produto, se o novo produto tiver um ID
      if (newProduct && newProduct.id) {
        queryClient.invalidateQueries({
          queryKey: ["product-details", newProduct.id],
        });
      }

      // Se o produto tem variação, invalidar as queries relacionadas a variações
      if (newProduct && newProduct.variacao) {
        queryClient.invalidateQueries({
          queryKey: ["product-variation-items", newProduct.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["product-variation-items"],
        });
      }
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
    onSuccess: (updatedProduct, variables) => {
      // Invalidar a query de produtos
      queryClient.invalidateQueries({ queryKey });

      // Invalidar a query de detalhes do produto
      queryClient.invalidateQueries({
        queryKey: ["product-details", variables.id],
      });

      // Se o produto tem variação, invalidar as queries relacionadas a variações
      if (updatedProduct && updatedProduct.variacao) {
        queryClient.invalidateQueries({
          queryKey: ["product-variation-items", variables.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["product-variation-items"],
        });
      }
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar produto:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: (_, deletedProductId) => {
      // Invalidar a query de produtos
      queryClient.invalidateQueries({ queryKey });

      // Invalidar a query de detalhes do produto
      queryClient.invalidateQueries({
        queryKey: ["product-details", deletedProductId],
      });

      // Invalidar as queries relacionadas a variações do produto
      queryClient.invalidateQueries({
        queryKey: ["product-variation-items", deletedProductId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-variation-items"],
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
    hasVariation, // Adicionar função auxiliar
  };
}
