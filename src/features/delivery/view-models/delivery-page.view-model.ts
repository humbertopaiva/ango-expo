// src/features/delivery/view-models/delivery-page.view-model.ts
import { useDeliveryPage } from "../hooks/use-delivery-page";
import { IDeliveryPageViewModel } from "./delivery-page.view-model.interface";

export function useDeliveryPageViewModel(): IDeliveryPageViewModel {
  const {
    profiles,
    subcategories,
    showcaseProducts,
    selectedSubcategory,
    setSelectedSubcategory,
    isLoading,
  } = useDeliveryPage();

  return {
    profiles,
    subcategories,
    showcaseProducts,
    selectedSubcategory,
    setSelectedSubcategory,
    isLoading,
  };
}
