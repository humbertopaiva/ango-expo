// Path: src/features/products/view-models/products.view-model.ts
import { useState, useCallback } from "react";
import { Product } from "../models/product";
import { useProducts } from "../hooks/use-products";
import { ProductFormData } from "../schemas/product.schema";
import { IProductsViewModel } from "./products.view-model.interface";
import { router } from "expo-router";
import { useToast } from "@/src/hooks/use-toast";

export function useProductsViewModel(): IProductsViewModel {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

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
        await createProduct({
          ...data,
          estoque: 0, // valor padrão inicial
        });
        setIsFormVisible(false);
        toast?.show({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
          type: "success",
        });
      } catch (error) {
        console.error("Error creating product:", error);
        toast?.show({
          title: "Erro",
          description: "Não foi possível criar o produto. Tente novamente.",
          type: "error",
        });
      }
    },
    [createProduct, toast]
  );

  const handleUpdateProduct = useCallback(
    async (id: string, data: ProductFormData) => {
      try {
        await updateProduct({ id, data });
        setSelectedProduct(null);
        setIsEditFormVisible(false);
        toast?.show({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
          type: "success",
        });
      } catch (error) {
        console.error("Error updating product:", error);
        toast?.show({
          title: "Erro",
          description: "Não foi possível atualizar o produto. Tente novamente.",
          type: "error",
        });
      }
    },
    [updateProduct, toast]
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
        toast?.show({
          title: "Sucesso",
          description: "Produto excluído com sucesso!",
          type: "success",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast?.show({
          title: "Erro",
          description: "Não foi possível excluir o produto. Tente novamente.",
          type: "error",
        });
      }
    },
    [deleteProduct, toast]
  );

  // Função para cancelar a exclusão
  const cancelDeleteProduct = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  }, []);

  // Função para abrir modal de criação
  const openCreateProductModal = useCallback(() => {
    setSelectedProduct(null);
    setIsFormVisible(true);
  }, []);

  // Função para abrir modal de edição
  const openEditProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsEditFormVisible(true);
  }, []);

  // Função para fechar modais
  const closeModals = useCallback(() => {
    setIsFormVisible(false);
    setIsEditFormVisible(false);
    setSelectedProduct(null);
  }, []);

  return {
    products: filteredProducts,
    isLoading,
    selectedProduct,
    isFormVisible,
    isEditFormVisible,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    isDeleteDialogOpen,
    productToDelete,
    setSearchTerm,
    setSelectedProduct,
    setIsFormVisible,
    setIsEditFormVisible,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    confirmDeleteProduct,
    cancelDeleteProduct,
    openCreateProductModal,
    openEditProductModal,
    closeModals,
  };
}
