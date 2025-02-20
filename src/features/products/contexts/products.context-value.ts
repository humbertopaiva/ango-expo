import { createContext } from "react";
import { IProductsViewModel } from "../view-models/products.view-model.interface";

export const ProductsContext = createContext<IProductsViewModel | undefined>(
  undefined
);
