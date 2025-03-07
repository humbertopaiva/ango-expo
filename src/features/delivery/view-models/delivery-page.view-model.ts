// Path: src/features/delivery/view-models/delivery.view-model.ts
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
    companiesWithShowcaseMapped,
  } = useDeliveryShowcases(filteredProfiles);

  useEffect(() => {
    console.log("DeliveryViewModel initialized");

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
    companiesWithShowcasesMapped: companiesWithShowcaseMapped,
  };
}
