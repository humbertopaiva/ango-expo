// src/features/commerce/view-models/commerce.view-model.ts
import { useCommerce } from "../hooks/use-commerce";
import { ICommerceViewModel } from "./commerce.view-model.interface";

export function useCommerceViewModel(): ICommerceViewModel {
  const {
    categories,
    latestLeaflets,
    showcaseCompanies,
    showcaseProducts,
    isLoadingProducts,
    isLoading,
  } = useCommerce();

  return {
    categories,
    latestLeaflets,
    showcaseCompanies,
    showcaseProducts,
    isLoadingProducts,
    isLoading,
  };
}
