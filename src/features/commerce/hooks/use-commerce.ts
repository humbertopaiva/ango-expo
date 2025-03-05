// src/features/commerce/hooks/use-commerce.ts
import { useQuery, useQueries } from "@tanstack/react-query";
import { commerceService } from "../services/commerce.service";
import { ShowcaseCompany } from "../models/showcase-company";
import { ShowcaseProduct } from "../models/showcase-product";

export function useCommerce() {
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["commerce", "categories"],
    queryFn: commerceService.getCategories,
  });

  const { data: latestLeaflets = [], isLoading: isLoadingLeaflets } = useQuery({
    queryKey: ["commerce", "leaflets"],
    queryFn: commerceService.getLatestLeaflets,
  });

  const { data: showcaseCompanies = [], isLoading: isLoadingShowcase } =
    useQuery({
      queryKey: ["commerce", "showcase"],
      queryFn: commerceService.getLatestShowcaseCompanies,
    });

  // Usando useQueries para fazer todas as requisições de produtos em paralelo
  const showcaseQueries = useQueries({
    queries: showcaseCompanies.map((company: ShowcaseCompany) => ({
      queryKey: ["company-showcase", company.slug],
      queryFn: () => commerceService.getCompanyShowcase(company.slug),
      enabled: !!company.slug, // Só executa se tiver o slug
      staleTime: 5 * 60 * 1000, // Cache de 5 minutos
    })),
  });

  // Transformando os resultados em um objeto mais fácil de usar
  const showcaseProducts = showcaseCompanies.reduce((acc, company, index) => {
    const query = showcaseQueries[index];
    return {
      ...acc,
      [company.slug]: query.data || [],
    };
  }, {} as Record<string, ShowcaseProduct[]>);

  const isLoadingProducts = showcaseQueries.some((query) => query.isLoading);

  return {
    categories,
    latestLeaflets,
    showcaseCompanies,
    showcaseProducts,
    isLoading: isLoadingCategories || isLoadingLeaflets || isLoadingShowcase,
    isLoadingProducts,
  };
}
