// src/features/products/view-models/products.view-model.interface.ts
import { Product } from "../models/product";

export interface IProductsViewModel {
  // Estados
  products: Product[];
  isLoading: boolean;
  searchTerm: string;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isDeleteDialogOpen: boolean;
  productToDelete: string | null;

  // Setters
  setSearchTerm: (term: string) => void;

  // Handlers
  handleDeleteProduct: (id: string) => Promise<void>;

  // Diálogo de confirmação
  confirmDeleteProduct: (id: string) => void;
  cancelDeleteProduct: () => void;
}
