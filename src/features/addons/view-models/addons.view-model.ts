// Path: src/features/addons/view-models/addons.view-model.ts
import { useState, useCallback, useMemo } from "react";
import { useAddons } from "../hooks/use-addons";
import { useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { IAddonsViewModel } from "./addons.view-model.interface";
import { AddonsList } from "../models/addon";

export function useAddonsViewModel(): IAddonsViewModel {
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  // Estados para o diálogo de confirmação
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addonsToDelete, setAddonsToDelete] = useState<string | null>(null);

  // Estado para rastreamento de carregamento
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    addonsList,
    isLoading,
    createAddonsList,
    updateAddonsList,
    deleteAddonsList,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAddons();

  // Função para filtrar adicionais
  const filteredAddonsList = useMemo(() => {
    return addonsList.filter((addon) => {
      // Filtro de busca
      const matchesSearch = addon.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [addonsList, searchTerm]);

  // Funções para ordenar a lista de adicionais
  const sortedAddonsList = useMemo(() => {
    return [...filteredAddonsList].sort((a, b) => {
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
  }, [filteredAddonsList]);

  // Função para abrir o diálogo de confirmação
  const confirmDeleteAddonsList = useCallback((id: string) => {
    setAddonsToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  // Função para atualizar dados
  const refreshAddonsList = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Aguarda a recarga dos dados
      await new Promise((resolve) => setTimeout(resolve, 500));
      showSuccessToast(toast, "Lista de adicionais atualizada");
    } catch (error) {
      console.error("Erro ao atualizar listas de adicionais:", error);
      showErrorToast(toast, "Erro ao atualizar dados");
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  // Função para excluir após confirmação
  const handleDeleteAddonsList = useCallback(
    async (id: string) => {
      try {
        await deleteAddonsList(id);
        setIsDeleteDialogOpen(false);
        setAddonsToDelete(null);
        showSuccessToast(toast, "Lista de adicionais excluída com sucesso");
      } catch (error) {
        console.error("Erro ao excluir lista de adicionais:", error);
        showErrorToast(toast, "Não foi possível excluir a lista de adicionais");
      }
    },
    [deleteAddonsList, toast]
  );

  // Função para cancelar exclusão
  const cancelDeleteAddonsList = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setAddonsToDelete(null);
  }, []);

  return {
    addonsList,
    filteredAddonsList: sortedAddonsList,
    isLoading,
    isRefreshing,
    searchTerm,
    isCreating,
    isUpdating,
    isDeleting,
    isDeleteDialogOpen,
    addonsToDelete,
    setSearchTerm,
    confirmDeleteAddonsList,
    cancelDeleteAddonsList,
    handleDeleteAddonsList,
    refreshAddonsList,
  };
}
