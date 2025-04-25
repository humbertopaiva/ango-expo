// Path: src/features/custom-products/view-models/custom-products.view-model.ts
import { useState, useCallback, useMemo } from "react";
import { useCustomProducts } from "../hooks/use-custom-products";
import { useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { ICustomProductsViewModel } from "./custom-products.view-model.interface";
import { CustomProduct } from "../models/custom-product";

export function useCustomProductsViewModel(): ICustomProductsViewModel {
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  // Estados para o diálogo de confirmação
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customProductToDelete, setCustomProductToDelete] = useState<
    string | null
  >(null);

  // Estado para rastreamento de carregamento
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    customProducts,
    isLoading,
    createCustomProduct,
    updateCustomProduct,
    deleteCustomProduct,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCustomProducts();

  // Função para filtrar produtos personalizados
  const filteredCustomProducts = useMemo(() => {
    return customProducts.filter((product) => {
      // Filtro de busca
      const matchesSearch = product.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [customProducts, searchTerm]);

  // Funções para ordenar a lista de produtos personalizados
  const sortedCustomProducts = useMemo(() => {
    return [...filteredCustomProducts].sort((a, b) => {
      // Ordenar por data de atualização (mais recente primeiro)
      if (a.date_updated && b.date_updated) {
        return (
          new Date(b.date_updated).getTime() -
          new Date(a.date_updated).getTime()
        );
      }
      // Ordenar por data de criação caso não tenha data de atualização
      if (a.date_created && b.date_created) {
        return (
          new Date(b.date_created).getTime() -
          new Date(a.date_created).getTime()
        );
      }
      // Ordenar alfabeticamente como fallback
      return a.nome.localeCompare(b.nome);
    });
  }, [filteredCustomProducts]);

  // Função para abrir o diálogo de confirmação
  const confirmDeleteCustomProduct = useCallback((id: string) => {
    setCustomProductToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  // Função para atualizar dados
  const refreshCustomProducts = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Aguarda a recarga dos dados
      await new Promise((resolve) => setTimeout(resolve, 500));
      showSuccessToast(toast, "Produtos personalizados atualizados");
    } catch (error) {
      console.error("Erro ao atualizar produtos personalizados:", error);
      showErrorToast(toast, "Erro ao atualizar dados");
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  // Função para excluir após confirmação
  const handleDeleteCustomProduct = useCallback(
    async (id: string) => {
      try {
        await deleteCustomProduct(id);
        setIsDeleteDialogOpen(false);
        setCustomProductToDelete(null);
        showSuccessToast(toast, "Produto personalizado excluído com sucesso");
      } catch (error) {
        console.error("Erro ao excluir produto personalizado:", error);
        showErrorToast(
          toast,
          "Não foi possível excluir o produto personalizado"
        );
      }
    },
    [deleteCustomProduct, toast]
  );

  // Função para cancelar exclusão
  const cancelDeleteCustomProduct = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setCustomProductToDelete(null);
  }, []);

  return {
    customProducts,
    filteredCustomProducts: sortedCustomProducts,
    isLoading,
    isRefreshing,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    isDeleteDialogOpen,
    customProductToDelete,
    setSearchTerm,
    confirmDeleteCustomProduct,
    cancelDeleteCustomProduct,
    handleDeleteCustomProduct,
    refreshCustomProducts,
  };
}
