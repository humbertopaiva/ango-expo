// Path: src/features/commerce/hooks/use-vitrine.ts
import { useState, useEffect } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { vitrineService } from "../services/vitrine.service";
import { ShowcaseCompany } from "../models/showcase-company";
import { ShowcaseItem } from "../models/showcase-item";

export interface CompanyWithVitrine extends ShowcaseCompany {
  vitrineItems: ShowcaseItem[];
}

export function useVitrine() {
  const [companiesWithVitrine, setCompaniesWithVitrine] = useState<
    CompanyWithVitrine[]
  >([]);

  // Buscar empresas com vitrines recentes
  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["vitrine", "companies"],
    queryFn: () => vitrineService.getRecentVitrines(),
  });

  // Realizar queries para buscar os itens de vitrine de cada empresa
  const vitrineQueries = useQueries({
    queries: companies.map((company) => ({
      queryKey: ["vitrine", "items", company.slug],
      queryFn: () => vitrineService.getCompanyVitrineItems(company.slug),
      enabled: companies.length > 0,
    })),
  });

  const isLoadingItems = vitrineQueries.some((query) => query.isLoading);
  const isAllQueriesSuccess = vitrineQueries.every((query) => query.isSuccess);
  const isAllQueriesSettled = vitrineQueries.every(
    (query) => query.isSuccess || query.isError
  );

  // Combinar os dados quando estiverem prontos
  useEffect(() => {
    // Verificar se temos empresas e se todas as queries terminaram (com sucesso ou erro)
    if (companies.length > 0 && isAllQueriesSettled && !isLoadingCompanies) {
      const companiesData = companies.map((company, index) => ({
        ...company,
        vitrineItems: vitrineQueries[index].data || [],
      }));

      // Filtrar apenas empresas que têm itens na vitrine
      const filteredCompanies = companiesData.filter(
        (company) => company.vitrineItems.length > 0
      );

      setCompaniesWithVitrine(filteredCompanies);
    }

    console.log("EMPRESAS VITRINE", companies);
  }, [companies, isLoadingCompanies, isAllQueriesSettled]);

  return {
    companiesWithVitrine,
    isLoading: isLoadingCompanies || isLoadingItems,
  };
}
