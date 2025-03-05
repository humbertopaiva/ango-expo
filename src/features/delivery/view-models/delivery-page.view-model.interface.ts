// src/features/delivery/view-models/delivery-page.view-model.interface.ts
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliverySubcategory } from "../models/delivery-subcategory";
import { DeliveryShowcaseProduct } from "../models/delivery-showcase";

export interface IDeliveryPageViewModel {
  profiles: DeliveryProfile[];
  subcategories: DeliverySubcategory[];
  showcaseProducts: Record<string, DeliveryShowcaseProduct[]>;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (slug: string | null) => void;
  isLoading: boolean;
}
