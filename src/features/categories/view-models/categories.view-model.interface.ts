// src/features/categories/view-models/categories.view-model.interface.ts
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category";

export interface ICategoriesViewModel {
  // Estados
  categories: Category[];
  isLoading: boolean;
  selectedCategory: Category | null;
  isFormVisible: boolean;
  searchTerm: string;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Setters
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setIsFormVisible: (visible: boolean) => void;

  // Handlers
  handleCreateCategory: (
    data: Omit<CreateCategoryDTO, "empresa">
  ) => Promise<void>;
  handleUpdateCategory: (id: string, data: UpdateCategoryDTO) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;
}
