// Path: src/features/custom-products/view-models/custom-products.view-model.interface.ts
import { CustomProduct } from "../models/custom-product";

export interface ICustomProductsViewModel {
  // Estados
  customProducts: CustomProduct[];
  isLoading: boolean;
  isRefreshing: boolean;
  searchTerm: string;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isDeleteDialogOpen: boolean;
  customProductToDelete: string | null;

  // Setters
  setSearchTerm: (term: string) => void;

  // Handlers
  handleDeleteCustomProduct: (id: string) => Promise<void>;
  refreshCustomProducts: () => Promise<void>;

  // Filtered data
  filteredCustomProducts: CustomProduct[];

  // Confirmation dialog
  confirmDeleteCustomProduct: (id: string) => void;
  cancelDeleteCustomProduct: () => void;
}
