// Path: src/features/category-page/hooks/use-category-details.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";

export function useCategoryDetails(categorySlug: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["category-details", categorySlug],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/categories/${categorySlug}`);
        return response.data.data;
      } catch (error) {
        console.error(
          `Erro ao buscar detalhes da categoria ${categorySlug}:`,
          error
        );
        return null;
      }
    },
    enabled: !!categorySlug,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    categoryName: data?.nome || null,
    categoryImage: data?.imagem || null,
    isLoading,
  };
}
