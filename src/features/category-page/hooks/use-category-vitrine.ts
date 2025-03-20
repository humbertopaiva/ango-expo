// Path: src/features/category-page/hooks/use-category-vitrine.ts

import { useState, useEffect } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { categoryPageService } from "../services/category-page.service";
import { ShowcaseCompany } from "@/src/features/commerce/models/showcase-company";
import { ShowcaseItem } from "@/src/features/commerce/models/showcase-item";

export interface CompanyWithVitrine extends ShowcaseCompany {
  vitrineItems: ShowcaseItem[];
}

export function useCategoryVitrine(categorySlug: string) {
  const [companiesWithVitrine, setCompaniesWithVitrine] = useState<
    CompanyWithVitrine[]
  >([]);

  // Buscar empresas com vitrines nesta categoria
  const { data: showcaseCompanies = [], isLoading: isLoadingCompanies } =
    useQuery({
      queryKey: ["category-vitrine", "companies", categorySlug],
      queryFn: () =>
        categoryPageService.getCategoryShowcaseCompanies(categorySlug),
    });

  // Realizar queries para buscar os itens de vitrine de cada empresa
  const vitrineQueries = useQueries({
    queries: showcaseCompanies.map((company) => ({
      queryKey: ["category-vitrine", "items", company.slug],
      queryFn: () => categoryPageService.getCompanyVitrineItems(company.slug),
      enabled: showcaseCompanies.length > 0,
    })),
  });

  const isLoadingItems = vitrineQueries.some((query) => query.isLoading);
  const isAllQueriesSettled = vitrineQueries.every(
    (query) => query.isSuccess || query.isError
  );

  // Combinar os dados quando estiverem prontos
  useEffect(() => {
    if (
      showcaseCompanies.length > 0 &&
      isAllQueriesSettled &&
      !isLoadingCompanies
    ) {
      const companiesData = showcaseCompanies.map((company, index) => ({
        ...company,
        vitrineItems: vitrineQueries[index].data || [],
      }));

      // Filtrar apenas empresas que têm itens na vitrine
      const filteredCompanies = companiesData.filter(
        (company) => company.vitrineItems.length > 0
      );

      setCompaniesWithVitrine(filteredCompanies);
    }
  }, [showcaseCompanies, isLoadingCompanies, isAllQueriesSettled]);

  return {
    companiesWithVitrine,
    isLoading: isLoadingCompanies || isLoadingItems,
  };
}
