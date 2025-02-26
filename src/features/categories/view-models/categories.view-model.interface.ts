// src/features/categories/view-models/categories.view-model.interface.ts

import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../models/category";

export interface ICategoriesViewModel {
  // Estados existentes...
  categories: Category[];
  isLoading: boolean;
  selectedCategory: Category | null;
  isFormVisible: boolean;
  searchTerm: string;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Novos estados para o diálogo de confirmação
  isDeleteDialogOpen: boolean;
  categoryToDelete: string | null;

  // Setters existentes...
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setIsFormVisible: (visible: boolean) => void;

  // Handlers existentes e novos...
  handleCreateCategory: (
    data: Omit<CreateCategoryDTO, "empresa">
  ) => Promise<void>;
  handleUpdateCategory: (id: string, data: UpdateCategoryDTO) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;

  // Novos handlers para confirmação
  confirmDeleteCategory: (id: string) => void;
  cancelDeleteCategory: () => void;

  // Novo handler para abrir modal de criação
  openCreateCategoryModal: () => void;
}
