// Path: src/features/delivery/view-models/delivery-page.view-model.ts
import { useEffect } from "react";
import { useDeliveryPage } from "../hooks/use-delivery-page";
import { IDeliveryViewModel } from "./delivery-page.view-model.interface";
import { useDeliveryShowcases } from "../hooks/use-delivery-showcases";

export function useDeliveryViewModel(): IDeliveryViewModel {
  const {
    searchQuery,
    setSearchQuery,
    selectedSubcategories,
    toggleSubcategory,
    setSelectedSubcategory,
    subcategories,
    profiles,
    filteredProfiles,
    isLoading,
    refetchProfiles,
  } = useDeliveryPage();

  const {
    showcases,
    isLoading: isLoadingShowcases,
    companiesWithShowcases,
    companiesWithShowcaseMapped, // Nome corrigido
  } = useDeliveryShowcases(filteredProfiles);

  // Cálculo do total de itens em destaque
  const totalShowcaseItems = Object.values(showcases).reduce(
    (acc, items) => acc + items.length,
    0
  );

  // Contagem de vitrines (empresas com destaque)
  const vitrinesCount = companiesWithShowcases.length;

  useEffect(() => {
    console.log("DeliveryViewModel initialized");

    // Força um refetch inicial para garantir que os dados estejam disponíveis
    if (profiles.length === 0 || subcategories.length === 0) {
      refetchProfiles();
    }

    return () => {
      console.log("DeliveryViewModel unmounted");
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedSubcategories,
    toggleSubcategory,
    setSelectedSubcategory,
    subcategories,
    profiles,
    filteredProfiles,
    isLoading,
    refetchProfiles,
    showcases,
    isLoadingShowcases,
    companiesWithShowcases,
    companiesWithShowcaseMapped,
    totalShowcaseItems,
    vitrinesCount,
  };
}
