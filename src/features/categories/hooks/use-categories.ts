// Path: src/features/categories/hooks/use-categories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  Category,
} from "../models/category";
import useAuthStore from "@/src/stores/auth";
import { useState } from "react";

export function useCategories() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();
  const [categoryDetails, setCategoryDetails] = useState<Category | null>(null);

  const queryKey = ["categories", companyId];

  const { data: categories = [], isLoading } = useQuery({
    queryKey,
    queryFn: categoryService.getCategories,
    enabled: !!companyId,
  });

  // Nova query para obter uma categoria específica pelo ID
  const getCategoryById = async (id: string) => {
    if (!id || !companyId) return null;

    try {
      // Primeiro, tenta encontrar nos dados já carregados
      const existingCategory = categories.find((cat) => cat.id === id);
      if (existingCategory) {
        setCategoryDetails(existingCategory);
        return existingCategory;
      }

      // Se não encontrar, busca do servidor
      const category = await categoryService.getCategoryById(id);
      setCategoryDetails(category);
      return category;
    } catch (error) {
      console.error(`Erro ao buscar categoria ${id}:`, error);
      return null;
    }
  };

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
    },
    onError: (error: any) => {
      console.error("Erro ao criar categoria:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDTO }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setCategoryDetails(null); // Limpa os detalhes em cache
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar categoria:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir categoria:", error);
    },
  });

  return {
    categories: Array.isArray(categories) ? categories : [],
    categoryDetails,
    isLoading,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    getCategoryById,
  };
}
