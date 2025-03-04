// Path: src/features/categories/view-models/categories.view-model.interface.ts

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

  // Estado para controle de carregamento de imagem
  isImageLoading: boolean;

  // Setters existentes...
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setIsFormVisible: (visible: boolean) => void;

  // Novo setter para estado de carregamento de imagem
  setImageLoadingState: (isLoading: boolean) => void;

  // Handlers existentes e novos...
  handleCreateCategory: (
    data: Omit<CreateCategoryDTO, "empresa">
  ) => Promise<boolean>;
  handleUpdateCategory: (
    id: string,
    data: UpdateCategoryDTO
  ) => Promise<boolean>;
  handleDeleteCategory: (id: string) => Promise<boolean>;

  // Novos handlers para confirmação
  confirmDeleteCategory: (id: string) => void;
  cancelDeleteCategory: () => void;

  // Funções para abrir modais
  openCreateCategoryModal: () => void;
  openEditCategoryModal: (category: Category) => void;

  // Função para carregar detalhes de categoria
  loadCategoryDetails: (id: string) => Promise<Category | null>;
}
