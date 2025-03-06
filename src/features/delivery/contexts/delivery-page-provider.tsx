// Path: src/features/delivery/contexts/delivery-provider.tsx
import React, { ReactNode } from "react";
import { useDeliveryViewModel } from "../view-models/delivery-page.view-model";
import { DeliveryContext } from "./delivery-page.context-value";

interface DeliveryProviderProps {
  children: ReactNode;
}

export function DeliveryProvider({ children }: DeliveryProviderProps) {
  const viewModel = useDeliveryViewModel();

  return (
    <DeliveryContext.Provider value={viewModel}>
      {children}
    </DeliveryContext.Provider>
  );
}
