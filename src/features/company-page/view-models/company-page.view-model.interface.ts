// src/features/company-page/view-models/company-page.view-model.interface.ts
import { CompanyProfile } from "../models/company-profile";
import { CompanyProduct } from "../models/company-product";
import { CompanyConfig } from "../models/company-config";

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
}
