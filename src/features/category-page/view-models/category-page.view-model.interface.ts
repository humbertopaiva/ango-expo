// Path: src/features/category-page/view-models/category-page.view-model.interface.ts (corrigido)
import { CategoryCompany } from "../models/category-company";
import { Subcategory } from "../models/subcategory";
import { ShowcaseProduct } from "@/src/features/commerce/models/showcase-product";

export interface ICategoryPageViewModel {
  subcategories: Subcategory[];
  companies: CategoryCompany[];
  showcaseProducts: ShowcaseProduct[];
  selectedSubcategory: string | null;
  setSelectedSubcategory: (slug: string | null) => void;
  isLoading: boolean;
  categoryName: string;
}
