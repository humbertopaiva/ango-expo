// Path: src/features/shop-window/view-models/vitrine.view-model.ts

import { useState, useCallback } from "react";
import { useVitrine } from "../hooks/use-vitrine";
import { IVitrineViewModel } from "./vitrine.view-model.interface";
import {
  VitrineProduto,
  VitrineLink,
  VitrineProdutoFormData,
  VitrineLinkFormData,
} from "../models";
import { useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

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

  const toast = useToast(); // Use o toast do Gluestack

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
        showErrorToast(
          toast,
          "Você atingiu o limite máximo de 10 produtos na vitrine."
        );
        return;
      }
      setState((prev) => ({ ...prev, isCreateProductOpen: isOpen }));
      if (!isOpen) closeModals();
    },
    [vitrineProdutos.length, closeModals, toast]
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
          showSuccessToast(toast, "Produto atualizado com sucesso!");
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
          showSuccessToast(toast, "Produto adicionado com sucesso!");
        }
        closeModals();
      } catch (error) {
        showErrorToast(
          toast,
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
      toast,
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
          showSuccessToast(toast, "Link atualizado com sucesso!");
        } else {
          await createVitrineLink(data);
          showSuccessToast(toast, "Link adicionado com sucesso!");
        }
        closeModals();
      } catch (error) {
        showErrorToast(
          toast,
          error instanceof Error ? error.message : "Erro ao salvar link"
        );
      }
    },
    [
      state.selectedLink,
      createVitrineLink,
      updateVitrineLink,
      closeModals,
      toast,
    ]
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
          showSuccessToast(toast, "Produto removido com sucesso!");
        } else {
          await deleteVitrineLink(state.selectedItem.id);
          showSuccessToast(toast, "Link removido com sucesso!");
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
      showErrorToast(
        toast,
        error instanceof Error ? error.message : "Erro ao excluir item"
      );
    }
  }, [state.selectedItem, deleteVitrineProduto, deleteVitrineLink, toast]);

  // Reorder handlers
  const handleProductReorder = useCallback(
    async (produtos: VitrineProduto[]) => {
      try {
        // Atualize os valores de ordem e sort baseados na posição na lista
        const updatedProducts = produtos.map((produto, index) => ({
          ...produto,
          ordem: String.fromCharCode(65 + index), // A, B, C...
          sort: index + 1,
        }));

        await reorderVitrineProdutos(updatedProducts);
        showSuccessToast(toast, "Ordem dos produtos atualizada!");
      } catch (error) {
        showErrorToast(toast, "Erro ao reordenar produtos");
      }
    },
    [reorderVitrineProdutos, toast]
  );

  const handleLinkReorder = useCallback(
    async (links: VitrineLink[]) => {
      try {
        // Atualize os valores de ordem baseados na posição na lista
        const updatedLinks = links.map((link, index) => ({
          ...link,
          ordem: index + 1,
        }));

        await reorderVitrineLinks(updatedLinks);
        showSuccessToast(toast, "Ordem dos links atualizada!");
      } catch (error) {
        showErrorToast(toast, "Erro ao reordenar links");
      }
    },
    [reorderVitrineLinks, toast]
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
