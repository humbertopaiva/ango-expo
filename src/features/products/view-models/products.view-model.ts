// src/features/products/view-models/products.view-model.ts
import { useState, useCallback, useMemo } from "react";
import { Product } from "../models/product";
import { useProducts } from "../hooks/use-products";
import { IProductsViewModel } from "./products.view-model.interface";
import { useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

export function useProductsViewModel(): IProductsViewModel {
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  // Estados para o diálogo de confirmação
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

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

  // Função para filtrar os produtos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtro de busca
      const matchesSearch = product.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filtro de categoria
      const matchesCategory =
        selectedCategoryId === null || product.categoria === selectedCategoryId;

      // Produto é exibido se passar em ambos os filtros
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategoryId]);

  // Função para definir a categoria selecionada
  const setSelectedCategory = useCallback((categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  }, []);

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
        showSuccessToast(toast, "Produto excluído com sucesso");
      } catch (error) {
        console.error("Error deleting product:", error);
        showErrorToast(toast, "Não foi possível excluir o produto");
      }
    },
    [deleteProduct, toast]
  );

  // Função para cancelar a exclusão
  const cancelDeleteProduct = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  }, []);

  return {
    products: filteredProducts,
    filteredProducts,
    selectedCategoryId,
    isLoading,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    isDeleteDialogOpen,
    productToDelete,
    setSearchTerm,
    setSelectedCategory,
    confirmDeleteProduct,
    cancelDeleteProduct,
    handleDeleteProduct,
  };
}
