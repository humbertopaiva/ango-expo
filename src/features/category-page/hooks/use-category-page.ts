// Path: src/features/category-page/hooks/use-category-page.ts
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryPageService } from "../services/category-page.service";

export function useCategoryPage(categorySlug: string) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  // Busca subcategorias usando a rota correta
  const { data: subcategories = [], isLoading: isLoadingSubcategories } =
    useQuery({
      queryKey: ["category-page", "subcategories", categorySlug],
      queryFn: () => categoryPageService.getSubcategories(categorySlug),
      staleTime: 5 * 60 * 1000,
    });

  // Busca empresas
  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["category-page", "companies", categorySlug],
    queryFn: () => categoryPageService.getCompaniesByCategory(categorySlug),
    staleTime: 5 * 60 * 1000,
  });

  // Filtra empresas baseado na subcategoria selecionada
  const filteredCompanies = useMemo(() => {
    if (!selectedSubcategory) return companies;

    return companies.filter((company) =>
      company.empresa.subcategorias.some(
        (sub) => sub.subcategorias_empresas_id.slug === selectedSubcategory
      )
    );
  }, [companies, selectedSubcategory]);

  return {
    subcategories,
    companies: filteredCompanies,
    selectedSubcategory,
    setSelectedSubcategory,
    isLoading: isLoadingSubcategories || isLoadingCompanies,
  };
}
