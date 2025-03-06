// Path: src/features/delivery/contexts/delivery.context-value.ts
import { createContext } from "react";
import { IDeliveryViewModel } from "../view-models/delivery-page.view-model.interface";

export const DeliveryContext = createContext<IDeliveryViewModel | undefined>(
  undefined
);
