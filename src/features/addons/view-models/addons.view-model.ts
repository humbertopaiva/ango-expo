// Path: src/features/addons/view-models/addons.view-model.ts
import { useState, useCallback, useMemo } from "react";

import { useAddons } from "../hooks/use-addons";

import { useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { IAddonsViewModel } from "./addons.view-model.interface";

export function useAddonsViewModel(): IAddonsViewModel {
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  // States for confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addonsToDelete, setAddonsToDelete] = useState<string | null>(null);

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

  // Function to filter addons
  const filteredAddonsList = useMemo(() => {
    return addonsList.filter((addon) => {
      // Search filter
      const matchesSearch = addon.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [addonsList, searchTerm]);

  // Function to open confirmation dialog
  const confirmDeleteAddonsList = useCallback((id: string) => {
    setAddonsToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);

  // Function to delete after confirmation
  const handleDeleteAddonsList = useCallback(
    async (id: string) => {
      try {
        await deleteAddonsList(id);
        setIsDeleteDialogOpen(false);
        setAddonsToDelete(null);
        showSuccessToast(toast, "Lista de adicionais excluída com sucesso");
      } catch (error) {
        console.error("Error deleting addon list:", error);
        showErrorToast(toast, "Não foi possível excluir a lista de adicionais");
      }
    },
    [deleteAddonsList, toast]
  );

  // Function to cancel deletion
  const cancelDeleteAddonsList = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setAddonsToDelete(null);
  }, []);

  return {
    addonsList,
    filteredAddonsList,
    isLoading,
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
  };
}
