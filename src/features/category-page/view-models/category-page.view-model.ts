// Path: src/features/category-page/view-models/category-page.view-model.ts
import { useCategoryPage } from "../hooks/use-category-page";
import { ICategoryPageViewModel } from "./category-page.view-model.interface";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";

export function useCategoryPageViewModel(
  categorySlug: string
): ICategoryPageViewModel {
  const {
    subcategories,
    companies,
    showcaseProducts,
    selectedSubcategory,
    setSelectedSubcategory,
    isLoading,
  } = useCategoryPage(categorySlug);

  // Buscar informações da categoria para obter o nome
  const { data: categoryData } = useQuery({
    queryKey: ["category", categorySlug],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/categories/${categorySlug}`);
        return response.data.data;
      } catch (error) {
        console.error(`Erro ao buscar categoria ${categorySlug}:`, error);
        return null;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    subcategories,
    companies,
    showcaseProducts,
    selectedSubcategory,
    setSelectedSubcategory,
    isLoading,
    categoryName: categoryData?.nome || null,
  };
}
