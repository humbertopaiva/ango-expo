// Path: src/features/category-page/contexts/category-page.context-value.ts
import { createContext } from "react";
import { ICategoryPageViewModel } from "../view-models/category-page.view-model.interface";

// Definimos o tipo correto com valor inicial undefined
export const CategoryPageContext = createContext<
  ICategoryPageViewModel | undefined
>(undefined);
