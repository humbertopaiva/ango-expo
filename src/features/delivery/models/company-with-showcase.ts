// Path: src/features/delivery/models/company-with-showcase.ts
import { DeliveryProfile } from "./delivery-profile";
import { DeliveryShowcaseItem } from "./delivery-showcase-item";

export interface CompanyWithShowcase extends DeliveryProfile {
  showcaseItems: DeliveryShowcaseItem[];
}
