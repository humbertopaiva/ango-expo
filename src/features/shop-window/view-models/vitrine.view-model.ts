// Path: src/features/vitrine/view-models/vitrine.view-model.ts
import { useState, useCallback } from "react";
import { useVitrine } from "../hooks/use-vitrine";
import { IVitrineViewModel } from "./vitrine.view-model.interface";
import {
  VitrineProduto,
  VitrineLink,
  VitrineProdutoFormData,
  VitrineLinkFormData,
} from "../models";
import { Alert } from "react-native";

export function useVitrineViewModel(): IVitrineViewModel {
  const {
    vitrineProdutos,
    vitrineLinks,
    isLoadingProdutos,
    isLoadingLinks,
    createVitrineProduto,
    createVitrineLink,
    updateVitrineProduto,
    updateVitrineLink,
    deleteVitrineProduto,
    deleteVitrineLink,
    isCreatingProduto,
    isCreatingLink,
    isUpdatingProduto,
    isUpdatingLink,
    isDeletingProduto,
    isDeletingLink,
    reorderVitrineProdutos,
    reorderVitrineLinks,
    isReorderingProdutos,
    isReorderingLinks,
  } = useVitrine();

  const [state, setState] = useState({
    isCreateProductOpen: false,
    isCreateLinkOpen: false,
    isDeleteOpen: false,
    isEditProductOpen: false,
    isEditLinkOpen: false,
    selectedProduct: null as VitrineProduto | null,
    selectedLink: null as VitrineLink | null,
    selectedItem: null as VitrineProduto | VitrineLink | null,
  });

  const closeModals = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isCreateProductOpen: false,
      isCreateLinkOpen: false,
      isDeleteOpen: false,
      isEditProductOpen: false,
      isEditLinkOpen: false,
      selectedProduct: null,
      selectedLink: null,
      selectedItem: null,
    }));
  }, []);

  // Modal state setters
  const setIsCreateProductOpen = useCallback(
    (isOpen: boolean) => {
      if (vitrineProdutos.length >= 10 && isOpen) {
        Alert.alert(
          "Limite Excedido",
          "Você atingiu o limite máximo de 10 produtos na vitrine."
        );
        return;
      }
      setState((prev) => ({ ...prev, isCreateProductOpen: isOpen }));
      if (!isOpen) closeModals();
    },
    [vitrineProdutos.length, closeModals]
  );

  const setIsCreateLinkOpen = useCallback(
    (isOpen: boolean) => {
      setState((prev) => ({ ...prev, isCreateLinkOpen: isOpen }));
      if (!isOpen) closeModals();
    },
    [closeModals]
  );

  const setIsDeleteOpen = useCallback(
    (isOpen: boolean) => {
      setState((prev) => ({ ...prev, isDeleteOpen: isOpen }));
      if (!isOpen) closeModals();
    },
    [closeModals]
  );

  const setIsEditProductOpen = useCallback(
    (isOpen: boolean) => {
      setState((prev) => ({ ...prev, isEditProductOpen: isOpen }));
      if (!isOpen) closeModals();
    },
    [closeModals]
  );

  const setIsEditLinkOpen = useCallback(
    (isOpen: boolean) => {
      setState((prev) => ({ ...prev, isEditLinkOpen: isOpen }));
      if (!isOpen) closeModals();
    },
    [closeModals]
  );

  // Form handlers
  const handleProductSubmit = useCallback(
    async (data: VitrineProdutoFormData) => {
      try {
        if (state.selectedProduct) {
          await updateVitrineProduto({
            id: state.selectedProduct.id,
            data: {
              produto: data.produto,
              disponivel: data.disponivel ?? true,
              ordem: data.ordem,
              sort: data.sort,
            },
          });
        } else {
          const lastProduct = vitrineProdutos[vitrineProdutos.length - 1];
          const nextOrder = lastProduct
            ? String.fromCharCode(lastProduct.ordem.charCodeAt(0) + 1)
            : "A";

          await createVitrineProduto({
            produto: data.produto,
            disponivel: data.disponivel ?? true,
            ordem: nextOrder,
            sort: (vitrineProdutos.length + 1) * 10,
          });
        }
        closeModals();
      } catch (error) {
        Alert.alert(
          "Erro",
          error instanceof Error ? error.message : "Erro ao salvar produto"
        );
      }
    },
    [
      state.selectedProduct,
      createVitrineProduto,
      updateVitrineProduto,
      closeModals,
      vitrineProdutos,
    ]
  );

  const handleLinkSubmit = useCallback(
    async (data: VitrineLinkFormData) => {
      try {
        if (state.selectedLink) {
          await updateVitrineLink({
            id: state.selectedLink.id,
            data,
          });
        } else {
          await createVitrineLink(data);
        }
        closeModals();
      } catch (error) {
        Alert.alert(
          "Erro",
          error instanceof Error ? error.message : "Erro ao salvar link"
        );
      }
    },
    [state.selectedLink, createVitrineLink, updateVitrineLink, closeModals]
  );

  // Delete handlers
  const handleProductDelete = useCallback((produto: VitrineProduto) => {
    setState((prev) => ({
      ...prev,
      selectedItem: produto,
      isDeleteOpen: true,
    }));
  }, []);

  const handleLinkDelete = useCallback((link: VitrineLink) => {
    setState((prev) => ({
      ...prev,
      selectedItem: link,
      isDeleteOpen: true,
    }));
  }, []);

  // Edit handlers
  const handleProductEdit = useCallback((produto: VitrineProduto) => {
    setState((prev) => ({
      ...prev,
      selectedProduct: produto,
      isEditProductOpen: true,
    }));
  }, []);

  const handleLinkEdit = useCallback((link: VitrineLink) => {
    setState((prev) => ({
      ...prev,
      selectedLink: link,
      isEditLinkOpen: true,
    }));
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (state.selectedItem) {
        if ("produto" in state.selectedItem) {
          await deleteVitrineProduto(state.selectedItem.id);
        } else {
          await deleteVitrineLink(state.selectedItem.id);
        }
      }
      setState((prev) => ({
        ...prev,
        isDeleteOpen: false,
        selectedItem: null,
        selectedProduct: null,
        selectedLink: null,
      }));
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao excluir item"
      );
    }
  }, [state.selectedItem, deleteVitrineProduto, deleteVitrineLink]);

  // Reorder handlers
  const handleProductReorder = useCallback(
    (produtos: VitrineProduto[]) => {
      reorderVitrineProdutos(produtos);
    },
    [reorderVitrineProdutos]
  );

  const handleLinkReorder = useCallback(
    (links: VitrineLink[]) => {
      reorderVitrineLinks(links);
    },
    [reorderVitrineLinks]
  );

  return {
    vitrineProdutos,
    vitrineLinks,
    selectedProduct: state.selectedProduct,
    selectedLink: state.selectedLink,
    isLoading: isLoadingProdutos || isLoadingLinks,
    isCreating: isCreatingProduto || isCreatingLink,
    isUpdating: isUpdatingProduto || isUpdatingLink,
    isDeleting: isDeletingProduto || isDeletingLink,
    isReorderingProdutos,
    isReorderingLinks,

    isCreateProductOpen: state.isCreateProductOpen,
    isCreateLinkOpen: state.isCreateLinkOpen,
    isDeleteOpen: state.isDeleteOpen,
    isEditProductOpen: state.isEditProductOpen,
    isEditLinkOpen: state.isEditLinkOpen,

    setIsCreateProductOpen,
    setIsCreateLinkOpen,
    setIsDeleteOpen,
    setIsEditProductOpen,
    setIsEditLinkOpen,

    handleProductSubmit,
    handleLinkSubmit,
    handleProductDelete,
    handleLinkDelete,
    handleProductEdit,
    handleLinkEdit,
    handleConfirmDelete,
    closeModals,

    handleProductReorder,
    handleLinkReorder,
  };
}
