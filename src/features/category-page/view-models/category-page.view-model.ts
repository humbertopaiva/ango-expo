// Path: src/features/category-page/view-models/category-page.view-model.ts
import { useCategoryPage } from "../hooks/use-category-page";
import { ICategoryPageViewModel } from "./category-page.view-model.interface";

export function useCategoryPageViewModel(
  categorySlug: string
): ICategoryPageViewModel {
  const {
    subcategories,
    companies,
    selectedSubcategory,
    setSelectedSubcategory,
    isLoading,
  } = useCategoryPage(categorySlug);

  // Obtém o nome da categoria a partir do primeiro item da lista de empresas, se disponível
  const categoryName =
    companies.length > 0 && companies[0].empresa?.categoria?.nome
      ? companies[0].empresa.categoria.nome
      : categorySlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    subcategories,
    companies,
    selectedSubcategory,
    setSelectedSubcategory,
    isLoading,
    categoryName,
  };
}
