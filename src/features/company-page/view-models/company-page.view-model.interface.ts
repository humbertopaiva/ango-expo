// Path: src/features/company-page/view-models/company-page.view-model.interface.ts
import { CompanyProfile } from "../models/company-profile";
import { CompanyProduct } from "../models/company-product";
import { CompanyConfig } from "../models/company-config";
import { ProductAddonList } from "../models/product-addon-list";
import { CustomProduct } from "../../custom-products/models/custom-product";

export interface CategoryFilterData {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export interface CartConfirmationData {
  productName: string;
  quantity: number;
  totalPrice: string;
  variationName?: string;
  customization?: {
    steps: Array<{
      name: string;
      items: string[];
    }>;
  };
  addonItems?: Array<{
    name: string;
    quantity: number;
  }>;
  observation?: string;
}

export interface ICompanyPageViewModel {
  // Estado básico
  profile: CompanyProfile | null;
  products: CompanyProduct[];
  showcaseProducts: CompanyProduct[];
  config: CompanyConfig | null;
  isLoading: boolean;
  primaryColor: string;
  secondaryColor: string;

  // Estado relacionado ao carrinho
  isCartConfirmationVisible: boolean;
  lastAddedToCartItem: CartConfirmationData | null;
  showCartConfirmation: (itemData: CartConfirmationData) => void;
  hideCartConfirmation: () => void;

  // Funções para formatação e informações da empresa
  getFormattedAddress: () => string;
  getFormattedWorkingHours: () => string;
  getWhatsAppLink: () => string;
  hasDelivery: () => boolean;
  shouldShowDeliveryInfo: () => boolean;
  isCartEnabled: () => boolean;
  getGalleryImages: () => string[];

  // Conteúdo adicional e customização
  customProducts: CustomProduct[];
  getProductAddonLists: (productId: string) => Promise<ProductAddonList[]>;

  // Estado e controle do filtro de categorias
  isCategoryFilterVisible: boolean;
  categoryFilterData: CategoryFilterData | null;
  setCategoryFilterVisible: (
    visible: boolean,
    data: CategoryFilterData
  ) => void;
}
