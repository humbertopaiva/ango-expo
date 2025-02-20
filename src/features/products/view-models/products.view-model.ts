import { useState, useCallback } from "react";
import { Product } from "../models/product";
import { useProducts } from "../hooks/use-products";

import { ProductFormData } from "../schemas/product.schema";
import { IProductsViewModel } from "./products.view-model.interface";

export function useProductsViewModel(): IProductsViewModel {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProducts();

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = useCallback(
    async (data: ProductFormData) => {
      try {
        createProduct({
          ...data,
          estoque: 0, // valor padrão inicial
        });
        setIsFormVisible(false);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    },
    [createProduct]
  );

  const handleUpdateProduct = useCallback(
    async (id: string, data: ProductFormData) => {
      try {
        await updateProduct({ id, data });
        setSelectedProduct(null);
        setIsFormVisible(false);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
    [updateProduct]
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    [deleteProduct]
  );

  return {
    products: filteredProducts,
    isLoading,
    selectedProduct,
    isFormVisible,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    setSearchTerm,
    setSelectedProduct,
    setIsFormVisible,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
}
