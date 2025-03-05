// src/features/delivery/contexts/use-delivery-page-context.ts
import { useContext } from "react";
import { DeliveryPageContext } from "./delivery-page.context-value";

export const useDeliveryPageContext = () => {
  const context = useContext(DeliveryPageContext);
  if (!context) {
    throw new Error(
      "useDeliveryPageContext must be used within a DeliveryPageProvider"
    );
  }
  return context;
};
