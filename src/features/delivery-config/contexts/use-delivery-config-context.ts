// src/features/delivery-config/contexts/use-delivery-config-context.ts
import { useContext } from "react";
import { DeliveryConfigContext } from "./delivery-config.context-value";

export const useDeliveryConfigContext = () => {
  const context = useContext(DeliveryConfigContext);
  if (!context) {
    throw new Error(
      "useDeliveryConfigContext must be used within a DeliveryConfigProvider"
    );
  }
  return context;
};
