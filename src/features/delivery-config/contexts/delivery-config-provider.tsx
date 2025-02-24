// src/features/delivery-config/contexts/delivery-config-provider.tsx
import { ReactNode } from "react";
import { DeliveryConfigContext } from "./delivery-config.context-value";
import { useDeliveryConfigViewModel } from "../view-models/delivery-config.view-model";

interface DeliveryConfigProviderProps {
  children: ReactNode;
}

export function DeliveryConfigProvider({
  children,
}: DeliveryConfigProviderProps) {
  const viewModel = useDeliveryConfigViewModel();

  return (
    <DeliveryConfigContext.Provider value={viewModel}>
      {children}
    </DeliveryConfigContext.Provider>
  );
}
