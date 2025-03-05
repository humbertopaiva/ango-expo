// src/features/leaflets/view-models/leaflets.view-model.ts
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
  } = useLeaflets();

  // Função para limpar todos os filtros
  const clearFilters = useCallback(() => {
    setSelectedCompany(null);
    setSelectedCategory(null);
    setSearchTerm("");
  }, [setSelectedCompany, setSelectedCategory, setSearchTerm]);

  return {
    leaflets,
    companies,
    categories,
    selectedCompany,
    selectedCategory,
    searchTerm,
    isLoading,
    setSelectedCompany,
    setSelectedCategory,
    setSearchTerm,
    clearFilters,
  };
}
