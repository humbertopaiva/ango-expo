// src/features/delivery-config/contexts/delivery-config.context-value.ts
import { createContext } from "react";
import { IDeliveryConfigViewModel } from "../view-models/delivery-config.view-model.interface";

export const DeliveryConfigContext = createContext<
  IDeliveryConfigViewModel | undefined
>(undefined);
