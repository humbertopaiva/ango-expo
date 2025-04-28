// Path: src/features/company-page/stores/category-filter.store.ts
import { create } from "zustand";

// Constante para a categoria "Todos"
const ALL_CATEGORIES = "Todos";

export interface CategoryFilterState {
  // State
  categories: string[];
  selectedCategory: string | null;
  isVisible: boolean;
  productCounts: Record<string, number>; // Track product counts per category

  // Actions
  setCategories: (categories: string[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setIsVisible: (isVisible: boolean) => void;
  updateProductCounts: (counts: Record<string, number>) => void;
  reset: () => void;
}

export const useCategoryFilterStore = create<CategoryFilterState>((set) => ({
  // Initial state
  categories: [],
  selectedCategory: ALL_CATEGORIES,
  isVisible: true,
  productCounts: {},

  // Actions
  setCategories: (categories) => set({ categories }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setIsVisible: (isVisible) => set({ isVisible }),
  updateProductCounts: (counts) => set({ productCounts: counts }),
  reset: () =>
    set({
      categories: [],
      selectedCategory: ALL_CATEGORIES,
      isVisible: true,
      productCounts: {},
    }),
}));
