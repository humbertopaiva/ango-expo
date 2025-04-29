// Path: src/features/delivery/view-models/delivery-page.view-model.interface.ts
import { CompanyWithShowcase } from "../models/company-with-showcase";
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";
import { Subcategory } from "../models/subcategory";

export interface IDeliveryViewModel {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubcategories: string[];
  toggleSubcategory: (slug: string | null) => void;
  setSelectedSubcategory: (slug: string | null) => void;
  subcategories: Subcategory[];
  profiles: DeliveryProfile[];
  filteredProfiles: DeliveryProfile[];
  isLoading: boolean;
  refetchProfiles: () => void;
  showcases: Record<string, DeliveryShowcaseItem[]>;
  isLoadingShowcases: boolean;
  companiesWithShowcases: DeliveryProfile[];
  companiesWithShowcaseMapped: CompanyWithShowcase[];
  totalShowcaseItems: number;
  vitrinesCount: number;
  openCompanies: DeliveryProfile[];
  getShowcaseItemsBySlug: (slug: string) => DeliveryShowcaseItem[];
}
