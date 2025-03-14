// Path: src/features/categories/view-models/categories.view-model.interface.ts

import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category";

export interface ICategoriesViewModel {
  categories: Category[];
  isLoading: boolean;
  selectedCategory: Category | null;
  isFormVisible: boolean;
  searchTerm: string;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  isDeleteDialogOpen: boolean;
  categoryToDelete: string | null;

  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setIsFormVisible: (visible: boolean) => void;

  handleCreateCategory: (
    data: Omit<CreateCategoryDTO, "empresa">
  ) => Promise<boolean>;
  handleUpdateCategory: (
    id: string,
    data: UpdateCategoryDTO
  ) => Promise<boolean>;
  handleDeleteCategory: (id: string) => Promise<boolean>;

  confirmDeleteCategory: (id: string) => void;
  cancelDeleteCategory: () => void;

  openCreateCategoryModal: () => void;
  openEditCategoryModal: (category: Category) => void;

  loadCategoryDetails: (id: string) => Promise<Category | null>;
}
