// src/features/products/view-models/products.view-model.ts
import { useState, useCallback } from "react";
import { Product } from "../models/product";
import { useProducts } from "../hooks/use-products";
import { ProductFormData } from "../schemas/product.schema";
import { IProductsViewModel } from "./products.view-model.interface";
import { useToast } from "@/src/hooks/use-toast";

export function useProductsViewModel(): IProductsViewModel {
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

  return {
    products: filteredProducts,
    isLoading,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    isDeleteDialogOpen,
    productToDelete,
    setSearchTerm,
    handleDeleteProduct,
    confirmDeleteProduct,
    cancelDeleteProduct,
  };
}
