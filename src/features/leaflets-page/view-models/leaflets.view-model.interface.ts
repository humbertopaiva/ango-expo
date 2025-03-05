// src/features/leaflets/view-models/leaflets.view-model.interface.ts
import { Leaflet, Company, Category } from "../models/leaflet";

export interface ILeafletsViewModel {
  // Estados
  leaflets: Leaflet[];
  companies: Company[];
  categories: Category[];
  selectedCompany: string | null;
  selectedCategory: string | null;
  searchTerm: string;
  isLoading: boolean;

  // Setters
  setSelectedCompany: (slug: string | null) => void;
  setSelectedCategory: (slug: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Helpers
  clearFilters: () => void;
}
