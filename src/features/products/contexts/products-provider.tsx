import { ReactNode } from "react";
import { ProductsContext } from "./products.context-value";
import { useProductsViewModel } from "../view-models/products.view-model";

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const viewModel = useProductsViewModel();

  return (
    <ProductsContext.Provider value={viewModel}>
      {children}
    </ProductsContext.Provider>
  );
}
