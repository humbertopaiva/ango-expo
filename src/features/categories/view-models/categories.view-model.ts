// src/features/categories/view-models/categories.view-model.ts
import { useState, useCallback } from "react";
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category";
import { useCategories } from "../hooks/use-categories";
import { ICategoriesViewModel } from "./categories.view-model.interface";

export function useCategoriesViewModel(): ICategoriesViewModel {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        createCategory({ data });
        setIsFormVisible(false);
      } catch (error) {
        console.error("Error creating category:", error);
      }
    },
    [createCategory]
  );

  const handleUpdateCategory = useCallback(
    async (id: string, data: UpdateCategoryDTO) => {
      try {
        await updateCategory({ id, data });
        setSelectedCategory(null);
        setIsFormVisible(false);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    },
    [updateCategory]
  );

  const handleDeleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    },
    [deleteCategory]
  );

  return {
    categories: filteredCategories,
    isLoading,
    selectedCategory,
    isFormVisible,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    setSearchTerm,
    setSelectedCategory,
    setIsFormVisible,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  };
}
