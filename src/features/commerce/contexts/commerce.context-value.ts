import { createContext } from "react";
import { ICommerceViewModel } from "../view-models/commerce.view-model.interface";

export const CommerceContext = createContext<ICommerceViewModel | undefined>(
  undefined
);
