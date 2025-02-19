// src/features/categories/contexts/categories.context-value.ts
import { createContext } from "react";
import { ICategoriesViewModel } from "../view-models/categories.view-model.interface";

export const CategoriesContext = createContext<
  ICategoriesViewModel | undefined
>(undefined);
