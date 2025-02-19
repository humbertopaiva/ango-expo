// src/features/categories/hooks/use-categories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../models/category";
import useAuthStore from "@/src/stores/auth";

export function useCategories() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  const queryKey = ["categories", companyId];

  const { data: categories = [], isLoading } = useQuery({
    queryKey,
    queryFn: categoryService.getCategories,
    enabled: !!companyId,
  });

  interface CreateCategoryMutationVariables {
    data: Omit<CreateCategoryDTO, "empresa">;
  }

  interface UpdateCategoryMutationVariables {
    id: string;
    data: UpdateCategoryDTO;
  }

  const createMutation = useMutation<
    void,
    Error,
    CreateCategoryMutationVariables
  >({
    mutationFn: ({ data }: CreateCategoryMutationVariables) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      return categoryService
        .createCategory({
          ...data,
          empresa: companyId,
        })
        .then(() => {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      // Aqui você pode adicionar um Toast de sucesso
    },
    onError: (error: any) => {
      console.error("Erro ao criar categoria:", error);
      // Aqui você pode adicionar um Toast de erro
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDTO }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      // Toast de sucesso
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar categoria:", error);
      // Toast de erro
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      // Toast de sucesso
    },
    onError: (error: any) => {
      console.error("Erro ao excluir categoria:", error);
      // Toast de erro
    },
  });

  return {
    categories: Array.isArray(categories) ? categories : [],
    isLoading,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
