// src/features/categories/view-models/categories.view-model.ts

import { useState, useCallback } from "react";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category";
import { useCategories } from "../hooks/use-categories";
import { ICategoriesViewModel } from "./categories.view-model.interface";
import { router } from "expo-router";
import { useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

export function useCategoriesViewModel(): ICategoriesViewModel {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  // Novos estados para o diálogo de confirmação
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories();

  const filteredCategories = categories.filter((category) =>
    category.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = useCallback(
    async (data: Omit<CreateCategoryDTO, "empresa">) => {
      try {
        await createCategory({ data });
        setIsFormVisible(false);
        showSuccessToast(toast, "Categoria criada com sucesso!");
      } catch (error) {
        console.error("Error creating category:", error);
        showErrorToast(toast, "Não foi possível criar a categoria");
      }
    },
    [createCategory, toast]
  );

  const handleUpdateCategory = useCallback(
    async (id: string, data: UpdateCategoryDTO) => {
      try {
        await updateCategory({ id, data });
        setSelectedCategory(null);
        setIsFormVisible(false);
        showSuccessToast(toast, "Categoria atualizada com sucesso!");
        // Navegar de volta para a listagem após atualização
        router.push("/admin/categories");
      } catch (error) {
        console.error("Error updating category:", error);
        showErrorToast(toast, "Não foi possível atualizar a categoria");
      }
    },
    [updateCategory, toast]
  );

  // Função para abrir o diálogo de confirmação
  const confirmDeleteCategory = useCallback((id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  // Função de exclusão real que será chamada após a confirmação
  const handleDeleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteCategory(id);
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
        showSuccessToast(toast, "Categoria excluída com sucesso");
      } catch (error) {
        console.error("Error deleting category:", error);
        showErrorToast(toast, "Não foi possível excluir a categoria");
      }
    },
    [deleteCategory, toast]
  );

  // Função para cancelar a exclusão
  const cancelDeleteCategory = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  }, []);

  // Função para abrir o modal de criação
  const openCreateCategoryModal = useCallback(() => {
    setSelectedCategory(null);
    setIsFormVisible(true);
  }, []);

  return {
    categories: filteredCategories,
    isLoading,
    selectedCategory,
    isFormVisible,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    isDeleteDialogOpen,
    categoryToDelete,
    setSearchTerm,
    setSelectedCategory,
    setIsFormVisible,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    cancelDeleteCategory,
    openCreateCategoryModal,
  };
}
