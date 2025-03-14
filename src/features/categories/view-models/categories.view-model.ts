// Path: src/features/categories/view-models/categories.view-model.ts
import { useState, useCallback } from "react";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category";
import { useCategories } from "../hooks/use-categories";
import { ICategoriesViewModel } from "./categories.view-model.interface";
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

  // Estados para o diálogo de confirmação
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
    getCategoryById,
  } = useCategories();

  const filteredCategories = categories.filter((category) =>
    category.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para carregar detalhes de uma categoria por ID
  const loadCategoryDetails = useCallback(
    async (id: string) => {
      try {
        const category = await getCategoryById(id);
        if (category) {
          setSelectedCategory(category);
        }
        return category;
      } catch (error) {
        console.error("Erro ao carregar detalhes da categoria:", error);
        showErrorToast(
          toast,
          "Não foi possível carregar os detalhes da categoria"
        );
        return null;
      }
    },
    [getCategoryById, toast]
  );

  const handleCreateCategory = useCallback(
    async (data: Omit<CreateCategoryDTO, "empresa">) => {
      try {
        await createCategory(data);
        showSuccessToast(toast, "Categoria criada com sucesso!");
        return true;
      } catch (error) {
        console.error("Error creating category:", error);
        showErrorToast(toast, "Não foi possível criar a categoria");
        return false;
      }
    },
    [createCategory, toast]
  );

  const handleUpdateCategory = useCallback(
    async (id: string, data: UpdateCategoryDTO) => {
      try {
        await updateCategory({ id, data });
        showSuccessToast(toast, "Categoria atualizada com sucesso!");
        return true;
      } catch (error) {
        console.error("Error updating category:", error);
        showErrorToast(toast, "Não foi possível atualizar a categoria");
        return false;
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
        return true;
      } catch (error) {
        console.error("Error deleting category:", error);
        showErrorToast(toast, "Não foi possível excluir a categoria");
        return false;
      }
    },
    [deleteCategory, toast]
  );

  // Função para cancelar a exclusão
  const cancelDeleteProduct = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  }, []);

  // Função para abrir o modal de criação
  const openCreateCategoryModal = useCallback(() => {
    setSelectedCategory(null);
    setIsFormVisible(true);
  }, []);

  // Função para abrir o modal de edição
  const openEditCategoryModal = useCallback((category: Category) => {
    setSelectedCategory(category);
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
    setSelectedCategory,
    setIsFormVisible,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    cancelDeleteCategory: cancelDeleteProduct,
    openCreateCategoryModal,
    openEditCategoryModal,
    loadCategoryDetails,
    setSearchTerm,
  };
}
