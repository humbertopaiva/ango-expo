// Path: src/features/category-page/contexts/use-category-page-context.ts
import { useContext } from "react";
import { CategoryPageContext } from "./category-page.context-value";

export const useCategoryPageContext = () => {
  const context = useContext(CategoryPageContext);
  if (!context) {
    throw new Error(
      "useCategoryPageContext must be used within a CategoryPageProvider"
    );
  }
  return context;
};
