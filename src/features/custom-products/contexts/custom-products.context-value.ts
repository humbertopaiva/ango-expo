// Path: src/features/custom-products/contexts/custom-products.context-value.ts
import { createContext } from "react";
import { ICustomProductsViewModel } from "../view-models/custom-products.view-model.interface";

export const CustomProductsContext = createContext<
  ICustomProductsViewModel | undefined
>(undefined);
