// src/features/categories/contexts/use-categories-context.ts
import { useContext } from "react";
import { CategoriesContext } from "./categories.context-value";

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error(
      "useCategoriesContext must be used within a CategoriesProvider"
    );
  }
  return context;
};
