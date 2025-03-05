// src/features/delivery/contexts/delivery-page.context-value.ts
import { createContext } from "react";
import { IDeliveryPageViewModel } from "../view-models/delivery-page.view-model.interface";

// Criando o contexto com um valor inicial undefined
export const DeliveryPageContext = createContext<
  IDeliveryPageViewModel | undefined
>(undefined);
