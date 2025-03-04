// Path: src/features/categories/hooks/use-categories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  Category,
} from "../models/category";
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
    staleTime: 1000 * 60, // 1 minuto
  });

  const getCategoryById = async (id: string) => {
    if (!id || !companyId) return null;

    try {
      // Primeiro, tenta encontrar nos dados já carregados
      const existingCategory = categories.find((cat) => cat.id === id);
      if (existingCategory) {
        return existingCategory;
      }

      // Se não encontrar, busca do servidor
      return await categoryService.getCategoryById(id);
    } catch (error) {
      console.error(`Erro ao buscar categoria ${id}:`, error);
      return null;
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: Omit<CreateCategoryDTO, "empresa">) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      return categoryService.createCategory({
        ...data,
        empresa: companyId,
      });
    },
    onSuccess: () => {
      // Invalidar a query para forçar recarregamento dos dados
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDTO }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      // Invalidar a query para forçar recarregamento dos dados
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      // Invalidar a query para forçar recarregamento dos dados
      queryClient.invalidateQueries({ queryKey });
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
    getCategoryById,
  };
}
