// Path: src/features/leaflets-page/view-models/leaflets.view-model.interface.ts

import { Category, Company, Leaflet } from "../models/leaflet";

export interface LeafletCategory {
  id: string;
  name: string;
  slug: string;
  leaflets: Leaflet[];
}

export interface ILeafletsViewModel {
  // Estados existentes
  leaflets: Leaflet[];
  companies: Company[];
  categories: Category[];
  selectedCompany: string | null;
  selectedCategory: string | null;
  searchTerm: string;
  isLoading: boolean;

  // Novos estados
  categorizedLeaflets: LeafletCategory[];
  activeCategories: string[]; // IDs das categorias selecionadas

  // Setters existentes
  setSelectedCompany: (slug: string | null) => void;
  setSelectedCategory: (slug: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Novos setters
  toggleCategoryFilter: (categoryId: string) => void;
  selectAllCategories: () => void;
  clearCategoryFilters: () => void;

  // Helpers existentes
  clearFilters: () => void;

  allCategoriesSelected: boolean;
}
