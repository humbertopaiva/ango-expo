// src/features/company-page/view-models/company-page.view-model.interface.ts
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

export interface ICompanyPageViewModel {
  profile: CompanyProfile | null;
  products: CompanyProduct[];
  showcaseProducts: CompanyProduct[];
  config: CompanyConfig | null;
  isLoading: boolean;
  primaryColor: string;
  secondaryColor: string;

  getFormattedAddress: () => string;
  getFormattedWorkingHours: () => string;
  getWhatsAppLink: () => string;
  hasDelivery: () => boolean;

  shouldShowDeliveryInfo: () => boolean;
  isCartEnabled: () => boolean;

  getGalleryImages: () => string[];

  customProducts: CustomProduct[];
  getProductAddonLists: (productId: string) => Promise<ProductAddonList[]>;

  isCategoryFilterVisible: boolean;
  categoryFilterData: CategoryFilterData | null;
  setCategoryFilterVisible: (
    visible: boolean,
    data: CategoryFilterData
  ) => void;
}
