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

      return productService.createProduct({
        ...data,
        empresa: companyId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao criar produto:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDTO }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar produto:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir produto:", error);
    },
  });

  return {
    products: Array.isArray(products) ? products : [],
    isLoading,
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
