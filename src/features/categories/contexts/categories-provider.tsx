// src/features/categories/contexts/categories-provider.tsx
import { ReactNode } from "react";
import { CategoriesContext } from "./categories.context-value";
import { useCategoriesViewModel } from "../view-models/categories.view-model";

interface CategoriesProviderProps {
  children: ReactNode;
}

export function CategoriesProvider({ children }: CategoriesProviderProps) {
  const viewModel = useCategoriesViewModel();

  return (
    <CategoriesContext.Provider value={viewModel}>
      {children}
    </CategoriesContext.Provider>
  );
}
