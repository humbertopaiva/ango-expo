// Path: src/features/category-page/view-models/category-page.view-model.interface.ts
import { CategoryCompany } from "../models/category-company";
import { Subcategory } from "../models/subcategory";

export interface ICategoryPageViewModel {
  subcategories: Subcategory[];
  companies: CategoryCompany[];
  selectedSubcategory: string | null;
  setSelectedSubcategory: (slug: string | null) => void;
  isLoading: boolean;
  categoryName: string;
}
