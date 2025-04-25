// Path: src/features/custom-products/contexts/use-custom-products-context.ts
import { useContext } from "react";
import { CustomProductsContext } from "./custom-products.context-value";

export const useCustomProductsContext = () => {
  const context = useContext(CustomProductsContext);
  if (!context) {
    throw new Error(
      "useCustomProductsContext must be used within a CustomProductsProvider"
    );
  }
  return context;
};
