// Path: src/features/company-page/stores/category-filter.store.ts
import { create } from "zustand";

export interface CategoryFilterState {
  // State
  categories: string[];
  selectedCategory: string | null;
  isVisible: boolean;

  // Actions
  setCategories: (categories: string[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setIsVisible: (isVisible: boolean) => void;
}

export const useCategoryFilterStore = create<CategoryFilterState>((set) => ({
  // Initial state
  categories: [],
  selectedCategory: "Todos",
  isVisible: true,

  // Actions
  setCategories: (categories) => set({ categories }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setIsVisible: (isVisible) => set({ isVisible }),
}));
