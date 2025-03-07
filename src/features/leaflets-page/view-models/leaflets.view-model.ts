// Path: src/features/leaflets-page/view-models/leaflets.view-model.ts

import { useCallback } from "react";
import { useLeaflets } from "../hooks/use-leaflets";
import { ILeafletsViewModel } from "./leaflets.view-model.interface";

export function useLeafletsViewModel(): ILeafletsViewModel {
  const {
    leaflets,
    companies,
    categories,
    selectedCompany,
    setSelectedCompany,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    isLoading,
    categorizedLeaflets,
    activeCategories,
    toggleCategoryFilter,
    selectAllCategories,
    clearCategoryFilters,
  } = useLeaflets();

  // Função para limpar todos os filtros
  const clearFilters = useCallback(() => {
    setSelectedCompany(null);
    setSelectedCategory(null);
    setSearchTerm("");
    selectAllCategories();
  }, [
    setSelectedCompany,
    setSelectedCategory,
    setSearchTerm,
    selectAllCategories,
  ]);

  return {
    leaflets,
    companies,
    categories,
    selectedCompany,
    selectedCategory,
    searchTerm,
    isLoading,
    categorizedLeaflets,
    activeCategories,
    setSelectedCompany,
    setSelectedCategory,
    setSearchTerm,
    toggleCategoryFilter,
    selectAllCategories,
    clearCategoryFilters,
    clearFilters,
  };
}
