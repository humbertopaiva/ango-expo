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

  // Busca produtos da vitrine
  const { data: showcaseProducts = [], isLoading: isLoadingShowcase } =
    useQuery({
      queryKey: ["category-page", "showcase", categorySlug],
      queryFn: () => categoryPageService.getCategoryShowcase(categorySlug),
      staleTime: 5 * 60 * 1000,
    });

  // Filtra empresas baseado na subcategoria selecionada
  const filteredCompanies = useMemo(() => {
    if (!selectedSubcategory) return companies;

    return companies.filter((company) =>
      company.subcategorias.some(
        (sub) => sub.subcategorias_empresas_id.slug === selectedSubcategory
      )
    );
  }, [companies, selectedSubcategory]);

  // Filtra produtos baseado nas empresas filtradas
  const filteredShowcaseProducts = useMemo(() => {
    if (!selectedSubcategory) return showcaseProducts;

    const filteredCompanySlugs = filteredCompanies.map(
      (company) => company.slug
    );

    return showcaseProducts.filter((product) => {
      // Adaptação para lidar com diferentes estruturas de dados
      const companySlug =
        typeof product.empresa === "string"
          ? product.empresa
          : (product.empresa as any)?.slug;

      return filteredCompanySlugs.includes(companySlug);
    });
  }, [showcaseProducts, filteredCompanies, selectedSubcategory]);

  return {
    subcategories,
    companies: filteredCompanies,
    showcaseProducts: filteredShowcaseProducts,
    selectedSubcategory,
    setSelectedSubcategory,
    isLoading:
      isLoadingSubcategories || isLoadingCompanies || isLoadingShowcase,
  };
}
