// Path: src/features/custom-products/contexts/custom-products-provider.tsx
import { ReactNode } from "react";
import { CustomProductsContext } from "./custom-products.context-value";
import { useCustomProductsViewModel } from "../view-models/custom-products.view-model";

interface CustomProductsProviderProps {
  children: ReactNode;
}

export function CustomProductsProvider({
  children,
}: CustomProductsProviderProps) {
  const viewModel = useCustomProductsViewModel();

  return (
    <CustomProductsContext.Provider value={viewModel}>
      {children}
    </CustomProductsContext.Provider>
  );
}
