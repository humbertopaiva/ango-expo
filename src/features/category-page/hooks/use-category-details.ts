// Path: src/features/category-page/hooks/use-category-details.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";

export function useCategoryDetails(categorySlug: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["category-details", categorySlug],
    queryFn: async () => {
      try {
        // Usando a rota correta para dados da categoria - esta rota pode estar em outro serviço
        const response = await api.get(
          `/api/categories/segment/comercio-local`
        );
        // Filtramos para encontrar a categoria específica pelo slug
        const category = response.data.data.find(
          (cat: any) => cat.slug === categorySlug
        );

        return category || null;
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
