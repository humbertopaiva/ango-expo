// Path: src/features/shop-window/view-models/vitrine.view-model.interface.ts
import {
  VitrineProduto,
  VitrineLink,
  VitrineProdutoFormData,
  VitrineLinkFormData,
} from "../models";

export interface IVitrineViewModel {
  // Estados
  vitrineProdutos: VitrineProduto[];
  vitrineLinks: VitrineLink[];
  selectedProduct: VitrineProduto | null;
  selectedLink: VitrineLink | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isReorderingProdutos: boolean;
  isReorderingLinks: boolean;

  // Novo: estados adicionais para controle de reordenação local
  isEditingProductsOrder: boolean;
  isEditingLinksOrder: boolean;

  // Estados de modais
  isCreateProductOpen: boolean;
  isCreateLinkOpen: boolean;
  isDeleteOpen: boolean;
  isEditProductOpen: boolean;
  isEditLinkOpen: boolean;

  // Setters
  setIsCreateProductOpen: (isOpen: boolean) => void;
  setIsCreateLinkOpen: (isOpen: boolean) => void;
  setIsDeleteOpen: (isOpen: boolean) => void;
  setIsEditProductOpen: (isOpen: boolean) => void;
  setIsEditLinkOpen: (isOpen: boolean) => void;

  // Novo: setters para controle de reordenação
  setIsEditingProductsOrder: (isEditing: boolean) => void;
  setIsEditingLinksOrder: (isEditing: boolean) => void;

  // Handlers
  handleProductSubmit: (data: VitrineProdutoFormData) => void;
  handleLinkSubmit: (data: VitrineLinkFormData) => void;
  handleProductDelete: (produto: VitrineProduto) => void;
  handleLinkDelete: (link: VitrineLink) => void;
  handleProductEdit: (produto: VitrineProduto) => void;
  handleLinkEdit: (link: VitrineLink) => void;
  handleConfirmDelete: () => void;
  closeModals: () => void;

  // Handlers de reordenação
  handleProductReorder: (produtos: VitrineProduto[]) => void;
  handleLinkReorder: (links: VitrineLink[]) => void;
}
