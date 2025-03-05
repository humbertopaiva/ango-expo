import { Category } from "../models/category";
import { Leaflet } from "../models/leaflet";
import { ShowcaseCompany } from "../models/showcase-company";
import { ShowcaseProduct } from "../models/showcase-product";

export interface ICommerceViewModel {
  categories: Category[];
  latestLeaflets: Leaflet[];
  showcaseCompanies: ShowcaseCompany[];
  showcaseProducts: Record<string, ShowcaseProduct[]>;
  isLoading: boolean;
  isLoadingProducts: boolean;
}
