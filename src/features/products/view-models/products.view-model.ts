// src/features/products/view-models/products.view-model.ts
import { useState, useCallback } from "react";
import { Product } from "../models/product";
import { useProducts } from "../hooks/use-products";
import { ProductFormData } from "../schemas/product.schema";
import { IProductsViewModel } from "./products.view-model.interface";

export function useProductsViewModel(): IProductsViewModel {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para o diálogo de confirmação
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

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

  // Função para abrir o diálogo de confirmação
  const confirmDeleteProduct = useCallback((id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  // Função de exclusão real que será chamada após a confirmação
  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteProduct(id);
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    [deleteProduct]
  );

  // Função para cancelar a exclusão
  const cancelDeleteProduct = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  }, []);

  return {
    products: filteredProducts,
    isLoading,
    selectedProduct,
    isFormVisible,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    isDeleteDialogOpen,
    productToDelete,
    setSearchTerm,
    setSelectedProduct,
    setIsFormVisible,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    confirmDeleteProduct,
    cancelDeleteProduct,
  };
}
