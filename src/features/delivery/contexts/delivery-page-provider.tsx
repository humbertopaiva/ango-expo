// src/features/delivery/contexts/delivery-page-provider.tsx
import React, { ReactNode } from "react";
import { DeliveryPageContext } from "./delivery-page.context-value";
import { useDeliveryPageViewModel } from "../view-models/delivery-page.view-model";

interface DeliveryPageProviderProps {
  children: ReactNode;
}

export function DeliveryPageProvider({ children }: DeliveryPageProviderProps) {
  try {
    const viewModel = useDeliveryPageViewModel();

    // Adicione um fallback para caso o viewModel falhe
    if (!viewModel) {
      console.error("DeliveryPageViewModel failed to initialize");
      return (
        <DeliveryPageContext.Provider
          value={{
            profiles: [],
            subcategories: [],
            showcaseProducts: {},
            selectedSubcategory: null,
            setSelectedSubcategory: () => {},
            isLoading: true,
          }}
        >
          {children}
        </DeliveryPageContext.Provider>
      );
    }

    return (
      <DeliveryPageContext.Provider value={viewModel}>
        {children}
      </DeliveryPageContext.Provider>
    );
  } catch (error) {
    console.error("Error in DeliveryPageProvider:", error);

    // Fallback em caso de erro
    return (
      <DeliveryPageContext.Provider
        value={{
          profiles: [],
          subcategories: [],
          showcaseProducts: {},
          selectedSubcategory: null,
          setSelectedSubcategory: () => {},
          isLoading: true,
        }}
      >
        {children}
      </DeliveryPageContext.Provider>
    );
  }
}
