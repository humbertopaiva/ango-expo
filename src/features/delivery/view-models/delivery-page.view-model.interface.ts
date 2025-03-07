// Path: src/features/delivery/view-models/delivery.view-model.interface.ts
import { DeliveryProfile } from "../models/delivery-profile";
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
}
