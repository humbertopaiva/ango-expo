// src/features/commerce/contexts/use-commerce-context.ts
import { useContext } from "react";
import { CommerceContext } from "./commerce.context-value";

export const useCommerceContext = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error(
      "useCommerceContext must be used within a CommerceProvider"
    );
  }
  return context;
};
