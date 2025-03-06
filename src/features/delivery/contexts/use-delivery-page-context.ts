// Path: src/features/delivery/contexts/use-delivery-context.ts
import { useContext } from "react";
import { DeliveryContext } from "./delivery-page.context-value";

export const useDeliveryContext = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error(
      "useDeliveryContext must be used within a DeliveryProvider"
    );
  }
  return context;
};
