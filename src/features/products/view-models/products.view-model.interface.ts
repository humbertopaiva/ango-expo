import { Product } from "../models/product";
import { ProductFormData } from "../schemas/product.schema";

export interface IProductsViewModel {
  // Estados
  products: Product[];
  isLoading: boolean;
  selectedProduct: Product | null;
  isFormVisible: boolean;
  searchTerm: string;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Setters
  setSearchTerm: (term: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsFormVisible: (visible: boolean) => void;

  // Handlers
  handleCreateProduct: (data: ProductFormData) => Promise<void>;
  handleUpdateProduct: (id: string, data: ProductFormData) => Promise<void>;
  handleDeleteProduct: (id: string) => Promise<void>;
}
