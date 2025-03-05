// Path: src/features/category-page/contexts/category-page-provider.tsx
import React, { ReactNode } from "react";
import { CategoryPageContext } from "./category-page.context-value";
import { useCategoryPageViewModel } from "../view-models/category-page.view-model";

interface CategoryPageProviderProps {
  children: ReactNode;
  categorySlug: string;
}

export function CategoryPageProvider({
  children,
  categorySlug,
}: CategoryPageProviderProps) {
  const viewModel = useCategoryPageViewModel(categorySlug);

  return (
    <CategoryPageContext.Provider value={viewModel}>
      {children}
    </CategoryPageContext.Provider>
  );
}
